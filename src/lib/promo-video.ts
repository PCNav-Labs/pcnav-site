// Homepage introduction video for Workspace Navigator.
//
// The homepage shows a static thumbnail; selecting it opens the optimized MP4 in a new browser tab,
// where the browser's own player plays it. No embedded player, iframe or third-party request is
// involved. The thumbnail is a frame of the video's opening title card, taken from the same file.
//
// A replacement video takes a new versioned filename under public/media/, with a new thumbnail, so
// a cached copy of an earlier version is never mistaken for it.

export type PromoVideo = {
  /** Shown beneath the thumbnail; part of the link's accessible name. */
  title: string;
  /** Shown beside the title, e.g. "3 min". */
  durationLabel: string;
  /** The video file, opened in a new tab. Page-relative, so the prerender crawl never follows it;
   *  the prerender filter in vite.config.ts also excludes /media/ for any other link to media. */
  href: string;
  /** Static 16:9 thumbnail image (1280 x 720). */
  thumbnail: string;
};

export const WN_INTRO_VIDEO: PromoVideo = {
  title: "Workspace Navigator — Video Introduction",
  durationLabel: "3 min",
  href: "media/workspace-navigator-introduction-v1.mp4",
  thumbnail: "/media/workspace-navigator-introduction-v1-thumbnail.jpg",
};
