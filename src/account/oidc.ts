// PCNav account — OIDC identity adapter (local mock provider, Amazon Cognito).
// The UI talks only to `identity` (IdentityAdapter). It is a standard OIDC Authorization Code +
// PKCE client for whichever provider profile config.ts selects (local mock, or Amazon Cognito).
// Tokens live in this module's closure only: never in localStorage, sessionStorage, cookies or
// IndexedDB. sessionStorage holds only the one-redirect sign-in transaction and the loop guard.
import { PROVIDER as P } from "./config";
import type { WithToken } from "./providers/types";
import { DELETED_KEY, ReauthRequiredError, RequestError, SessionExpiredError } from "./core";
import type { AccountState, Claims, IdentityAdapter } from "./core";

type Tokens = { id: string; access: string; refresh: string; accessExp: number };
const TX_KEY = "pcnav.account.signin";
// A non-secret hint ("1") that this browser had a PCNav sign-in, so a reload or direct visit
// tries a silent provider sign-in. It is not a credential: without a live provider session it
// restores nothing. It is cleared on sign-out, sign-out everywhere, deletion and silent failure.
const HINT_KEY = "pcnav.account.session-hint";
// Loop guard: the time of an unanswered silent attempt. A second attempt within the window
// is refused and the hint dropped, so a misbehaving provider cannot cause a redirect loop.
const SILENT_KEY = "pcnav.account.silent-at";
const SILENT_WINDOW_MS = 30000;
const SILENT_ERRORS = new Set(["login_required", "interaction_required", "consent_required", "account_selection_required"]);
let restoreAttempted = false;
const store = (fn: () => void) => { try { fn(); } catch { /* storage unavailable: no restore, no harm */ } };
const setHint = () => store(() => localStorage.setItem(HINT_KEY, "1"));
const clearHint = () => store(() => localStorage.removeItem(HINT_KEY));
const hasHint = () => { try { return localStorage.getItem(HINT_KEY) === "1"; } catch { return false; } };
let tokens: Tokens | null = null;
let state: AccountState = { status: "signed-out" };
const listeners = new Set<() => void>();
const set = (s: AccountState) => { state = s; listeners.forEach((l) => l()); };

const b64u = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
const rand = () => b64u(crypto.getRandomValues(new Uint8Array(32)));
const decode = (part: string) => JSON.parse(new TextDecoder().decode(fromB64u(part)));
const form = (o: Record<string, string>) => new URLSearchParams(o).toString();
const post = (url: string, o: Record<string, string>) =>
  fetch(url, { method: "POST", credentials: "omit", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form(o) });
const safeReturn = (p?: string) => (p && p.startsWith("/account") && !p.startsWith("//") ? p : "/account");

type Jwk = { kid: string; kty: string; alg?: string; use?: string; crv?: string; x?: string; y?: string; n?: string; e?: string };
const CLOCK_SKEW_S = 60;

async function importJwk(alg: string, jwk: Jwk) {
  // The key must be a signing key of the algorithm the token names; no substitution.
  if (jwk.alg !== undefined && jwk.alg !== alg) throw new Error("KEY_ALG_MISMATCH");
  if (jwk.use !== undefined && jwk.use !== "sig") throw new Error("KEY_USE_MISMATCH");
  if (alg === "RS256" && jwk.kty === "RSA") return crypto.subtle.importKey("jwk", { kty: "RSA", n: jwk.n, e: jwk.e }, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  if (alg === "ES256" && jwk.kty === "EC" && jwk.crv === "P-256") return crypto.subtle.importKey("jwk", { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y }, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  throw new Error("KEY_ALG_MISMATCH");
}

// Finds the signing key in the trusted key sets, in order. A key set that cannot be fetched is
// skipped; if no trusted set holds the key, verification FAILS. There is no unsigned path.
async function findKey(kid: string): Promise<Jwk> {
  for (const src of P.endpoints.jwksSources) {
    let set: { keys?: Jwk[] } | null = null;
    try { const r = await fetch(src, { credentials: "omit" }); if (r.ok) set = await r.json(); } catch { /* unreachable or refused cross-origin */ }
    const jwk = set?.keys?.find((k) => k.kid === kid);
    if (jwk) return jwk;
  }
  throw new Error("NO_TRUSTED_KEY");
}

// OIDC Core 3.1.3.7 ID-token validation. The signature is ALWAYS verified (the section's optional
// TLS shortcut is deliberately not used), then: alg in the provider's allow-list, iss exact, aud
// containing the client (azp when several), token_use "id", exp and iat with a 60 s skew, nonce.
async function verifyIdToken(tok: string, nonce: string): Promise<Claims> {
  const parts = String(tok || "").split(".");
  if (parts.length !== 3) throw new Error("MALFORMED");
  const [h, p, s] = parts;
  let header: { alg?: string; kid?: string }, claims: Record<string, unknown>;
  try { header = decode(h); claims = decode(p); } catch { throw new Error("MALFORMED"); }
  if (!header.alg || !(P.algorithms as string[]).includes(header.alg)) throw new Error("BAD_ALG"); // refuses none, HS256 and others
  if (!header.kid) throw new Error("NO_KID");
  const key = await importJwk(header.alg, await findKey(header.kid));
  const params = header.alg === "RS256" ? { name: "RSASSA-PKCS1-v1_5" } : { name: "ECDSA", hash: "SHA-256" };
  let sig: Uint8Array<ArrayBuffer>;
  try { sig = fromB64u(s); } catch { throw new Error("MALFORMED"); }
  if (!(await crypto.subtle.verify(params, key, sig, new TextEncoder().encode(`${h}.${p}`)))) throw new Error("BAD_SIGNATURE");
  const now = Date.now() / 1000;
  if (claims.iss !== P.issuer) throw new Error("BAD_ISSUER");
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(P.clientId)) throw new Error("BAD_AUDIENCE");
  if (aud.length > 1 && claims.azp !== P.clientId) throw new Error("BAD_AZP");
  if (claims.token_use !== "id") throw new Error("BAD_TOKEN_USE");
  if (typeof claims.exp !== "number" || claims.exp <= now - CLOCK_SKEW_S) throw new Error("EXPIRED");
  if (typeof claims.iat === "number" && claims.iat > now + CLOCK_SKEW_S) throw new Error("ISSUED_IN_FUTURE");
  if (typeof nonce !== "string" || !nonce || claims.nonce !== nonce) throw new Error("BAD_NONCE");
  if (typeof claims.sub !== "string" || !claims.sub) throw new Error("NO_SUBJECT");
  return claims as unknown as Claims;
}

function accept(t: { id_token: string; access_token: string; refresh_token: string; expires_in: number }, claims: Claims) {
  tokens = { id: t.id_token, access: t.access_token, refresh: t.refresh_token, accessExp: localExpiry(t) };
  setHint();
  set({ status: claims.email_verified ? "signed-in" : "unverified", claims });
}
// Expiry is measured on this device's clock from the moment the token arrived, so a
// skewed device clock cannot make every request look expired.
function localExpiry(t: { expires_in?: number }) { return Date.now() / 1000 + Math.max(0, Number(t.expires_in) || 0); }

function expire() { tokens = null; set({ status: "expired", claims: state.claims }); }

// Single-flight: concurrent callers share one refresh. Refresh tokens may rotate and be single
// use, so two parallel refreshes would look like token reuse and end the session.
let refreshing: Promise<boolean> | null = null;
function refresh(): Promise<boolean> {
  if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
  return refreshing;
}
async function doRefresh(): Promise<boolean> {
  if (!tokens) return false;
  let r: Response;
  try { r = await post(P.endpoints.token, { grant_type: "refresh_token", client_id: P.clientId, refresh_token: tokens.refresh }); }
  catch { return false; }
  if (!r.ok) { expire(); return false; }
  const t = await r.json();
  // Without refresh-token rotation (Cognito's per-client setting), no new refresh token is
  // returned: keep the one we hold.
  tokens = { ...tokens, access: t.access_token, id: t.id_token || tokens.id, refresh: t.refresh_token || tokens.refresh, accessExp: localExpiry(t) };
  return true;
}

// Runs a provider call with a fresh access token; on an auth refusal, refreshes once and retries.
const withToken: WithToken = async (call, isAuthFailure = async (r) => r.status === 401) => {
  if (!tokens) throw new SessionExpiredError();
  if (tokens.accessExp - Date.now() / 1000 < 15 && !(await refresh())) throw new SessionExpiredError();
  let r = await call(tokens!.access);
  if (await isAuthFailure(r)) {
    if (!(await refresh())) throw new SessionExpiredError();
    r = await call(tokens!.access);
    if (await isAuthFailure(r)) { expire(); throw new SessionExpiredError(); }
  }
  return r;
};
const asRequestError = (e: unknown, fallback: string) =>
  e instanceof SessionExpiredError ? e : new RequestError(Number((e as { status?: number }).status) || 0, (e as Error).message || fallback);

let callbackRun: { search: string; done: Promise<string> } | null = null;

async function runCallback(search: string): Promise<string> {
  const q = new URLSearchParams(search);
  const raw = sessionStorage.getItem(TX_KEY);
  sessionStorage.removeItem(TX_KEY);
  if (!raw) { set({ status: "error", message: "This sign-in link has expired. Choose Sign In again." }); return "/account"; }
  const tx = JSON.parse(raw);
  store(() => sessionStorage.removeItem(SILENT_KEY));
  if (q.get("error")) {
    if (tx.silent) {
      // No usable provider session (expired, revoked, signed out or deleted): show normal Sign In.
      clearHint();
      set({ status: "signed-out", message: SILENT_ERRORS.has(q.get("error") || "") ? undefined : "We couldn't restore your session. Please sign in." });
      return tx.returnTo;
    }
    set({ status: "error", message: "Sign-in didn't complete. Please try again." }); return tx.returnTo;
  }
  if (q.get("state") !== tx.state) { set({ status: "error", message: "Sign-in couldn't be verified. Please try again." }); return tx.returnTo; }
  set({ status: "loading" });
  let r: Response;
  try { r = await post(P.endpoints.token, { grant_type: "authorization_code", client_id: P.clientId, code: q.get("code") || "", redirect_uri: P.redirect, code_verifier: tx.verifier }); }
  catch { set({ status: "error", message: "We couldn't reach the sign-in service. Check your connection and try again." }); return tx.returnTo; }
  if (!r.ok) { if (tx.silent) clearHint(); set({ status: "error", message: "Sign-in didn't complete. Please try again." }); return tx.returnTo; }
  const t = await r.json();
  try { accept(t, await verifyIdToken(t.id_token, tx.nonce)); }
  catch { tokens = null; set({ status: "error", message: "Sign-in couldn't be verified. Please try again." }); }
  return tx.returnTo;
}

function leaveTo(url: string) { tokens = null; clearHint(); set({ status: "signed-out" }); location.assign(url); }

export const oidcIdentity: IdentityAdapter = {
  getState: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  providerLabel: () => P.label,

  async signIn(opts = {}) {
    const tx = { state: rand(), nonce: rand(), verifier: rand(), returnTo: safeReturn(opts.returnTo), silent: !!opts.silent };
    sessionStorage.setItem(TX_KEY, JSON.stringify(tx));
    const challenge = b64u(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tx.verifier)));
    const signup = opts.screen === "signup";
    const u = new URL(signup && P.endpoints.signup ? P.endpoints.signup : P.endpoints.authorize);
    const q: Record<string, string> = { response_type: "code", client_id: P.clientId, redirect_uri: P.redirect, scope: P.scope, state: tx.state, nonce: tx.nonce, code_challenge: challenge, code_challenge_method: "S256" };
    if (signup && !P.endpoints.signup) q.screen = "signup";
    if (opts.forceLogin) { q.prompt = "login"; q.max_age = "0"; }
    if (opts.silent) q.prompt = "none";
    Object.entries(q).forEach(([k, v]) => u.searchParams.set(k, v));
    location.assign(u.toString());
  },

  async restore(returnTo) {
    if (!P.capabilities.silentRestore) return; // provider not verified to answer prompt=none without UI
    if (restoreAttempted || tokens || state.status !== "signed-out" || !hasHint()) return;
    restoreAttempted = true;
    let last = 0; try { last = Number(sessionStorage.getItem(SILENT_KEY) || 0); } catch { /* none */ }
    if (last && Date.now() - last < SILENT_WINDOW_MS) {
      clearHint(); store(() => sessionStorage.removeItem(SILENT_KEY));
      set({ status: "signed-out", message: "We couldn't restore your session. Please sign in." });
      return;
    }
    set({ status: "loading" });
    try {
      // Reachability check first: a top-level redirect to an unreachable provider would leave
      // the visitor on a browser error page instead of the normal Sign In.
      // Reachability only (not trust): an opaque no-cors response proves the provider answered.
      await fetch(P.endpoints.reachability, { mode: "no-cors", credentials: "omit", signal: AbortSignal.timeout(3000) });
    } catch {
      set({ status: "signed-out", message: "We couldn't reach the sign-in service to restore your session. You can sign in when it's available." });
      return;
    }
    store(() => sessionStorage.setItem(SILENT_KEY, String(Date.now())));
    await oidcIdentity.signIn({ returnTo, silent: true });
  },

  handleCallback(search) {
    // Idempotent: a remount of the callback page must not consume the transaction twice.
    // Every sign-in returns on a fresh page load, so one run per page load is exact.
    if (!callbackRun) callbackRun = { search, done: runCallback(search) };
    return callbackRun.done;
  },

  // Bearer-token calls to PCNav's own member API (provider-neutral).
  fetchWithAuth: (url, init = {}) =>
    withToken((t) => fetch(url, { ...init, credentials: "omit", headers: { ...(init.headers || {}), Authorization: `Bearer ${t}` } })),

  async getProfile() { try { return await P.api.getProfile(withToken); } catch (e) { throw asRequestError(e, "PROFILE_UNAVAILABLE"); } },
  async requestEmailChange(newEmail) { try { return await P.api.requestEmailChange(withToken, newEmail); } catch (e) { throw asRequestError(e, "EMAIL_CHANGE_FAILED"); } },
  async confirmEmailChange(code) {
    if (!P.api.confirmEmailChange) throw new RequestError(0, "NOT_SUPPORTED");
    try { await P.api.confirmEmailChange(withToken, code); } catch (e) { throw asRequestError(e, "EMAIL_CONFIRM_FAILED"); }
  },
  async resendVerification() { try { await P.api.resendVerification(withToken); } catch (e) { throw asRequestError(e, "RESEND_FAILED"); } },
  securityUrl: (action) => P.securityUrl(action),

  async signOut() {
    if (tokens) { try { await post(P.endpoints.revoke, { token: tokens.refresh, client_id: P.clientId }); } catch { /* signing out regardless */ } }
    leaveTo(P.logoutUrl());
  },
  async signOutEverywhere() {
    try { await P.api.globalSignOut(withToken); } catch (e) { throw asRequestError(e, "SIGNOUT_FAILED"); }
    // Global sign-out revokes tokens; the provider's own sign-in session ends at its logout URL.
    leaveTo(P.logoutUrl());
  },
  async deleteIdentity() {
    let result: "deleted" | "reauth-required";
    try { result = await P.api.deleteUser(withToken); } catch (e) { throw asRequestError(e, "DELETE_FAILED"); }
    if (result === "reauth-required") throw new ReauthRequiredError();
    store(() => sessionStorage.setItem(DELETED_KEY, "1"));
    leaveTo(P.logoutUrl());
  },
  recentlyAuthenticated: (max) => !!state.claims && Date.now() / 1000 - state.claims.auth_time <= max,
};
