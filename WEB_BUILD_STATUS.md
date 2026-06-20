# PCNav Website — Build Status

A lightweight progress record for the PCNav website. Website work only.
**This is the single source of truth for PCNav website progress until WEB BUILD 1.1 is complete.**
Update it when an item completes or a phase changes — no other process.

Last updated: 2026-06-17

---

## Status Summary

| Field | Value |
|---|---|
| Current phase | WEB BUILD 1.1 — Content & Productization |
| Current status | In Progress |
| Overall progress | **7 / 14 items (50%)** |
| Launch-critical progress | **2 / 5 complete** |
| Last updated | 2026-06-17 |

> Progress counter: Critical 2/5 · Important 5/5 · Nice-to-Have 0/4 · **Total 7/14**

---

## Completed Milestones

### WEB BUILD 1.0 — Framework & Site Implementation — ✅ Complete
- TanStack Start (SSR) + React 19 + Vite + Tailwind v4 + shadcn/ui scaffold.
- Five pages built, styled (light/dark), SSR-rendering, responsive: Home, OS Map,
  Download, Feedback, About.
- Shared shell: header (with mobile sheet nav + theme toggle), footer, per-page SEO.
- GitHub links wired to github.com/PCNav-Labs/pcnav (migrated from a personal
  account to the PCNav Labs organization in WEB BUILD 1.2).
- Status: structurally complete; content/assets and download flow deferred to 1.1.

---

## WEB BUILD 1.1 Work Items

### Critical Before Public Launch (2/5)
- [ ] **Download** — Enable the disabled "Download OS Map" button + link to the real
  OS Map 0.1.0 artifact. *(Medium)* — blocked on public hosting URL.
- [x] **Download** — Populate real release data (version, date, file size, SHA-256);
  remove the "Placeholder values" disclaimer. *(Small)*
- [x] **Download** — Populate release notes / changelog. *(Small)*
- [ ] **OS Map** — Replace the 4 placeholder screenshot tiles with real screenshots;
  remove the "Placeholders shown below" caption. *(Medium)*
- [ ] **Global** — Add favicon/app icon + og:image; verify social preview. *(Medium)*

### Important Content Improvements (5/5)
- [x] **Home** — Flesh out "What is PCNav" (currently heading + one line). *(Small)*
- [x] **About** — Add descriptions to the 5 pillar cards (currently labels only). *(Small)*
- [x] **Feedback** — Add a working link to "Suggest an idea" (currently no action). *(Small)*
- [x] **OS Map** — Expand "Why OS Map exists" (currently two sentences). *(Small)*
- [x] **Home / About** — Lightly enrich the "Ecosystem" sections. *(Small)*

### Nice-to-Have Enhancements (0/4)
- [ ] **Global** — Real logo/brand mark (currently text wordmark). *(Medium)*
- [ ] **OS Map** — More screenshots / captioned feature walkthrough. *(Medium)*
- [ ] **Home** — Subtle hero motion. *(Small)*
- [ ] **Download** — "Verify your download" hash how-to once SHA-256 is real. *(Small)*

---

## Deferred Items
- **Deployment / hosting** (Cloudflare/Nitro) → **WEB BUILD 1.2 — Launch / Deployment.**
  Out of 1.1 scope by design.

## Next Recommended Work
1. Gather assets: signed OS Map 0.1.0 binary + SHA-256/size, and product screenshots.
2. Wire the Download page (button + release data + release notes) — clears the biggest
   launch blocker and the dead-end CTA funnel.
3. Drop in real OS Map screenshots.
4. Flesh thin content (Home, About, OS Map) + Feedback suggest link.
5. Add favicon + og:image, then run the QA pass.

---

## WEB BUILD 1.1 Exit Criteria
1. No visible "placeholder" language on any shipped page.
2. Download is functional: real version/date/size/SHA-256, enabled button to the real
   artifact, release notes populated.
3. OS Map screenshots replaced with real captures.
4. Thin sections fleshed out (Home "What is PCNav", About pillars, OS Map "Why").
5. Feedback "Suggest an idea" has a working link.
6. Favicon + og:image present; social preview verified.
7. Every "Download OS Map" CTA verified end-to-end.
8. Manual QA: each page at mobile + desktop, light + dark.

*(Deployment/go-live is tracked separately under WEB BUILD 1.2.)*
```
