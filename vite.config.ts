// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
    },
    // Explicit page list guarantees every public route is emitted regardless of crawl.
    pages: [
      { path: "/" },
      { path: "/about" },
      { path: "/feedback" },
      { path: "/os-map" },
      { path: "/os-map/download" },
      { path: "/404" },
    ],
  },
});
