import { cn } from "@/lib/utils";

// Product images and the site's original decorative graphics.
//
// Every Workspace Navigator image on the site is a still taken from the published Concept Video
// (public/media/workspace-navigator-concept-video-v1.mp4), which shows the application itself
// working on a fictional sample Project, "Boats and Navigation". Stills are cropped from the
// application window only; nothing in them is drawn or altered. Decorative graphics below are
// plain SVG line art and never imitate the application.

export type Shot = { src: string; width: number; height: number; alt: string };

const SHOT_DIR = "/screenshots/workspace-navigator";

export const SHOTS = {
  window: {
    src: `${SHOT_DIR}/wn-window.webp`,
    width: 1340,
    height: 752,
    alt: "Workspace Navigator showing a sample Project, Boats and Navigation: the Explorer with the Project's documents and folders, the Continuity Manager's Recent Activity, a Word document open in the File Editor, the Project's notes, and a saved website open in the built-in browser.",
  },
  explorer: {
    src: `${SHOT_DIR}/wn-explorer.webp`,
    width: 432,
    height: 335,
    alt: "The Explorer listing the sample Project's Documents, Files, Notes and Pictures folders, with tags shown beside two documents.",
  },
  editor: {
    src: `${SHOT_DIR}/wn-editor.webp`,
    width: 442,
    height: 407,
    alt: "A Word document, Harbour Visit Plan, open for editing in the File Editor.",
  },
  notes: {
    src: `${SHOT_DIR}/wn-notes.webp`,
    width: 420,
    height: 265,
    alt: "The Project's notes, with three short notes about tide times and the lighthouse gallery.",
  },
  browser: {
    src: `${SHOT_DIR}/wn-browser.webp`,
    width: 458,
    height: 662,
    alt: "A fictional sample web page, Gull Point Harbour, open in Workspace Navigator's built-in browser.",
  },
  websites: {
    src: `${SHOT_DIR}/wn-websites.webp`,
    width: 456,
    height: 662,
    alt: "The Project's saved websites, with the name, address and notes for one of them.",
  },
  recent: {
    src: `${SHOT_DIR}/wn-recent.webp`,
    width: 432,
    height: 342,
    alt: "The Continuity Manager's Recent Activity, listing the files, notes and websites used in the Project, most recent first.",
  },
  properties: {
    src: `${SHOT_DIR}/wn-properties.webp`,
    width: 432,
    height: 342,
    alt: "The Continuity Manager's Properties tab, showing the Project's Purpose, Research guide for a coastal navigation talk, and its Project Notes.",
  },
  tasks: {
    src: `${SHOT_DIR}/wn-tasks.webp`,
    width: 432,
    height: 200,
    alt: "The Continuity Manager's Tasks tab with three tasks, one of them ticked as done.",
  },
} satisfies Record<string, Shot>;

/** A product still in a quiet frame. `priority` loads it eagerly (above the fold). */
export function ProductShot({
  shot,
  className,
  priority = false,
  rounded = "rounded-xl",
}: {
  shot: Shot;
  className?: string;
  priority?: boolean;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-white/10 bg-[#0b0e16] shadow-[0_24px_60px_-20px_rgba(8,20,40,0.45)] ring-1 ring-black/5",
        rounded,
        className,
      )}
    >
      <img
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className="block h-auto w-full"
      />
    </div>
  );
}

/** A compass rose in thin lines, after the brand mark. Decorative only. */
export function CompassRose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <circle cx="200" cy="200" r="190" opacity="0.35" />
        <circle cx="200" cy="200" r="150" opacity="0.5" />
        <circle cx="200" cy="200" r="96" opacity="0.35" strokeDasharray="2 6" />
        <path d="M200 6v388M6 200h388" opacity="0.25" />
        <path d="M63 63l274 274M337 63L63 337" opacity="0.15" />
        <polygon
          points="200,52 218,182 348,200 218,218 200,348 182,218 52,200 182,182"
          opacity="0.7"
        />
        <polygon
          points="200,120 208,192 280,200 208,208 200,280 192,208 120,200 192,192"
          opacity="0.45"
        />
      </g>
      <circle cx="200" cy="200" r="5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

/**
 * Lines from four points that meet in one place: the scattered pieces of a piece of work coming
 * together as a Project. Drawn to sit under a row of four tiles. Decorative only.
 */
export function ConvergeLines({ className }: { className?: string }) {
  const xs = [12.5, 37.5, 62.5, 87.5];
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {xs.map((x) => (
        <path
          key={x}
          d={`M${x} 0 C ${x} 22, 50 18, 50 40`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
