// PCNav account — Supabase identity and member-data adapter (WNM-6, LOCAL prototype).
// Sign-in happens on PCNav's own pages (no hosted login). Tokens live in memory only:
// persistSession is off and the auth storage is an in-memory map, so nothing reaches
// localStorage, sessionStorage or IndexedDB. A reload therefore signs the member out (by design).
// Only the browser-safe publishable key is used here; privileged keys never reach this code.
import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";
import { DELETED_KEY, MfaRequiredError, ReauthRequiredError, RequestError, SessionExpiredError } from "./core";
import type { AccountState, Claims, DirectAuth, IdentityAdapter, MfaFactor, Profile, TotpEnrollment } from "./core";
import type { Interest, MemberDataAdapter } from "./data";
import { NO_ANSWERS, isEmpty, normalise, type OptionalAnswers } from "./onboarding";

const env = import.meta.env as Record<string, string | undefined>;
const URL_ = env.VITE_SUPABASE_URL || "";
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const SITE = env.VITE_PCNAV_SITE_ORIGIN || "http://127.0.0.1:4400";

// In-memory auth storage: the only place supabase-js may keep a session.
const memory = new Map<string, string>();
const memoryStorage = { getItem: (k: string) => memory.get(k) ?? null, setItem: (k: string, v: string) => { memory.set(k, v); }, removeItem: (k: string) => { memory.delete(k); } };

let client: SupabaseClient | null = null;
let state: AccountState = { status: "signed-out" };
let userSignedOut = false; // distinguishes a chosen sign-out from a session that ended on its own
const listeners = new Set<() => void>();
const set = (s: AccountState) => { state = s; listeners.forEach((l) => l()); };

const b64json = (part: string) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(part.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
const tokenClaims = (s: Session | null): Record<string, unknown> => { try { return s ? b64json(s.access_token.split(".")[1]) : {}; } catch { return {}; } };
const lastAuth = (s: Session | null) => {
  const amr = tokenClaims(s).amr as { timestamp?: number }[] | undefined;
  return Array.isArray(amr) ? Math.max(0, ...amr.map((a) => Number(a.timestamp) || 0)) : 0;
};
const claimsOf = (s: Session): Claims => ({ sub: s.user.id, email: s.user.email || "", email_verified: !!s.user.email_confirmed_at, auth_time: lastAuth(s) });

function sb(): SupabaseClient {
  if (!client) {
    if (!URL_ || !KEY) throw new Error("Supabase configuration missing");
    client = createClient(URL_, KEY, {
      auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false, flowType: "pkce", storage: memoryStorage, storageKey: "pcnav-wnm6" },
    });
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        const was = state.status;
        set(userSignedOut || was === "signed-out" ? { status: "signed-out" } : { status: "expired", claims: state.claims });
        return;
      }
      if (session && (event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || event === "MFA_CHALLENGE_VERIFIED")) void settle(session);
    });
  }
  return client;
}

// Decides signed-in vs mfa-required from the server's assurance level for this session.
async function settle(session: Session): Promise<"signed-in" | "mfa-required"> {
  const { data, error } = await sb().auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw new RequestError(0, "AAL_UNAVAILABLE");
  const needsMfa = data.nextLevel === "aal2" && data.currentLevel !== "aal2";
  set({ status: needsMfa ? "mfa-required" : session.user.email_confirmed_at ? "signed-in" : "unverified", claims: claimsOf(session) });
  return needsMfa ? "mfa-required" : "signed-in";
}
async function currentSession(): Promise<Session> {
  const { data } = await sb().auth.getSession();
  if (!data.session) throw new SessionExpiredError();
  return data.session;
}
const generic = (e: unknown, fallback: string) => {
  const msg = String((e as { message?: string })?.message || "");
  if (/jwt|expired|session/i.test(msg)) return new SessionExpiredError();
  return new RequestError(Number((e as { status?: number })?.status) || 0, fallback);
};
function go(path: string) { location.assign(path); }
const safeReturn = (p?: string) => (p && p.startsWith("/account") && !p.startsWith("//") ? p : "/account");

const direct: DirectAuth = {
  async signUp(email, password, captchaToken) {
    // Generic outcome: Supabase answers an already-registered address with the same shape.
    const { error } = await sb().auth.signUp({ email, password, options: { /* no user metadata: Join collects email and password only (WNM-9PB) */ emailRedirectTo: `${SITE}/account/verify`, ...(captchaToken ? { captchaToken } : {}) } });
    if (error) {
      // GoTrue (v2.188) answers an existing address with user_already_exists (confirmed) or
      // over_email_send_rate_limit (unconfirmed, per address). Both are shown exactly like a new
      // sign-up, so this page never reveals whether an account exists. (The raw API still does:
      // see the WNM-6 report.) Only a per-client throttle is reported as such.
      if (error.code === "user_already_exists" || error.code === "email_exists" || error.code === "over_email_send_rate_limit") return;
      if (error.code === "captcha_failed") throw new RequestError(400, "CAPTCHA_FAILED");
      if (error.code === "weak_password" || /password/i.test(error.message)) throw new RequestError(400, "WEAK_PASSWORD");
      if (error.status === 429) throw new RequestError(429, "RATE_LIMITED");
      throw new RequestError(error.status || 0, "SIGNUP_FAILED");
    }
  },
  async signInWithPassword(email, password, captchaToken) {
    userSignedOut = false;
    const { data, error } = await sb().auth.signInWithPassword({ email, password, ...(captchaToken ? { options: { captchaToken } } : {}) });
    if (error || !data.session) {
      if (error?.status === 429) throw new RequestError(429, "RATE_LIMITED");
      if (error?.code === "captcha_failed") throw new RequestError(400, "CAPTCHA_FAILED");
      if (/not confirmed/i.test(error?.message || "")) throw new RequestError(403, "EMAIL_NOT_CONFIRMED"); // only reachable with the right password
      throw new RequestError(400, "INVALID_CREDENTIALS");
    }
    return settle(data.session);
  },
  async verifyEmailLink(tokenHash, type) {
    const { data, error } = await sb().auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) throw new RequestError(error.status || 400, "LINK_INVALID");
    if (!data.session) return "email-change-pending";
    if (type === "email_change" && data.user?.new_email) return "email-change-pending";
    return settle(data.session);
  },
  async requestPasswordReset(email, captchaToken) {
    // Always the same outward result, whether or not an account uses this address. A per-address
    // or project email-quota 429 is NOT shown as a throttle: that would reveal the address exists.
    const { error } = await sb().auth.resetPasswordForEmail(email, { redirectTo: `${SITE}/account/reset`, ...(captchaToken ? { captchaToken } : {}) });
    if (error?.code === "captcha_failed") throw new RequestError(400, "CAPTCHA_FAILED");
    if (error?.status === 429 && error.code !== "over_email_send_rate_limit") throw new RequestError(429, "RATE_LIMITED");
  },
  async openPasswordReset(tokenHash) {
    const { data, error } = await sb().auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (error || !data.session) throw new RequestError(error?.status || 400, "LINK_INVALID");
    await settle(data.session);
  },
  async setNewPassword(password) {
    const { error } = await sb().auth.updateUser({ password });
    if (error) throw /aal2|mfa/i.test(error.message) ? new MfaRequiredError() : new RequestError(error.status || 400, /password/i.test(error.message) ? "WEAK_PASSWORD" : "UPDATE_FAILED");
  },
  async changePassword(newPassword) {
    const { error } = await sb().auth.updateUser({ password: newPassword });
    if (!error) return;
    if (/reauthenticat|nonce/i.test(error.message)) throw new ReauthRequiredError();
    if (/aal2|mfa/i.test(error.message)) throw new MfaRequiredError();
    throw new RequestError(error.status || 400, /password/i.test(error.message) ? "WEAK_PASSWORD" : "UPDATE_FAILED");
  },
  async mfaFactors(): Promise<MfaFactor[]> {
    const { data, error } = await sb().auth.mfa.listFactors();
    if (error) throw generic(error, "FACTORS_UNAVAILABLE");
    return (data.all || []).filter((f) => f.factor_type === "totp").map((f) => ({ id: f.id, status: f.status as MfaFactor["status"], friendlyName: f.friendly_name || "Authenticator app" }));
  },
  async enrollTotp(): Promise<TotpEnrollment> {
    // Remove abandoned, unverified enrolments first so a retry starts clean.
    for (const f of await direct.mfaFactors()) if (f.status === "unverified") await sb().auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await sb().auth.mfa.enroll({ factorType: "totp", friendlyName: `Authenticator app ${new Date().toISOString().slice(0, 10)}` });
    if (error || !data) throw generic(error, "ENROLL_FAILED");
    return { factorId: data.id, qrSvgDataUri: data.totp.qr_code, secret: data.totp.secret };
  },
  async verifyTotpEnrollment(factorId, code) {
    const { error } = await sb().auth.mfa.challengeAndVerify({ factorId, code });
    if (error) throw new RequestError(error.status || 400, "CODE_INVALID");
    await settle(await currentSession());
  },
  async challengeTotp(code) {
    const factor = (await direct.mfaFactors()).find((f) => f.status === "verified");
    if (!factor) throw new RequestError(400, "NO_FACTOR");
    const { error } = await sb().auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (error) throw new RequestError(error.status || 400, "CODE_INVALID");
    await settle(await currentSession());
  },
  async removeFactor(factorId) {
    const { error } = await sb().auth.mfa.unenroll({ factorId });
    if (error) throw /aal2/i.test(error.message) ? new MfaRequiredError() : generic(error, "REMOVE_FAILED");
    await sb().auth.refreshSession();
  },
};

export const supabaseIdentity: IdentityAdapter = {
  getState: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  providerLabel: () => "Supabase (local)",
  async signIn(opts = {}) {
    const q = new URLSearchParams({ returnTo: safeReturn(opts.returnTo) });
    if (opts.forceLogin) q.set("reauth", "1");
    go(`/account/${opts.screen === "signup" ? "join" : "sign-in"}?${q}`);
  },
  async restore() { /* No persistent session by design: a reload signs out (see WNM-6 report). */ },
  async handleCallback() { return "/account"; },
  async fetchWithAuth(url, init = {}) {
    const s = await currentSession();
    return fetch(url, { ...init, credentials: "omit", headers: { ...(init.headers || {}), Authorization: `Bearer ${s.access_token}` } });
  },
  async getProfile(): Promise<Profile> {
    const { data: u, error } = await sb().auth.getUser(); // validated by the auth server, not just decoded
    if (error || !u.user) throw generic(error, "PROFILE_UNAVAILABLE");
    const user: User = u.user;
    const { data: p, error: pe } = await sb().from("profiles").select("created_at").eq("id", user.id).maybeSingle();
    if (pe) throw generic(pe, "PROFILE_UNAVAILABLE");
    return { sub: user.id, email: user.email || "", emailVerified: !!user.email_confirmed_at, createdAt: p?.created_at || null, loginCount: null, pendingEmail: user.new_email || null };
  },
  async requestEmailChange(newEmail) {
    const { error } = await sb().auth.updateUser({ email: newEmail }, { emailRedirectTo: `${SITE}/account/verify` });
    if (error) throw generic(error, "EMAIL_CHANGE_FAILED");
    return { verification: "link" };
  },
  async confirmEmailChange() { throw new RequestError(0, "NOT_SUPPORTED"); },
  async resendVerification() {
    const email = state.claims?.email; if (!email) throw new SessionExpiredError();
    await sb().auth.resend({ type: "signup", email, options: { emailRedirectTo: `${SITE}/account/verify` } });
  },
  securityUrl: () => null,
  async signOut() { userSignedOut = true; await sb().auth.signOut({ scope: "local" }).catch(() => {}); set({ status: "signed-out" }); go("/account/signed-out"); },
  async signOutEverywhere() {
    userSignedOut = true;
    const { error } = await sb().auth.signOut({ scope: "global" });
    if (error) { userSignedOut = false; throw generic(error, "SIGNOUT_FAILED"); }
    set({ status: "signed-out" }); go("/account/signed-out");
  },
  async deleteIdentity() {
    const { error } = await sb().rpc("delete_my_account");
    if (error) {
      if (/REAUTH_REQUIRED/.test(error.message)) throw new ReauthRequiredError();
      if (/MFA_REQUIRED/.test(error.message)) throw new MfaRequiredError();
      if (/SESSION_REVOKED|NOT_AUTHENTICATED|JWT/i.test(error.message)) throw new SessionExpiredError();
      throw new RequestError(0, "DELETE_FAILED");
    }
    try { sessionStorage.setItem(DELETED_KEY, "1"); } catch { /* none */ }
    userSignedOut = true; await sb().auth.signOut({ scope: "local" }).catch(() => {});
    set({ status: "signed-out" }); go("/account/signed-out");
  },
  recentlyAuthenticated(max) { return !!state.claims && Date.now() / 1000 - state.claims.auth_time <= max; },
  direct,
};

// Member data through PostgREST; row-level security decides what each member may touch.
const fail = (e: unknown, code: string) => { throw generic(e, code); };
export const supabaseMemberData: MemberDataAdapter = {
  async interests(): Promise<Interest[]> {
    const { data, error } = await sb().from("product_follows").select("product_id, since").order("since");
    if (error) fail(error, "INTERESTS_UNAVAILABLE");
    return (data || []).map((r) => ({ productId: r.product_id, state: "following" as const, since: r.since }));
  },
  async follow(id) {
    const { error } = await sb().from("product_follows").upsert({ product_id: id }, { onConflict: "member_id,product_id", ignoreDuplicates: true });
    if (error) fail(error, "FOLLOW_FAILED");
    return supabaseMemberData.interests();
  },
  async unfollow(id) {
    const { error } = await sb().from("product_follows").delete().eq("product_id", id);
    if (error) fail(error, "UNFOLLOW_FAILED");
    return supabaseMemberData.interests();
  },
  async exportData() {
    const { data, error } = await sb().rpc("export_my_data");
    if (error) fail(error, "EXPORT_FAILED");
    return { interests: (data?.productInterests || []) as Interest[], optionalAnswers: (data?.optionalAnswers || {}) as Record<string, unknown> };
  },
  async deleteMemberData() { /* deleted with the account, server-side, in delete_my_account() */ },
  async privateResources() {
    const { data, error } = await sb().from("member_resources").select("id, title, url").eq("access", "private");
    if (error) fail(error, "RESOURCES_UNAVAILABLE");
    return { resources: data || [] };
  },
  // Optional answers: a separate table under row-level security, never auth user metadata (which
  // travels inside the access token). A cleared answer is stored as NULL; no answers, no row.
  optionalAnswers: {
    async get(): Promise<OptionalAnswers> {
      const { data, error } = await sb().from("member_optional_answers").select("age_range, region, member_categories, intended_uses").maybeSingle();
      if (error) fail(error, "ANSWERS_UNAVAILABLE");
      return data ? { ageRange: data.age_range, region: data.region, memberCategories: data.member_categories, intendedUses: data.intended_uses } : { ...NO_ANSWERS };
    },
    async save(answers) {
      const n = normalise(answers);
      if (isEmpty(n)) { await supabaseMemberData.optionalAnswers!.clearAll(); return { ...NO_ANSWERS }; }
      const { error } = await sb().from("member_optional_answers").upsert({ age_range: n.ageRange, region: n.region, member_categories: n.memberCategories, intended_uses: n.intendedUses }, { onConflict: "member_id" });
      if (error) fail(error, "ANSWERS_SAVE_FAILED");
      return supabaseMemberData.optionalAnswers!.get();
    },
    async clearAll() {
      const s = await currentSession();
      const { error } = await sb().from("member_optional_answers").delete().eq("member_id", s.user.id);
      if (error) fail(error, "ANSWERS_CLEAR_FAILED");
    },
  },
};
