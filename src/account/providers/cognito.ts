// Amazon Cognito user pool with managed login (WNM-4 preparation; NOT verified against a live pool).
// Built only from PUBLIC identifiers: region, user pool ID, public app client ID, login domain.
// Self-service calls go to the cognito-idp JSON API with the member's own access token in the
// request body; no AWS credentials, no client secret and no IAM signing are involved.
import type { Profile, ProviderProfile, WithToken } from "./types";

export type CognitoPublicConfig = {
  region: string;       // e.g. "ca-central-1"
  userPoolId: string;   // e.g. "ca-central-1_AbCdEfGhI"
  clientId: string;     // public app client ID (no secret)
  domain: string;       // managed login domain, e.g. "auth.pcnav.net" or "<prefix>.auth.ca-central-1.amazoncognito.com"
  site: string;         // e.g. "https://pcnav.net"
  promptNone: boolean;  // prompt=none needs managed login (Essentials+); set true only once verified on the live pool
  issuerType: "original" | "updated"; // the pool's documented issuer format
  pinnedJwksPath: string | null; // same-origin copy of the pool's PUBLIC JWKS (tools/pin-jwks.js), or null
};

const POOL_ID = /^[a-z]{2}-[a-z]+-\d_[A-Za-z0-9]+$/;
const CLIENT_ID = /^[a-z0-9]{20,64}$/;

export function cognitoProvider(c: CognitoPublicConfig): ProviderProfile {
  if (!POOL_ID.test(c.userPoolId) || !c.userPoolId.startsWith(`${c.region}_`)) throw new Error("Cognito config: invalid user pool ID");
  if (!CLIENT_ID.test(c.clientId)) throw new Error("Cognito config: invalid public app client ID");
  if (!/^[a-z0-9.-]+$/.test(c.domain)) throw new Error("Cognito config: invalid login domain");
  // Two documented issuer formats; the validator must match the pool's.
  const issuer = c.issuerType === "updated"
    ? `https://issuer-cognito-idp.${c.region}.amazonaws.com/${c.userPoolId}`
    : `https://cognito-idp.${c.region}.amazonaws.com/${c.userPoolId}`;
  const jwksBase = `https://cognito-idp.${c.region}.amazonaws.com/${c.userPoolId}`;
  const api = `https://cognito-idp.${c.region}.amazonaws.com/`;
  const login = `https://${c.domain}`;
  const logoutTo = `${c.site}/account/signed-out`;

  // One cognito-idp JSON API operation, authorized by the member's access token in the body.
  const op = (target: string, body: Record<string, unknown> = {}) => (accessToken: string) =>
    fetch(api, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/x-amz-json-1.1", "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}` },
      body: JSON.stringify({ ...body, AccessToken: accessToken }),
    });
  // Cognito refuses an expired or revoked token with HTTP 400 and __type NotAuthorizedException.
  const notAuthorized = async (r: Response) => {
    if (r.status !== 400) return false;
    try { return String((await r.clone().json()).__type || "").includes("NotAuthorizedException"); } catch { return false; }
  };
  const run = async (w: WithToken, target: string, body?: Record<string, unknown>) => {
    const r = await w(op(target, body), notAuthorized);
    if (!r.ok) {
      const t = await r.json().catch(() => ({}));
      throw Object.assign(new Error(String(t.__type || target)), { status: r.status });
    }
    return r.json().catch(() => ({}));
  };

  return {
    id: "cognito",
    label: "Amazon Cognito",
    issuer,
    clientId: c.clientId,
    // aws.cognito.signin.user.admin lets the member's own token call GetUser, UpdateUserAttributes,
    // DeleteUser and GlobalSignOut. pcnav/account is the custom scope the member API requires.
    scope: "openid email profile aws.cognito.signin.user.admin pcnav/account",
    redirect: `${c.site}/account/callback`,
    logoutTo,
    endpoints: {
      authorize: `${login}/oauth2/authorize`,
      signup: `${login}/signup`,
      token: `${login}/oauth2/token`,
      revoke: `${login}/oauth2/revoke`,
      // The provider JWKS first; then the pinned same-origin copy, which needs no cross-origin access.
      jwksSources: [`${jwksBase}/.well-known/jwks.json`, ...(c.pinnedJwksPath ? [`${c.site}${c.pinnedJwksPath}`] : [])],
      logout: `${login}/logout`,
      reachability: `${login}/oauth2/token`,
    },
    algorithms: ["RS256"],
    capabilities: { silentRestore: c.promptNone, hostedSecurityPages: false },
    logoutUrl: () => `${login}/logout?client_id=${encodeURIComponent(c.clientId)}&logout_uri=${encodeURIComponent(logoutTo)}`,
    securityUrl: () => null, // managed login hosts no password / MFA / passkey settings pages
    api: {
      async getProfile(w): Promise<Profile> {
        const u = await run(w, "GetUser");
        const a = Object.fromEntries((u.UserAttributes || []).map((x: { Name: string; Value: string }) => [x.Name, x.Value]));
        return {
          sub: a.sub, email: a.email || "", emailVerified: a.email_verified === "true",
          createdAt: null, // GetUser does not return the creation date
          loginCount: null,
          pendingEmail: null,
        };
      },
      async requestEmailChange(w, newEmail) {
        await run(w, "UpdateUserAttributes", { UserAttributes: [{ Name: "email", Value: newEmail }] });
        return { verification: "code" };
      },
      async confirmEmailChange(w, code) { await run(w, "VerifyUserAttribute", { AttributeName: "email", Code: code }); },
      async resendVerification(w) { await run(w, "GetUserAttributeVerificationCode", { AttributeName: "email" }); },
      async globalSignOut(w) { await run(w, "GlobalSignOut"); },
      async deleteUser(w) { await run(w, "DeleteUser"); return "deleted"; },
    },
  };
}
