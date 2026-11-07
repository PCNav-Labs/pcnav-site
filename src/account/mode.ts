// PCNav membership build mode (WNM-11A). Decided at build time from VITE_PCNAV_MEMBERSHIP:
//   off      (default) — no Account navigation, no account pages; the public site is unchanged.
//   preview  — account pages on, registration CLOSED (no Join Free); for staging with existing accounts.
//   test     — account pages on, registration open; ONLY with a mock/local/disposable test provider
//              (vite.config.ts refuses any other combination). Shows a test-environment banner.
// No production identity provider is selected yet; see the WNM-10B/WNM-11A reports.
export type MembershipMode = "off" | "preview" | "test";

const raw = (import.meta.env as Record<string, string | undefined>).VITE_PCNAV_MEMBERSHIP;
export const MEMBERSHIP_MODE: MembershipMode = raw === "preview" || raw === "test" ? raw : "off";
export const MEMBERSHIP_ENABLED = MEMBERSHIP_MODE !== "off";
export const REGISTRATION_OPEN = MEMBERSHIP_MODE === "test";
