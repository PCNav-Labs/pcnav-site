// PCNav membership build mode (WNM-11A, WNM-11B). Decided at build time from VITE_PCNAV_MEMBERSHIP:
//   off      (default) — no Account navigation, no account pages; the public site is unchanged.
//   public   — the membership section is visible and marked Coming Soon. Every page is a
//              description or a disabled preview. No identity provider runs: nothing can sign in,
//              register or reach member data (inert adapters; vite.config.ts refuses provider settings).
//   preview  — account pages on, a provider runs, registration CLOSED; staging with existing accounts.
//   test     — account pages on, registration open; ONLY with a mock/local/disposable test provider
//              (vite.config.ts refuses any other combination). Shows a test-environment banner.
// No production identity provider is selected yet.
export type MembershipMode = "off" | "public" | "preview" | "test";

const raw = (import.meta.env as Record<string, string | undefined>).VITE_PCNAV_MEMBERSHIP;
export const MEMBERSHIP_MODE: MembershipMode = raw === "public" || raw === "preview" || raw === "test" ? raw : "off";
export const MEMBERSHIP_ENABLED = MEMBERSHIP_MODE !== "off";
export const PUBLIC_PREVIEW = MEMBERSHIP_MODE === "public";
export const PROVIDER_ACTIVE = MEMBERSHIP_MODE === "preview" || MEMBERSHIP_MODE === "test";
export const REGISTRATION_OPEN = MEMBERSHIP_MODE === "test";
