import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FolderTree,
  FileText,
  StickyNote,
  Tags,
  ListChecks,
  Globe,
  Info,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Every capability below is described from the in-app Help that ships with the beta build;
// nothing here describes behaviour that has not been built.
const FEATURES = [
  {
    icon: FolderTree,
    title: "Projects and the Explorer",
    items: [
      "Create a project, or copy in an existing folder — the original is left untouched",
      "Browse, rename, copy and move files, with a Recycle Bin",
    ],
  },
  {
    icon: FileText,
    title: "Documents",
    items: [
      "Create and edit Word (.docx), Markdown and plain-text documents",
      "Preview PDF files, with search",
    ],
  },
  {
    icon: StickyNote,
    title: "Notes",
    items: [
      "Keep free-form notes, with or without a project open",
      "Add a note to a project, a folder, a file or a task",
    ],
  },
  {
    icon: Tags,
    title: "Organize",
    items: [
      "Tag files and folders in a project",
      "See every tag in a project and how often it's used",
    ],
  },
  {
    icon: ListChecks,
    title: "Tasks",
    items: [
      "Keep a simple task list for each project",
      "Complete, reopen and edit tasks as work moves on",
    ],
  },
  {
    icon: Globe,
    title: "Web Browsing",
    items: [
      "Save the websites you use, for every project or for one",
      "Open them inside Workspace Navigator or in your usual browser",
    ],
  },
];

const LOCAL = [
  "Your projects and their Workspace Navigator records stay on your computer.",
  "No account or sign-in is needed.",
  "Workspace Navigator has no built-in sharing and doesn't send your projects, documents or notes anywhere.",
  "Information leaves your computer only when you open a website you chose.",
];

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
            <Button asChild size="lg">
              <Link to="/workspace-navigator/download">
                <Info /> Beta Release Status
              </Link>
            </Button>
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

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="What it does" title="One place for each project's work." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} items={f.items} />
          ))}
        </div>
      </section>

      {/* Local by design */}
      <section className="bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="On your computer" title="Your work stays local." />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {LOCAL.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-border/70 bg-background px-5 py-4 text-sm text-muted-foreground"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Beta */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Public beta in preparation
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            The beta is a chance to try Workspace Navigator and help shape it. Release details will
            be posted on the release page when the beta is available.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/workspace-navigator/download">
              <Info /> Beta Release Status
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
