# PCNav Website v0.1 — Build Plan

A calm, professional, light-first marketing site for PCNav with 5 routes, shared header/footer, dark-mode support, and placeholder content where assets aren't ready.

## Routes (TanStack Start file-based)

```
src/routes/
  __root.tsx          → shell, header, footer, theme provider, global <head>
  index.tsx           → Home
  os-map.tsx          → OS Map product page
  download.tsx        → Download page
  feedback.tsx        → Feedback page
  about.tsx           → About page
```

Each route gets its own `head()` with unique title, description, og:title, og:description. No og:image on root.

## Shared Layout

**Header** (`src/components/site-header.tsx`)
- Logo wordmark "PCNav" → links to `/`
- Nav links: Home, OS Map, Download, Feedback, About (active state via `activeProps`)
- Persistent "Download OS Map" button (links to `/download`)
- Theme toggle (light/dark/system)
- Mobile: hamburger → Sheet with same links + CTA

**Footer** (`src/components/site-footer.tsx`)
- Brand line + tagline
- Nav column, Product column (OS Map, Download), Project column (Feedback, About, GitHub)
- Small print: "No telemetry. No analytics. Local logs only."
- © PCNav

## Page Content

**Home (`/`)**
1. Hero — "PCNav" eyebrow, H1 "Navigate Technology With Confidence.", supporting paragraph, CTAs: Download OS Map (primary) / Learn More (anchors to "What is PCNav")
2. What Is PCNav — short two-paragraph section
3. Featured Product — OS Map card with "Explore OS Map" button → `/os-map`
4. Core Philosophy — 4 numbered cards: Visibility First, Understanding Second, Action Third, Automation Last
5. Trust & Privacy — checklist (No telemetry / No analytics / No background update checks / Local logs only) + disclosure note
6. Ecosystem — short paragraph
7. Download CTA band — "Ready to explore your Windows PC?" + Download button

**OS Map (`/os-map`)**
1. Hero — title + subhead + intro paragraph
2. Why OS Map Exists — two paragraphs
3. Feature Areas — 6-card responsive grid (System Information, Network, Privacy, Web Configuration, Utilities, Help) each with icon + bullet list
4. Philosophy — restated 4 principles + "not an optimizer/cleaner/performance booster" line
5. Screenshots — 4 placeholder boxes (System Information, Network, Privacy, Web Configuration) using `<div>` placeholder tiles with captions
6. CTA — Download OS Map

**Download (`/download`)**
1. Current Release card — Version, Release date, File size, SHA-256 (placeholder values, monospace for hash)
2. Download Options — Primary "Download OS Map" + Secondary "View on GitHub" with note explaining GitHub audience
3. Before You Launch — two notice cards: SmartScreen, UAC
4. Release Notes — placeholder card ("Release notes will appear here.")

**Feedback (`/feedback`)**
1. Feedback Welcome intro
2. Report A Problem — short copy + "GitHub Issues" button (external link, opens new tab)
3. Suggest An Idea — short copy
Kept intentionally minimal, single column.

**About (`/about`)**
1. About PCNav intro
2. Why Build These Tools — 5 pillars (Clarity, Visibility, Understanding, Confidence)
3. Privacy — same checklist as Home + disclosure note
4. Ecosystem — closing paragraph

## Design System

Light-first with dark mode via class strategy. Tokens defined in `src/styles.css` under `@theme inline` + `:root` / `.dark`.

- **Palette:** warm neutral background (near-white `oklch(0.99 0.005 95)`), deep ink foreground, calm blue-teal primary `oklch(0.55 0.09 215)` (trust, navigation/compass feel), soft muted surfaces for cards. Dark mode: deep slate background, same primary slightly lifted.
- **Typography:** Inter for body + a slightly more characterful display face for headings (Manrope) loaded via `<link>` in `__root.tsx` head. Generous line-height, restrained weights.
- **Components:** reuse shadcn Button, Card, Sheet, Separator. New small components: `SectionHeading`, `PrincipleCard`, `FeatureCard`, `PlaceholderShot`, `PrivacyList`, `CtaBand`.
- **Motion:** minimal — subtle fade/translate on hero only. No scroll-jacking, no parallax.
- **Iconography:** lucide icons (Compass, Cpu, Network, ShieldCheck, Globe, Wrench, LifeBuoy, Download, Github, Moon, Sun).

## Theme Toggle

Lightweight: `src/components/theme-provider.tsx` reading `localStorage` + `prefers-color-scheme`, toggling `.dark` on `<html>`. No external dep.

## Non-Goals (explicit)

No backend, no auth, no analytics, no forms (Feedback links out to GitHub), no newsletter, no blog. All "Download OS Map" and "GitHub" buttons are placeholder links (`#` or `https://github.com/` placeholder) to be wired later.

## Files to Create

- `src/routes/index.tsx` (replace placeholder)
- `src/routes/os-map.tsx`
- `src/routes/download.tsx`
- `src/routes/feedback.tsx`
- `src/routes/about.tsx`
- `src/routes/__root.tsx` (extend: add fonts link, header, footer, theme provider, dark-mode meta)
- `src/styles.css` (extend tokens for warmer palette + display font)
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/components/theme-provider.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/section-heading.tsx`
- `src/components/principle-card.tsx`
- `src/components/feature-card.tsx`
- `src/components/placeholder-shot.tsx`
- `src/components/privacy-list.tsx`
- `src/components/cta-band.tsx`

## Open Questions (will assume defaults unless you say otherwise)

- GitHub URL: use `https://github.com/pcnav` as placeholder.
- Download button: links to `/download` everywhere except the Download page itself, where it's a non-functional placeholder button with helper text.
- Logo: text wordmark only for v0.1 (no image asset).
