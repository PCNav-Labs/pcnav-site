# PCNav membership (account area)

Optional, free PCNav membership. It is **off by default**: a plain `vite build` produces the public site with no Account link and no account pages.

## Build modes (`VITE_PCNAV_MEMBERSHIP`)

| Value | Account pages | Registration | Banner | Use |
|---|---|---|---|---|
| unset / `off` | none emitted; the route shows "not available" if reached | — | — | production-targeted builds today |
| `public` | **all pages, marked Coming Soon**: descriptions and disabled previews only | none (inert adapters; no provider, no network) | Coming Soon | public scaffolding of the section |
| `preview` | on | **closed** (no Join Free; Join page says it isn't open) | none | staging with existing accounts |
| `test` | on | open | "Prototype" (mock) or "Test environment" (Supabase) | local or test providers only |

`vite.config.ts` refuses to build:
- `public` when any provider, key or CAPTCHA site key is named;
- `test` with any provider other than the mock provider, the local Supabase stack (`http://127.0.0.1:<port>`), the disposable test project, or the Cognito simulator;
- **any** build that names the disposable test project (`pukocmdivqmzsyqxcvsv`) unless the mode is `test`.

## Providers (`VITE_PCNAV_IDP`)

The pages use the provider-neutral contracts in `core.ts` (`IdentityAdapter`, `DirectAuth`) and `data.ts` (`MemberDataAdapter`, `OptionalAnswersStore`). Adapters:
- `mock` (default; local test services only);
- `supabase` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; publishable key only);
- `cognito` (simulator-tested only).

No production identity provider has been selected. Only browser-safe values ever go in `VITE_*`.

## Rules kept by this code

- **Sessions:** in memory only, so a reload signs out.
- **Separation:** no purchase, licence or payment data. Workspace Navigator never needs an account.
- **Optional answers:** four questions, stored only when chosen. They are linked to the account (not anonymous), clearable one at a time or all together, and included in the export.
- **No identifying fields:** no display name, gender, birthdate, telephone or address.
- **Membership-only additions:** `account.css` (scroll lock under a strict CSP, reduced motion) and the skip link are added only when membership is on, so the default build is unchanged.

## Member sections and extension points

| Section | Route | Public scaffolding shows |
|---|---|---|
| Overview | `/account` (signed in) | the landing page with a directory of sections |
| My Profile | `/account/profile` | a description (email, membership, four optional questions, plain-words data summary) |
| My Products | `/account/products` | a description (following is not a purchase or licence) |
| Member Resources | `/account/resources` | a description |
| Account Security | `/account/security` | a description (password, two-step verification, sign-out everywhere, export, deletion) |

Supporting routes: `join`, `sign-in`, `forgot`, `reset` (disabled previews in `public`), `verify`, `callback`, `signed-out` (descriptions), `welcome` (the onboarding questions, read-only).

To add a member section:
1. Add `src/routes/account/<name>.tsx` wrapping the page in `<Gate section="<Label>">`.
2. Add `{ to, label }` to `SECTIONS` in `ui.tsx`. The section nav and the landing directory pick it up.
3. Add a `SECTION_PREVIEWS["<Label>"]` entry in `preview.tsx`, describing only what the page does.
4. Add the path to `ACCOUNT_PAGES` in `vite.config.ts`.

Content additions (resources, announcements, catalogue) go in `data.ts` (`RESOURCES`, `ANNOUNCEMENTS`, `CATALOGUE`).

## Removing membership

Leave `VITE_PCNAV_MEMBERSHIP` unset (the default). To delete the feature entirely, remove `src/account/`, `src/routes/account.tsx`, `src/routes/account/`, the `MEMBERSHIP_*` uses in `src/components/site-header.tsx`, `src/routes/__root.tsx` and `vite.config.ts`, and the `@supabase/supabase-js` dependency; then rebuild. `src/routeTree.gen.ts` regenerates.
