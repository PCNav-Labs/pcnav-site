import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  FolderTree,
  FileText,
  StickyNote,
  Tags,
  FileSearch,
  History,
  Bookmark,
  Globe,
  ExternalLink,
  ListChecks,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";

export const Route = createFileRoute("/workspace-navigator/")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator | PCNav" },
      {
        name: "description",
        content:
          "A Windows desktop application that keeps a project's files, notes, tags, tasks and saved web destinations together in one place. A public beta is being prepared.",
      },
      { property: "og:title", content: "Workspace Navigator — PCNav" },
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
// application's shipped in-app Help for v0.5.0 before publication.
//
// Deferred by the Owner (2026-10-11): AI Assistance is not published until its capabilities and
// privacy claims are qualified. Tasks are described as project-only, as in v0.5.0.
const FEATURES = [
  {
    icon: FolderTree,
    title: "Projects and the Explorer",
    items: [
      "Create a new project or import a copy of an existing folder without changing the original.",
      "Browse, rename, copy and move files, with a Recycle Bin for deleted items.",
    ],
  },
  {
    icon: FileText,
    title: "Documents",
    items: [
      "Create and edit DOCX, Markdown and plain-text documents with the built-in editor. No separate document editor is required.",
      "Preview PDF files with search, and view images directly in Workspace Navigator.",
      "Work with documents independently of your projects or as part of a project.",
    ],
  },
  {
    icon: StickyNote,
    title: "Notes",
    items: [
      "Quickly jot down ideas, reminders and important details as they come to mind.",
      "Keep notes independently, without needing to open a project.",
      "Attach notes to projects, folders, files or tasks to keep relevant information close at hand.",
    ],
  },
];

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

type Capability = { icon: LucideIcon; label: string; text: string };

function WorkspaceNavigatorPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Product · Beta
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A Windows desktop application that keeps a project's files, notes, tags, tasks and saved
            web destinations together in one place, so you can see where things stand and pick up
            where you left off.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="outline">
              <Link to="/feedback/workspace-navigator">
                <MessageSquarePlus /> Share Feedback
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            A Workspace Navigator 0.5.0 beta is being prepared. It isn't available to download yet.
          </p>
        </div>
      </section>

      {/* 1-4: What it does — Projects and the Explorer, Documents, Notes */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="What it does"
          title="One place for each project's work."
          description="Keep your projects, documents, notes and tasks together in one workspace, with a separate Documents section for files you want to manage independently of any project."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} items={f.items} />
          ))}
        </div>

        {/* 5: Continuity Manager */}
        <CapabilityGroup
          id="continuity-manager"
          title="Continuity Manager"
          intro="Keep your work organized, understand what's changed and stay on top of what needs doing."
          items={CONTINUITY}
          wide
        />

        {/* 6: Web Browsing */}
        <CapabilityGroup
          id="web-browsing"
          title="Web Browsing"
          intro="Keep useful websites close to your work without constantly switching applications."
          items={WEB}
        />
      </section>

      {/* 7: Public Beta Release */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Release status
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Beta Release — October 2026
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            Workspace Navigator v0.5.0 is being prepared for public beta testing. Once available,
            you'll be able to download the application, explore its features and share your feedback
            to help guide future improvements.
          </p>
        </div>
      </section>
    </>
  );
}

function CapabilityGroup({
  id,
  title,
  intro,
  items,
  wide = false,
}: {
  id: string;
  title: string;
  intro: string;
  items: Capability[];
  wide?: boolean;
}) {
  return (
    <div id={id} className="mt-16">
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      <div
        className={`mt-6 grid gap-4 sm:grid-cols-2 ${wide ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
      >
        {items.map(({ icon: Icon, label, text }) => (
          <Card key={label} className="h-full border-border/70 shadow-none">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-lg font-semibold">{label}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
