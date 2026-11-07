// PCNav account — identity provider contract (WNM-4).
// The dashboard never names a provider. A provider profile supplies endpoints built from
// PUBLIC identifiers only, its capabilities, and its self-service profile operations.
// No secret of any kind belongs in a provider profile: the app client is public (PKCE).

export type Profile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  createdAt: string | null; // null when the provider cannot tell the member's own client
  loginCount: number | null; // null when the provider cannot tell (first-login welcome is then not shown)
  pendingEmail: string | null;
};

export type SecurityAction = "password" | "mfa" | "passkeys";

// Runs `call` with a fresh access token. The identity layer refreshes once and retries when
// `isAuthFailure` says the provider refused the token, and ends the session if that fails.
export type WithToken = (call: (accessToken: string) => Promise<Response>, isAuthFailure?: (r: Response) => Promise<boolean>) => Promise<Response>;

export interface ProfileApi {
  getProfile(withToken: WithToken): Promise<Profile>;
  // "link": the provider emails a link; "code": the member types a code here (confirmEmailChange).
  requestEmailChange(withToken: WithToken, newEmail: string): Promise<{ verification: "link" | "code" }>;
  confirmEmailChange?(withToken: WithToken, code: string): Promise<void>;
  resendVerification(withToken: WithToken): Promise<void>;
  globalSignOut(withToken: WithToken): Promise<void>;
  deleteUser(withToken: WithToken): Promise<"deleted" | "reauth-required">;
}

export type ProviderProfile = {
  id: "mock" | "cognito";
  label: string;
  issuer: string;
  clientId: string;
  scope: string;
  redirect: string;
  logoutTo: string;
  // `reachability` is probed with a no-cors request before a silent redirect, so the probe does
  // not depend on the provider sending CORS headers.
  // `jwksSources`: trusted key sets, tried in order: the provider's own JWKS, then (optionally) a
  // pinned copy of the same public keys served from this site's origin.
  endpoints: { authorize: string; signup: string | null; token: string; revoke: string; jwksSources: string[]; logout: string; reachability: string };
  algorithms: ("ES256" | "RS256")[];
  capabilities: {
    // OIDC prompt=none answered with an error and no UI when there is no provider session.
    silentRestore: boolean;
    // The provider hosts password / MFA / passkey pages the dashboard can link to.
    hostedSecurityPages: boolean;
  };
  logoutUrl(): string;
  securityUrl(action: SecurityAction): string | null;
  api: ProfileApi;
};
