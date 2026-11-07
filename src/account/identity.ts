// PCNav account — identity entry point. The dashboard imports from here only.
// Build-time selection from PUBLIC configuration: VITE_PCNAV_IDP = "supabase" selects the
// Supabase adapter; anything else selects the OIDC adapter (local mock or Amazon Cognito).
import { oidcIdentity } from "./oidc";
import { supabaseIdentity } from "./supabase";
import type { IdentityAdapter } from "./core";
import { inertIdentity } from "./inert";
import { PROVIDER_ACTIVE } from "./mode";

export * from "./core";
const kind = (import.meta.env as Record<string, string | undefined>).VITE_PCNAV_IDP;
// No provider runs unless the build mode activates one (WNM-11B): off and public use the inert adapter.
export const identity: IdentityAdapter = !PROVIDER_ACTIVE ? inertIdentity : kind === "supabase" ? supabaseIdentity : oidcIdentity;
