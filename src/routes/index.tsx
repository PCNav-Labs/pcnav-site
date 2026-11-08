import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Briefcase,
  CirclePlay,
  Cpu,
  Download,
  FileText,
  FolderTree,
  Globe,
  GraduationCap,
  HardDrive,
  LayoutGrid,
  Microscope,
  ShieldCheck,
  StickyNote,
  UserRound,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoVideo } from "@/components/promo-video";
import { WN_CONCEPT_VIDEO } from "@/lib/promo-video";
import {
  CompassRose,
  ConvergeLines,
  ProductShot,
  SHOTS,
  type Shot,
} from "@/components/product-visuals";
import { OS_MAP_BETA, WN_BETA, WN_COMMERCIAL_NOTE } from "@/lib/releases";

// Homepage: Workspace Navigator first (Owner decision D1, 2026-11-08), with the approved positioning
// (D2): "Workspace Navigator / Your Continuity Compass. / See where you were. Know where you are.
// Plan where you're going." Product statements restate the Owner-approved Workspace Navigator page,
// the 0.5.1 Beta release page and the published Concept Video; no capability is added here.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator — Your Continuity Compass | PCNav" },
      {
        name: "description",
        content:
          "Keep your project's files, documents, notes, tasks and saved websites together in one Windows desktop workspace. Workspace Navigator 0.5.1 is a free public beta for Windows 10 and 11.",
      },
      { property: "og:title", content: "Workspace Navigator — Your Continuity Compass" },
      {
        property: "og:description",
        content: "See where you were. Know where you are. Plan where you're going.",
      },
    ],
  }),
  component: HomePage,
});

const SCATTERED: { icon: LucideIcon; label: string }[] = [
  { icon: Globe, label: "Websites" },
  { icon: FileText, label: "Documents" },
  { icon: StickyNote, label: "Notes" },
  { icon: FolderTree, label: "Files" },
];

// The three bearings of the Continuity Compass, each shown with the part of the application that
// provides it, as in the Concept Video's "Coming Back" scene.
const BEARINGS: { kicker: string; title: string; text: string; shot: Shot }[] = [
  {
    kicker: "See where you were",
    title: "Recent Activity",
    text: "Recent Activity lists the files, notes and websites you've used in the Project, most recent first, so you can pick up where you left off.",
    shot: SHOTS.recent,
  },
  {
    kicker: "Know where you are",
    title: "Properties",
    text: "Each Project can carry its Purpose and Project Notes, so you're reminded what the work is for whenever you return to it.",
    shot: SHOTS.properties,
  },
  {
    kicker: "Plan where you're going",
    title: "Tasks",
    text: "Keep a list of tasks inside the Project. Tick them off as you finish them and reopen them if you need to.",
    shot: SHOTS.tasks,
  },
];

const ONE_WINDOW: { icon: LucideIcon; title: string; text: string; shot: Shot }[] = [
  {
    icon: FolderTree,
    title: "Projects and files",
    text: "Create a Project, or import a copy of an existing folder without changing the original. Browse, rename, copy and move files, and tag related ones so they are easy to find together.",
    shot: SHOTS.explorer,
  },
  {
    icon: FileText,
    title: "Documents",
    text: "Create and edit Word (DOCX), Markdown and plain-text documents with the built-in editor. Preview PDFs and view images too.",
    shot: SHOTS.editor,
  },
  {
    icon: Globe,
    title: "Websites",
    text: "Save the websites a Project needs and open them in the built-in browser, or in your own browser when you prefer.",
    shot: SHOTS.browser,
  },
  {
    icon: StickyNote,
    title: "Notes",
    text: "Jot down ideas as they come. Keep notes on their own, or attach them to Projects, folders, files and tasks.",
    shot: SHOTS.notes,
  },
];

// "Made for" is the Concept Video's own list.
const AUDIENCES: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: "Educators & Students" },
  { icon: Microscope, label: "Researchers" },
  { icon: Briefcase, label: "Professionals" },
  { icon: LayoutGrid, label: "General Use" },
];

// From "How this beta handles your information" on the 0.5.1 Beta release page.
const TRUST: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: HardDrive,
    title: "Your projects stay on your computer",
    text: "Your files stay in your Workspace folder, and you can keep using them with other programs. Workspace Navigator keeps its own records for each Project in a reserved .workspace folder inside it.",
  },
  {
    icon: UserRound,
    title: "No account needed",
    text: "Download and use the beta without signing up for anything.",
  },
  {
    icon: EyeOff,
    title: "No telemetry, usage analytics or built-in sharing",
    text: "Workspace Navigator doesn't send your projects, documents or notes to other people or other computers.",
  },
];

function HomePage() {
  return (
    <>
      {/* 1 · Hero: the approved positioning over the product itself. */}
      <section className="relative overflow-hidden bg-blueprint text-hero-foreground">
        <CompassRose className="pointer-events-none absolute -right-24 -top-28 h-[34rem] w-[34rem] text-hero-accent/30 sm:-right-10" />
        <div className="relative mx-auto max-w-6xl px-4 pb-0 pt-10 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-hero-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-hero-accent" aria-hidden="true" />
              Free public beta for {WN_BETA.platformShort}
            </p>
            <h1 className="mt-6 font-display tracking-tight">
              <span className="block text-lg font-semibold text-hero-accent sm:text-xl">
                Workspace Navigator
              </span>
              <span className="mt-2 block text-4xl font-semibold leading-[1.08] sm:text-6xl">
                Your Continuity Compass.
              </span>
            </h1>
            <p className="mt-5 font-display text-lg font-medium italic text-hero-foreground/90 sm:text-xl">
              See where you were. Know where you are. Plan where you're going.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-hero-muted sm:text-lg">
              Keep your project's files, documents, notes, tasks and saved websites together in one
              Windows desktop workspace, so you can find what matters and pick up where you left
              off.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-11 bg-hero-accent px-6 text-[oklch(0.2_0.05_254)] hover:bg-hero-accent/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hero)]"
              >
                <Link to="/workspace-navigator/download">
                  <Download aria-hidden="true" /> Download the free beta
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 border-white/25 bg-white/5 px-6 text-hero-foreground hover:bg-white/10 hover:text-hero-foreground focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hero)]"
              >
                <a href="#video">
                  <CirclePlay aria-hidden="true" /> Watch the 2-minute video
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-hero-muted">
              Version {WN_BETA.version} · {WN_BETA.platformShort} (x64) · No account needed
            </p>
          </div>

          <figure className="relative mx-auto mt-12 max-w-5xl sm:mt-14">
            <div
              className="absolute -inset-x-6 -bottom-6 top-10 rounded-[2rem] bg-hero-accent/20 blur-3xl"
              aria-hidden="true"
            />
            <ProductShot
              shot={SHOTS.window}
              narrow={SHOTS.windowNarrow}
              priority
              rounded="rounded-t-xl sm:rounded-t-2xl"
              className="relative max-h-[26rem] border-b-0 sm:max-h-none"
            />
            <figcaption className="sr-only">
              Workspace Navigator with a fictional sample Project. Still from the Concept Video.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 2 · The problem, in the Concept Video's words, and the answer. */}
      <section className="relative overflow-hidden">
        <div className="bg-grid-faint absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Why continuity matters
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your work lives in many places.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Coming back to it often starts with searching for where you left off: the document in
              one folder, the notes in another app, the websites somewhere in your browser.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
              {SCATTERED.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-4 text-sm font-medium shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <ConvergeLines className="hidden h-16 w-full text-primary/50 sm:block" />
            <div className="mt-6 flex justify-center sm:mt-0">
              <p className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold shadow-sm sm:text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FolderTree className="h-4 w-4" aria-hidden="true" />
                </span>
                Workspace Navigator brings related work together as a Project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · The three bearings, each with the part of the app that provides it. */}
      <section className="border-y border-border/60 bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Your Continuity Compass
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Come back to your work knowing where you were.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The Continuity Manager keeps the context of each Project beside the work itself.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {BEARINGS.map((b, i) => (
              <article
                key={b.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
              >
                <div className="p-6 pb-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {b.kicker}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                </div>
                <div className="mt-auto px-4 pb-4">
                  <ProductShot shot={b.shot} rounded="rounded-lg" className="sm:h-60" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Everything a Project needs, in one window. */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            One window
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Files, documents, websites and notes, side by side.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Everything stays with the work it belongs to, so there's less searching and less
            rebuilding.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ONE_WINDOW.map(({ icon: Icon, title, text, shot }) => (
            <article
              key={title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
            >
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
              <div className="mt-auto hidden max-h-72 overflow-hidden bg-[linear-gradient(180deg,var(--color-surface),var(--color-accent))] px-6 pt-2 sm:block">
                <ProductShot shot={shot} rounded="rounded-t-lg" className="border-b-0" />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/workspace-navigator">
              Explore Workspace Navigator <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 5 · Who it's for, then the video. */}
      <section id="video" className="scroll-mt-20 bg-blueprint text-hero-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-accent">
                See it in two minutes
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Less searching. Less rebuilding. More time for the work itself.
              </h2>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-hero-muted">
                Made for
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {AUDIENCES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="[&_select]:border-white/20 [&_select]:bg-white/10 [&_select]:text-hero-foreground [&_select]:[color-scheme:dark] [&_figcaption]:text-hero-muted [&_figcaption_span.text-foreground]:text-hero-foreground [&_#wn-video-description]:text-hero-muted [&_a]:text-hero-accent">
              <PromoVideo video={WN_CONCEPT_VIDEO} />
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Trust, and what the beta is. */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Your information
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your work stays yours.
            </h2>
            <ul className="mt-8 space-y-4">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Web Browsing and other details are covered in{" "}
              <Link
                to="/workspace-navigator/download"
                hash="your-information"
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                how this beta handles your information
              </Link>
              .
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-8 shadow-sm sm:p-10">
            <CompassRose className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 text-primary/10" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Public beta
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {WN_BETA.label}
            </h2>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <Fact label="Platform">{WN_BETA.platform}</Fact>
              <Fact label="Price">Free during the beta</Fact>
              <Fact label="Beta expires">{WN_BETA.expires}</Fact>
              <Fact label="Intended for">Users in {WN_BETA.region}</Fact>
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {WN_COMMERCIAL_NOTE}
            </p>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/workspace-navigator/download">
                  <Download aria-hidden="true" /> Download the free beta
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/workspace-navigator/download" hash="before-you-install">
                  <ShieldCheck aria-hidden="true" /> Before you install
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              The installer isn't yet code-signed. Read what to expect before you install.
            </p>
          </div>
        </div>
      </section>

      {/* 7 · Also from PCNav. */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-surface/60 p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
            <Cpu className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Also from PCNav · {OS_MAP_BETA.label}
            </p>
            <h2 className="mt-1 text-xl font-semibold">OS Map — Understand your Windows PC.</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              OS Map helps you understand your system, network, privacy settings and web
              configuration without digging through dozens of Windows tools.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/os-map">
              Explore OS Map <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/60 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{children}</dd>
    </div>
  );
}
