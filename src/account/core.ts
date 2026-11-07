// PCNav account — shared identity contract (WNM-6). Provider-neutral: the dashboard depends on
// this file only. OIDC providers (mock, Cognito) live in oidc.ts; Supabase in supabase.ts.
import type { Profile, SecurityAction } from "./providers/types";

export type { Profile, SecurityAction } from "./providers/types";
export type AccountStatus = "signed-out" | "loading" | "signed-in" | "unverified" | "mfa-required" | "expired" | "error";
export type Claims = { sub: string; email: string; email_verified: boolean; name?: string; auth_time: number };
export type AccountState = { status: AccountStatus; claims?: Claims; message?: string };

export class SessionExpiredError extends Error { constructor() { super("SESSION_EXPIRED"); } }
export class ReauthRequiredError extends Error { constructor() { super("REAUTH_REQUIRED"); } }
export class MfaRequiredError extends Error { constructor() { super("MFA_REQUIRED"); } }
export class RequestError extends Error { constructor(public status: number, code: string) { super(code); } }

// Set just before the post-deletion navigation, read once by the signed-out page.
export const DELETED_KEY = "pcnav.account.deleted";

export type TotpEnrollment = { factorId: string; qrSvgDataUri: string; secret: string };
export type MfaFactor = { id: string; status: "verified" | "unverified"; friendlyName: string };

// In-page sign-in for providers without a hosted login (Supabase). Every outward response is
// generic: no method reveals whether an email address has an account.
export interface DirectAuth {
  signUp(email: string, password: string, captchaToken?: string): Promise<void>; // email and password only (WNM-9PB)
  signInWithPassword(email: string, password: string, captchaToken?: string): Promise<"signed-in" | "mfa-required">;
  verifyEmailLink(tokenHash: string, type: "signup" | "email_change" | "email"): Promise<"signed-in" | "mfa-required" | "email-change-pending">;
  requestPasswordReset(email: string, captchaToken?: string): Promise<void>;
  openPasswordReset(tokenHash: string): Promise<void>;
  setNewPassword(password: string): Promise<void>;
  changePassword(newPassword: string): Promise<void>;
  mfaFactors(): Promise<MfaFactor[]>;
  enrollTotp(): Promise<TotpEnrollment>;
  verifyTotpEnrollment(factorId: string, code: string): Promise<void>;
  challengeTotp(code: string): Promise<void>;
  removeFactor(factorId: string): Promise<void>;
}

export interface IdentityAdapter {
  getState(): AccountState;
  subscribe(fn: () => void): () => void;
  providerLabel(): string;
  signIn(opts?: { returnTo?: string; screen?: "login" | "signup"; forceLogin?: boolean; silent?: boolean }): Promise<void>;
  restore(returnTo: string): Promise<void>;
  handleCallback(search: string): Promise<string>;
  fetchWithAuth(url: string, init?: RequestInit): Promise<Response>;
  getProfile(): Promise<Profile>;
  requestEmailChange(newEmail: string): Promise<{ verification: "link" | "code" }>;
  confirmEmailChange(code: string): Promise<void>;
  resendVerification(): Promise<void>;
  securityUrl(action: SecurityAction): string | null;
  signOut(): Promise<void>;
  signOutEverywhere(): Promise<void>;
  deleteIdentity(): Promise<void>;
  recentlyAuthenticated(maxAgeSeconds: number): boolean;
  direct?: DirectAuth; // present only for in-page sign-in providers
}
