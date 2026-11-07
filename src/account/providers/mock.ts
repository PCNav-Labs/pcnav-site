// The local MOCK identity provider (WNM-3/WNM-3R behaviour, unchanged). Test use only.
import type { ProviderProfile, WithToken } from "./types";

export function mockProvider(site: string): ProviderProfile {
  const ISS = "http://localhost:4401";
  const clientId = "pcnav-account-prototype";
  const logoutTo = `${site}/account/signed-out`;
  const bearer = (url: string, init: RequestInit = {}) => (t: string) =>
    fetch(url, { ...init, credentials: "omit", headers: { ...(init.headers || {}), Authorization: `Bearer ${t}` } });
  const json = { "Content-Type": "application/json" };
  const ok = async (r: Response, code: string) => { if (!r.ok) throw Object.assign(new Error(code), { status: r.status }); return r; };
  return {
    id: "mock",
    label: "Local mock provider",
    issuer: ISS,
    clientId,
    scope: "openid email profile pcnav/account",
    redirect: `${site}/account/callback`,
    logoutTo,
    endpoints: { authorize: `${ISS}/authorize`, signup: null, token: `${ISS}/token`, revoke: `${ISS}/revoke`, jwksSources: [`${ISS}/.well-known/jwks.json`], logout: `${ISS}/logout`, reachability: `${ISS}/.well-known/jwks.json` },
    algorithms: ["ES256"],
    capabilities: { silentRestore: true, hostedSecurityPages: true },
    logoutUrl: () => `${ISS}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutTo)}`,
    securityUrl: (action) => `${ISS}/security?action=${action}`,
    api: {
      async getProfile(w: WithToken) { return (await ok(await w(bearer(`${ISS}/user`)), "PROFILE_UNAVAILABLE")).json(); },
      async requestEmailChange(w, newEmail) { await ok(await w(bearer(`${ISS}/user/email`, { method: "POST", headers: json, body: JSON.stringify({ newEmail }) })), "EMAIL_CHANGE_FAILED"); return { verification: "link" }; },
      async resendVerification(w) { await ok(await w(bearer(`${ISS}/user/resend-verification`, { method: "POST" })), "RESEND_FAILED"); },
      async globalSignOut(w) { await ok(await w(bearer(`${ISS}/global-signout`, { method: "POST" })), "SIGNOUT_FAILED"); },
      async deleteUser(w) {
        const r = await w(bearer(`${ISS}/user`, { method: "DELETE" }));
        if (r.status === 403) return "reauth-required";
        await ok(r, "DELETE_FAILED"); return "deleted";
      },
    },
  };
}
