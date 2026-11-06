import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

const VIDEO_HREF = "/media/workspace-navigator-introduction-v1.mp4";

export const Route = createFileRoute("/workspace-navigator/video-transcript")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator — Video Introduction: Transcript" },
      {
        name: "description",
        content:
          "A text version of the Workspace Navigator Video Introduction, with credits for the third-party content it shows.",
      },
      { property: "og:title", content: "Workspace Navigator — Video Introduction: Transcript" },
      {
        property: "og:description",
        content: "A text version of the Workspace Navigator Video Introduction.",
      },
    ],
  }),
  component: VideoTranscriptPage,
});

// One entry per scene, in the order the video shows them. `caption` is on-screen text, quoted
// exactly as it appears in the video.
type Step = { action?: string; caption?: string };
type Scene = { title: string; time: string; band?: [string, string]; steps: Step[] };

const SCENES: Scene[] = [
  {
    title: "Welcome",
    time: "0:00",
    steps: [
      {
        action:
          "Artwork: a compass drawn in white lines on a dark blue blueprint background, with stars and glowing blue curves.",
      },
      { caption: "Workspace Navigator" },
      { caption: "A place for everything you need for the important work that you do." },
    ],
  },
  {
    title: "All in One Place",
    time: "0:07",
    steps: [
      {
        action:
          "Artwork: a compass on the blueprint background, surrounded by white line icons: a browser window, a document, a notepad with a pencil and a folder with a magnifying glass.",
      },
      {
        caption:
          "Imagine browsing the web, creating documents, and taking notes all in one place, while always knowing where you left off!",
      },
    ],
  },
  {
    title: "Made For",
    time: "0:13",
    steps: [
      {
        action:
          "Artwork: four white line icons on the blueprint background: a graduation cap, a microscope, a briefcase and four squares.",
      },
      { caption: "Made for" },
      { caption: "Educators & Students" },
      { caption: "Researchers" },
      { caption: "Professionals" },
      { caption: "General Use" },
    ],
  },
  {
    title: "Explore the Possibilities",
    time: "0:18",
    steps: [
      { caption: "Explore the possibilities..." },
      {
        action:
          "Artwork: a folder, a picture, a document and a table rise along a glowing blue path on the blueprint background.",
      },
    ],
  },
  {
    title: "Create a Project",
    time: "0:22",
    band: ["Create a Project", "One place for all your work"],
    steps: [
      {
        action:
          "Workspace Navigator is open on a sample Project, “Boats and Navigation”, with the Explorer, the File Editor, the Web Browsing pane, the Continuity Manager and the Project’s notes. From the Project menu, a new Project named “Sail Restoration” is created.",
        caption: "First, name your Project and save it.",
      },
      {
        action:
          "A Getting started dialog asks “What are you working on?”, with the note “AI-assisted start (not available in beta)”. Skip for now is chosen, and the new Project appears in the Explorer with Documents, Files, Notes and Pictures folders.",
        caption: "Starter folders help you stay organized.",
      },
      {
        action:
          "The Project menu lists recent Projects: Sail Restoration, Boats and Navigation, Client Proposal, Science Lessons and World History Coursework.",
        caption: "Switch between Projects easily.",
      },
    ],
  },
  {
    title: "Explorer",
    time: "0:44",
    band: ["Explorer", "Find and organize your files"],
    steps: [
      {
        action:
          "Boats and Navigation is expanded to show its Documents, Files, Notes and Pictures folders.",
        caption: "Explore all your work.",
      },
      {
        action: "The file “Harbour Visit Plan.md” is opened from the Explorer in the File Editor.",
        caption: "Open files directly from Explorer.",
      },
    ],
  },
  {
    title: "Customize Your Workspace",
    time: "1:03",
    band: ["Customize Your Workspace", "Arrange your panes and customize your work area"],
    steps: [
      {
        action: "A divider between panes is dragged to resize them.",
        caption: "Drag dividers to resize panes.",
      },
      { action: "Panes are docked with their arrows.", caption: "Click the arrows to dock panes." },
      { action: "The panes are restored.", caption: "Click again to restore them." },
      {
        action: "The theme menu switches the application between Light and Dark.",
        caption: "Switch between Light and Dark Mode.",
      },
    ],
  },
  {
    title: "Web Browser",
    time: "1:26",
    band: ["Web Browser", "Research without leaving your workspace"],
    steps: [
      {
        action:
          "A website named “History of longitude”, with the address https://en.wikipedia.org/wiki/History_of_longitude, is added.",
        caption: "Add websites to your browser panel.",
      },
      {
        action: "The website is saved to the Boats and Navigation Project.",
        caption: "Save useful websites to a Project.",
      },
      {
        action:
          "The page opens inside Workspace Navigator and is scrolled. It shows the Wikipedia article “History of longitude”, including a photograph of longitude monuments at Sheshan Observatory and Ptolemy’s map of the Mediterranean.",
        caption: "Explore without switching apps.",
      },
    ],
  },
  {
    title: "Documents / File Editor",
    time: "1:49",
    band: ["Documents / File Editor", "Open, edit and save your documents"],
    steps: [
      {
        action: "“Longitude Research Guide.docx” is opened from the Explorer.",
        caption: "Open documents in your workspace.",
      },
      {
        action: "The sentence “Add a map of Gull Point.” is typed into the document.",
        caption: "Make changes directly in the File Editor.",
      },
      { action: "The document is saved.", caption: "Save your work." },
      {
        action: "The document is opened again, and the change is still there.",
        caption: "Your changes are ready when you return.",
      },
    ],
  },
  {
    title: "Notepad",
    time: "2:12",
    band: ["Notepad", "Capture ideas as you work"],
    steps: [
      {
        action:
          "The Project’s notes are shown, including “How did sailors find longitude before GPS?”. A new note is added.",
        caption: "Keep notes nearby for easy reference.",
      },
      {
        action: "The note “Check tide times for Saturday.” is typed.",
        caption: "Write down ideas without leaving your workspace.",
      },
    ],
  },
  {
    title: "Organize & Properties",
    time: "2:23",
    band: ["Organize & Properties", "Find, tag and manage your files"],
    steps: [
      {
        action:
          "In the Continuity Manager’s Organize tab, a search for “Longitude” finds “Longitude Research Guide.docx” in Boats and Navigation.",
        caption: "Find files across your Workspace.",
      },
      {
        action: "A new tag, “Navigation history”, is assigned to the file.",
        caption: "Organize files with custom tags.",
      },
      {
        action: "The tag is shown with the file.",
        caption: "See your files and their tags together.",
      },
      {
        action: "In the Properties tab, the file note “Use for the Saturday talk.” is added.",
        caption: "View file details and add important notes.",
      },
    ],
  },
  {
    title: "Tasks & Recent Activity",
    time: "2:51",
    band: ["Tasks & Recent Activity", "Stay on track and pick up where you left off"],
    steps: [
      {
        action:
          "The Tasks tab lists “Draft the Harrison chapter”, “Check chronometer history” and “Review harbour photos”.",
        caption: "View tasks and track what needs doing.",
      },
      { action: "“Check chronometer history” is ticked.", caption: "Mark tasks as completed." },
      {
        action:
          "The Recent Activity tab lists recently used items: the History of longitude session, a new note, Longitude Research Guide.docx, Harbour Visit Plan.md, Ideas for the guide and Tide Times.txt.",
        caption: "Use Recent Activity to find recent work.",
      },
      {
        action: "Longitude Research Guide.docx is reopened from Recent Activity.",
        caption: "Pick up where you left off.",
      },
    ],
  },
  {
    title: "Closing",
    time: "3:10",
    steps: [
      {
        action:
          "Artwork: a compass drawn in white lines on the blueprint background, above a glowing blue horizon.",
      },
      { caption: "Workspace Navigator" },
      { caption: "See where you were. Know where you are. Plan where you’re going." },
      { caption: "pcnav.net" },
    ],
  },
];

const linkClass = "text-primary underline underline-offset-4 hover:no-underline";

function VideoTranscriptPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Transcript
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator — Video Introduction
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A text version of the three-minute Workspace Navigator Video Introduction. The video has
            instrumental music and no spoken narration. Its information is shown as on-screen text
            and demonstrated in the application, using sample Projects and files.
          </p>
          <p className="mt-6">
            <a
              href={VIDEO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 font-medium ${linkClass}`}
            >
              Watch the Video Introduction
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
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
              {scene.band && (
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  On screen: “{scene.band[0]}” — “{scene.band[1]}”
                </p>
              )}
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
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The Web Browser scene shows a Wikipedia article, as it appeared when the video was
            recorded in November 2026, in a screen recording. Changes were made: parts of the
            article and its two images are shown cropped.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground">
            <li>
              Article text: “
              <a href="https://en.wikipedia.org/wiki/History_of_longitude" className={linkClass}>
                History of longitude
              </a>
              ” by Wikipedia contributors, licensed under{" "}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className={linkClass}>
                CC BY-SA 4.0
              </a>
              .
            </li>
            <li>
              Photograph: “
              <a
                href="https://commons.wikimedia.org/wiki/File:Monuments_of_International_Longitude_Determination.jpg"
                className={linkClass}
              >
                Monuments of International Longitude Determination
              </a>
              ” by Mountain (Wikimedia Commons), licensed under{" "}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className={linkClass}>
                CC BY-SA 4.0
              </a>
              .
            </li>
            <li>
              Map: “
              <a
                href="https://commons.wikimedia.org/wiki/File:Ptolemy_map_of_Mediterranean_superimposed_on_modern_map.png"
                className={linkClass}
              >
                Ptolemy map of Mediterranean superimposed on modern map
              </a>
              ” by Kognos (Wikimedia Commons), licensed under{" "}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" className={linkClass}>
                CC BY-SA 4.0
              </a>
              .
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Wikipedia is a trademark of the Wikimedia Foundation. PCNav is not endorsed by or
            affiliated with the Wikimedia Foundation.
          </p>
        </div>
      </section>
    </>
  );
}
