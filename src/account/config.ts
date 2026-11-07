// PCNav account configuration (WNM-4). Selects the identity provider at build time from
// PUBLIC values only. Default: the local mock provider. Cognito: set VITE_PCNAV_IDP=cognito
// and the VITE_COGNITO_* public identifiers (see config/cognito.public.example.env).
// No secret may ever be supplied here: anything in VITE_* is shipped to every browser.
import { mockProvider } from "./providers/mock";
import { cognitoProvider } from "./providers/cognito";
import type { ProviderProfile } from "./providers/types";
import { MEMBERSHIP_MODE } from "./mode";

const env = import.meta.env as Record<string, string | undefined>;
const SITE = env.VITE_PCNAV_SITE_ORIGIN || "http://127.0.0.1:4400";

function select(): ProviderProfile {
  if (env.VITE_PCNAV_IDP === "cognito") {
    return cognitoProvider({
      region: env.VITE_COGNITO_REGION || "",
      userPoolId: env.VITE_COGNITO_USER_POOL_ID || "",
      clientId: env.VITE_COGNITO_CLIENT_ID || "",
      domain: env.VITE_COGNITO_DOMAIN || "",
      site: SITE,
      promptNone: env.VITE_COGNITO_PROMPT_NONE === "true",
      issuerType: env.VITE_COGNITO_ISSUER_TYPE === "updated" ? "updated" : "original",
      pinnedJwksPath: env.VITE_COGNITO_PINNED_JWKS === "true" ? "/account/idp-jwks.json" : null,
    });
  }
  return mockProvider(SITE);
}

export const PROVIDER = select();

export const ACCOUNT_CONFIG = {
  site: SITE,
  memberApi: env.VITE_PCNAV_MEMBER_API || "http://127.0.0.1:4402/v1",
  prototype: MEMBERSHIP_MODE === "test", // test-environment banner only in test builds (WNM-11A)
} as const;
