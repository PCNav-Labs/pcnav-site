// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Membership settings: the shell first, then the committed .env files, as Vite resolves them for the
// client (WNM-11D: .env.production selects the public scaffolding for production builds).
const BUILD_MODE = process.argv.includes("build") ? "production" : "development";
const ENV: Record<string, string | undefined> = { ...loadEnv(BUILD_MODE, process.cwd(), "VITE_"), ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith("VITE_"))) };

// PCNav membership (WNM-11A/11B): OFF unless VITE_PCNAV_MEMBERSHIP is "public", "preview" or "test" (see
// src/account/mode.ts). With it off, no account page is emitted and the public site is unchanged.
const MEMBERSHIP = ["public", "preview", "test"].includes(ENV.VITE_PCNAV_MEMBERSHIP ?? "") ? ENV.VITE_PCNAV_MEMBERSHIP : "off";
// The WNM-7B disposable Supabase project is a TEST project: never part of a production-targeted build.
const TEST_ONLY_SUPABASE_REFS = ["pukocmdivqmzsyqxcvsv"];
const SUPABASE_URL = ENV.VITE_SUPABASE_URL ?? "";
if (TEST_ONLY_SUPABASE_REFS.some((r) => SUPABASE_URL.includes(r)) && MEMBERSHIP !== "test") {
  throw new Error("WNM-11A guard: the disposable Supabase test project may be used only by a membership test build (VITE_PCNAV_MEMBERSHIP=test).");
}
// Public scaffolding carries no provider at all (WNM-11B).
if (MEMBERSHIP === "public" && ["VITE_PCNAV_IDP", "VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_COGNITO_USER_POOL_ID", "VITE_TURNSTILE_SITEKEY"].some((k) => ENV[k])) {
  throw new Error("WNM-11B guard: a public scaffolding build (VITE_PCNAV_MEMBERSHIP=public) must not name any identity provider, key or CAPTCHA site key.");
}
if (MEMBERSHIP === "test") {
  const idp = ENV.VITE_PCNAV_IDP ?? "mock";
  const ok = idp === "mock"
    || (idp === "supabase" && (/^http:\/\/127\.0\.0\.1:\d+$/.test(SUPABASE_URL) || TEST_ONLY_SUPABASE_REFS.some((r) => SUPABASE_URL === `https://${r}.supabase.co`)))
    || (idp === "cognito" && ENV.VITE_COGNITO_USER_POOL_ID === "ca-central-1_WNM4sim01");
  if (!ok) throw new Error("WNM-11A guard: open registration (VITE_PCNAV_MEMBERSHIP=test) is allowed only with the mock provider, the local Supabase stack, the disposable test project or the Cognito simulator.");
}
const ACCOUNT_PAGES = MEMBERSHIP === "off" ? [] : [
  "/account", "/account/profile", "/account/products", "/account/resources", "/account/callback", "/account/signed-out",
  "/account/sign-in", "/account/join", "/account/forgot", "/account/verify", "/account/reset", "/account/welcome", "/account/security",
].map((p) => ({ path: p }));

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Static prerendering for cPanel deployment: emit a real index.html per route
    // into the client output dir (dist/client) so the site is fully static — no
    // Node/SSR runtime, no server-side routing, no SPA fallback required.
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoSubfolderIndex: true,
      // Static media are files, not pages. A crawled link to one would be fetched as a page and
      // written over the built copy, so nothing under /media/ is ever prerendered.
      // With membership off, the prerenderer still discovers the account routes from the route tree;
      // none of them is emitted (WNM-11A).
      filter: (page: { path: string }) => !page.path.startsWith("/media/") && (MEMBERSHIP !== "off" || !page.path.startsWith("/account")),
    },
    // Explicit page list guarantees every public route is emitted regardless of crawl.
    pages: [
      { path: "/" },
      { path: "/about" },
      { path: "/feedback" },
      { path: "/os-map" },
      { path: "/os-map/download" },
      { path: "/workspace-navigator" },
      { path: "/workspace-navigator/download" },
      { path: "/workspace-navigator/video-transcript" },
      { path: "/workspace-navigator/concept-video-transcript" },
      { path: "/feedback/os-map" },
      { path: "/feedback/workspace-navigator" },
      ...ACCOUNT_PAGES, // membership pages only when enabled (WNM-11A)
      { path: "/404" },
    ],
  },
});
