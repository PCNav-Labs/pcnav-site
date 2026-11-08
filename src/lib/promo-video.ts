// Workspace Navigator videos. The Concept Video plays on the homepage and the Workspace Navigator
// page. The Video Introduction (R7) is no longer embedded; its file, poster, transcript and credits
// stay published at their URLs.
//
// The homepage plays the optimized MP4 inline in the site's own native player, with a speed
// selector; the poster is a frame of the video's opening title card, taken from the same file. No
// iframe, player library or third-party request is involved, and nothing loads until play.
//
// A replacement video may keep its filename: /media/ is served with "max-age=0, must-revalidate", so
// browsers revalidate and fetch the new file. Replace the poster too if the title card changes.

export type PromoVideo = {
  /** Shown beneath the video. */
  title: string;
  /** Shown beside the title, e.g. "3 min"; part of the play button's accessible description. */
  durationLabel: string;
  /** One sentence shown beneath the video; part of the play button's accessible description. */
  description: string;
  /** The play button's accessible name. */
  accessibleLabel: string;
  /** The video file. A <video> source is not a link, so the prerender crawl never fetches it; the
   *  prerender filter in vite.config.ts also excludes /media/ for any link to media. */
  src: string;
  /** Static 16:9 poster image (1280 x 720). */
  poster: string;
  /** The video's transcript and credits page, linked beneath the player. */
  transcript:
    | "/workspace-navigator/video-transcript"
    | "/workspace-navigator/concept-video-transcript";
};

export const WN_INTRO_VIDEO: PromoVideo = {
  title: "Workspace Navigator — Video Introduction",
  durationLabel: "3 min",
  description: "Discover Workspace Navigator and explore its features.",
  accessibleLabel: "Watch the Workspace Navigator Video Introduction",
  src: "/media/workspace-navigator-introduction-v1.mp4",
  poster: "/media/workspace-navigator-introduction-v1-thumbnail.jpg",
  transcript: "/workspace-navigator/video-transcript",
};

// Concept video for the Workspace Navigator page: what the product is for, rather than a tour of its
// features. The file is a web derivative of the accepted P3 v4 master: the same picture, cut and
// audio (the AAC track is carried over unchanged), with the video re-encoded to fit the 100 MB
// per-file limit of the publication route, and its index at the front for fast start.
export const WN_CONCEPT_VIDEO: PromoVideo = {
  title: "Workspace Navigator — Concept Video",
  durationLabel: "2 min",
  description:
    "The idea behind Workspace Navigator: keep related work together, and come back to it knowing where you were.",
  accessibleLabel: "Watch the Workspace Navigator Concept Video",
  src: "/media/workspace-navigator-concept-video-v1.mp4",
  poster: "/media/workspace-navigator-concept-video-v1-thumbnail.jpg",
  transcript: "/workspace-navigator/concept-video-transcript",
};
