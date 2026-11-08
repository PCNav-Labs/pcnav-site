import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

export const Route = createFileRoute("/workspace-navigator/concept-video-transcript")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator — Concept Video: Transcript" },
      {
        name: "description",
        content:
          "A text version of the Workspace Navigator Concept Video, with credits for the music it uses.",
      },
      { property: "og:title", content: "Workspace Navigator — Concept Video: Transcript" },
      {
        property: "og:description",
        content: "A text version of the Workspace Navigator Concept Video.",
      },
    ],
  }),
  component: ConceptVideoTranscriptPage,
});

// One entry per scene, in the order the video shows them. `caption` is on-screen text, quoted
// exactly as it appears in the video (v6 rev1, as published).
type Step = { action?: string; caption?: string };
type Scene = { title: string; time: string; steps: Step[] };

const SCENES: Scene[] = [
  {
    title: "Your Work, in Many Places",
    time: "0:00",
    steps: [
      {
        action:
          "Artwork: the Workspace Navigator title card, a compass drawn in white lines on a dark blue blueprint background.",
        caption: "A place for everything you need for the important work that you do.",
      },
      {
        action:
          "White line icons of a browser window, a document, a notepad and a folder appear, spaced apart.",
        caption: "Your work is often spread across websites, documents, notes and files.",
      },
      {
        action: "Dashed lines join the four icons, then break apart.",
        caption: "And coming back to it usually starts with searching for where you left off.",
      },
    ],
  },
  {
    title: "Documents and Projects",
    time: "0:17",
    steps: [
      {
        action:
          "The four icons gather inside a window outline, which becomes Workspace Navigator itself, shown with no Project open: the Explorer, the File Editor, the Notepad, Web Browsing and the Continuity Manager in one window.",
        caption: "Workspace Navigator brings related work together, in Documents or in Projects.",
      },
      { caption: "Manage your documents, or create Projects." },
      {
        action:
          "The Project menu, reading “No Project Open”, and the Documents folder are highlighted. The document “Talk outline.docx” opens in the File Editor, with the note “Talk idea: open with the Gull Point lighthouse.” in the Notepad below.",
        caption: "With no Project open, work from your Documents folder.",
      },
      {
        action:
          "The Project menu lists recent Projects and offers Create New Project, Import Folder (Copy) and Workspace Folder. The sample Project “Boats and Navigation” is opened, with its folders, notes and saved websites.",
        caption: "Open a Project to keep related work together.",
      },
    ],
  },
  {
    title: "Organising a Project",
    time: "0:37",
    steps: [
      {
        action: "The Explorer’s New menu offers New Folder, New File and New Project.",
        caption: "Create Projects, folders and files.",
      },
      {
        action:
          "In the Continuity Manager’s Organize tab, the file “Tide Times.txt” is selected and carries the tag “Gull Point visit”.",
        caption: "Tag files and folders to keep related work organised.",
      },
      {
        action:
          "The Properties tab shows the details of “Tide Times.txt”, then of the Project, whose Purpose reads “Research guide for a coastal navigation talk”.",
        caption: "View file, folder and Project properties.",
      },
      {
        action: "The Recent Activity tab lists the files, notes and websites used recently.",
        caption: "View recent files, notes and websites.",
      },
      {
        action:
          "The Tasks tab lists “Draft the Harrison chapter”, “Check chronometer history”, which is ticked as done, and “Review harbour photos”, and the task “Book the lighthouse gallery visit” is added.",
        caption: "Create a task list for each Project.",
      },
    ],
  },
  {
    title: "Websites and Documents",
    time: "0:59",
    steps: [
      {
        action:
          "A row of steps appears beneath the window: Project websites, Browser, Document, Project Notepad. The Project’s saved websites are highlighted, then one opens in the built-in browser: “Gull Point Harbour”, a fictional sample page of visitor notices made for this demonstration.",
        caption: "Browse and save websites to a Project or to Global websites.",
      },
      {
        action:
          "The Explorer’s New menu is shown, and the document “Harbour Visit Plan.docx” opens in the File Editor beside the browser.",
        caption: "Create and edit documents.",
      },
    ],
  },
  {
    title: "Panels and Notes",
    time: "1:14",
    steps: [
      {
        action: "Other panels are collapsed, leaving the document and the browser side by side.",
        caption: "Make room for what matters.",
      },
      {
        action:
          "The document is edited: the date becomes “Saturday morning, 10:00 at the lighthouse gallery”, and the checklist item “Park before 10:00 (free until then)” is added.",
        caption: "Shrink or expand panels to customise your workspace.",
      },
      {
        action: "The panels are restored.",
        caption: "Restore your panels whenever you need them.",
      },
      {
        action:
          "The Project Notepad is highlighted beside the browser, and the notes “Tide checked: high water 06:12 and 18:31.” and “Tripods allowed in the gallery before 11:00.” are typed.",
        caption: "Keep important notes in view.",
      },
      {
        action: "The whole window is shown, with the document, the browser and the notes together.",
        caption: "All your work, together in one place.",
      },
    ],
  },
  {
    title: "Closing",
    time: "1:37",
    steps: [
      {
        action:
          "The window draws back to reveal a compass drawn in blue lines on the blueprint background.",
        caption: "Spend less time searching and more time on what matters.",
      },
      {
        action:
          "Artwork: four white line icons, a graduation cap, a microscope, a briefcase and four squares.",
      },
      { caption: "Made for" },
      { caption: "Educators & Students" },
      { caption: "Researchers" },
      { caption: "Professionals" },
      { caption: "General Use" },
      {
        action:
          "Artwork: the compass above a glowing blue horizon. The picture and the music fade out at the end.",
      },
      { caption: "Workspace Navigator" },
      { caption: "See where you were. Know where you are. Plan where you’re going." },
      { caption: "pcnav.net" },
    ],
  },
];

const linkClass = "text-primary underline underline-offset-4 hover:no-underline";

function ConceptVideoTranscriptPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Transcript
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator — Concept Video
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A text version of the two-minute Workspace Navigator Concept Video. The video has
            instrumental music and no spoken narration. Its information is shown as on-screen text
            over screenshots of Workspace Navigator, using a fictional sample Project, files and web
            page.
          </p>
          <p className="mt-6">
            <Link
              to="/workspace-navigator"
              hash="concept-video"
              className={`inline-flex items-center gap-1.5 font-medium ${linkClass}`}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Watch the Concept Video
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Transcript</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Times are approximate. Quoted text appears on screen.
        </p>
        <ol className="mt-8 space-y-10">
          {SCENES.map((scene, i) => (
            <li key={scene.title}>
              <h3 className="font-display text-lg font-semibold">
                {i + 1}. {scene.title}{" "}
                <span className="text-sm font-normal text-muted-foreground">({scene.time})</span>
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
                {scene.steps.map((step, j) => (
                  <li key={j}>
                    {step.action}
                    {step.action && step.caption ? " " : ""}
                    {step.caption && <>On screen: “{step.caption}”</>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Credits</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground">
            <li>
              Music: “Background Abstract Music” by u_98o9hlkn7r, from Pixabay (track 334803), used
              under the Pixabay Content License.
            </li>
            <li>
              The sample Project, its files and the “Gull Point Harbour” web page shown in the video
              are fictional, made for this demonstration.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Looking for a tour of the features? The{" "}
            <Link to="/workspace-navigator/video-transcript" className={linkClass}>
              Workspace Navigator Video Introduction
            </Link>{" "}
            shows them in action.
          </p>
        </div>
      </section>
    </>
  );
}
