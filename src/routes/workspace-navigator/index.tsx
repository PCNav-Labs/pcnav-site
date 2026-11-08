import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  FolderTree,
  Globe,
  History,
  ListChecks,
  MessageSquarePlus,
  StickyNote,
  Tags,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoVideo } from "@/components/promo-video";
import { WN_CONCEPT_VIDEO } from "@/lib/promo-video";
import { CompassRose, ProductShot, SHOTS, type Shot } from "@/components/product-visuals";
import { WN_BETA, WN_COMMERCIAL_NOTE } from "@/lib/releases";

export const Route = createFileRoute("/workspace-navigator/")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator — One workspace. One window. | PCNav" },
      {
        name: "description",
        content:
          "A Windows desktop application that keeps a project's files, notes, tags, tasks and saved web destinations together in one place. A free public beta is available for Windows 10 and 11.",
      },
      { property: "og:title", content: "Workspace Navigator — One workspace. One window." },
      {
        property: "og:description",
        content:
          "A Windows desktop application that keeps a project's files, notes, tags, tasks and saved web destinations together in one place.",
      },
    ],
  }),
  component: WorkspaceNavigatorPage,
});

// Owner-approved editorial copy (2026-10-11). Each capability below was checked against the
// application's shipped in-app Help for v0.5.1 before publication. The positioning is Owner
// decision D2 (2026-11-08).
//
// Deferred by the Owner (2026-10-11): AI Assistance is not published until its capabilities and
// privacy claims are qualified. Tasks are described as project-only, as in v0.5.1.
type Capability = { icon: LucideIcon; label: string; text: string };

const CONTINUITY: Capability[] = [
  {
    icon: Tags,
    label: "Organize",
    text: "Arrange and manage tags for project files and folders, making related work easier to find.",
  },
  {
    icon: FileSearch,
    label: "Properties",
    text: "View information about project files and folders, as well as independent documents.",
  },
  {
    icon: History,
    label: "Recent Activity",
    text: "See recent project activity to help you pick up where you left off.",
  },
  {
    icon: ListChecks,
    label: "Tasks",
    text: "Create, edit, complete and reopen tasks to keep track of work within your projects.",
  },
];

const WEB: Capability[] = [
  {
    icon: Bookmark,
    label: "Saved websites",
    text: "Save web addresses for individual projects or in a shared list accessible independently of a project.",
  },
  {
    icon: Globe,
    label: "Built-in browser",
    text: "Open and browse websites directly inside Workspace Navigator.",
  },
  {
    icon: ExternalLink,
    label: "External browser",
    text: "Open saved websites in your preferred browser whenever you choose.",
  },
];

function WorkspaceNavigatorPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-blueprint text-hero-foreground">
        <CompassRose className="pointer-events-none absolute -right-28 -top-24 h-[30rem] w-[30rem] text-hero-accent/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">
            Product · Public beta
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator
          </h1>
          <p className="mt-3 font-display text-2xl font-semibold text-hero-foreground/95 sm:text-3xl">
            One workspace. One window.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-hero-muted">
            Work on your project's files, documents, notes, tasks and saved websites together in one
            Windows desktop workspace, so you can find what matters and pick up where you left off.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
              <Link to="/feedback/workspace-navigator">
                <MessageSquarePlus aria-hidden="true" /> Share feedback
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-hero-muted">
            {WN_BETA.label} is available for {WN_BETA.platformShort}.
          </p>
        </div>
      </section>

      {/* Concept video: what Workspace Navigator is for. The homepage plays it too. */}
      <section id="concept-video" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6">
        <PromoVideo video={WN_CONCEPT_VIDEO} />
      </section>

      {/* What it does */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            What it does
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            One place for each project's work.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Keep your projects, documents, notes and tasks together in one workspace, with a
            separate Documents section for files you want to manage independently of any project.
          </p>
        </div>

        <div className="mt-14 space-y-20 sm:space-y-24">
          <FeatureRow
            icon={FolderTree}
            title="Projects and the Explorer"
            shot={SHOTS.explorer}
            items={[
              "Create a new project or import a copy of an existing folder without changing the original.",
              "Browse, rename, copy and move files, with a Recycle Bin for deleted items.",
            ]}
          />
          <FeatureRow
            icon={FileText}
            title="Documents"
            shot={SHOTS.editor}
            reverse
            items={[
              "Create and edit DOCX, Markdown and plain-text documents with the built-in editor. No separate document editor is required.",
              "Preview PDF files with search, and view images directly in Workspace Navigator.",
              "Work with documents independently of your projects or as part of a project.",
            ]}
          />
          <FeatureRow
            icon={StickyNote}
            title="Notes"
            shot={SHOTS.notes}
            items={[
              "Quickly jot down ideas, reminders and important details as they come to mind.",
              "Keep notes independently, without needing to open a project.",
              "Attach notes to projects, folders, files or tasks to keep relevant information close at hand.",
            ]}
          />
        </div>
      </section>

      {/* Continuity Manager */}
      <section
        id="continuity-manager"
        className="mt-24 scroll-mt-20 border-y border-border/60 bg-surface/50"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Continuity Manager
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Keep your place in every project.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Keep your work organized, understand what's changed and stay on top of what needs
              doing.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTINUITY.map((c) => (
              <CapabilityCard key={c.label} {...c} />
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ShotCard caption="Recent Activity" shot={SHOTS.recent} paneClassName="h-56" />
            <ShotCard caption="Properties" shot={SHOTS.properties} paneClassName="h-56" />
            <ShotCard caption="Tasks" shot={SHOTS.tasks} paneClassName="h-56" />
          </div>
        </div>
      </section>

      {/* Web Browsing */}
      <section id="web-browsing" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Web Browsing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Websites beside the work they belong to.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Keep useful websites close to your work without constantly switching applications.
            </p>
            <div className="mt-8 grid gap-4">
              {WEB.map((c) => (
                <CapabilityCard key={c.label} {...c} horizontal />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ShotCard caption="Saved websites" shot={SHOTS.websites} />
            <ShotCard caption="Built-in browser" shot={SHOTS.browser} className="mt-10" />
          </div>
        </div>
      </section>

      {/* Public Beta Release */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-blueprint px-6 py-12 text-hero-foreground sm:px-12">
          <CompassRose className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 text-hero-accent/20" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hero-accent">
                Release status
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Public beta available
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-hero-muted">
                Workspace Navigator v0.5.1 is available for public beta testing. Download the
                application, explore its features and share your feedback to help guide future
                improvements.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-hero-muted">
                {WN_COMMERCIAL_NOTE}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 h-11 bg-hero-accent px-6 text-[oklch(0.2_0.05_254)] hover:bg-hero-accent/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hero)]"
              >
                <Link to="/workspace-navigator/download">
                  <FileText aria-hidden="true" /> What to know before you install
                </Link>
              </Button>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                `Version ${WN_BETA.version}`,
                WN_BETA.platform,
                `Intended for users in ${WN_BETA.region}`,
                `Beta expires ${WN_BETA.expires}`,
                "No account needed",
                "Installer not yet code-signed",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5"
                >
                  <Check className="h-4 w-4 shrink-0 text-hero-accent" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  items,
  shot,
  reverse = false,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
  shot: Shot;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={reverse ? "md:order-2" : undefined}>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h3>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
              <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "md:order-1" : undefined}>
        <div className="rounded-2xl bg-[linear-gradient(135deg,var(--color-accent),var(--color-surface))] p-4 sm:p-6">
          <ProductShot shot={shot} rounded="rounded-lg" className="mx-auto max-w-md" />
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({
  icon: Icon,
  label,
  text,
  horizontal = false,
}: Capability & { horizontal?: boolean }) {
  return (
    <div
      className={`h-full rounded-xl border border-border/70 bg-card p-5 shadow-sm ${horizontal ? "flex gap-4" : ""}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <h3 className={`text-base font-semibold ${horizontal ? "" : "mt-4"}`}>{label}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function ShotCard({
  caption,
  shot,
  className,
  paneClassName,
}: {
  caption: ReactNode;
  shot: Shot;
  className?: string;
  paneClassName?: string;
}) {
  return (
    <figure className={className}>
      <ProductShot shot={shot} rounded="rounded-lg" className={paneClassName} />
      <figcaption className="mt-2 text-xs font-medium text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}
