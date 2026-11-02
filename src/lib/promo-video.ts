// Homepage introduction video for Workspace Navigator.
//
// The finished video and its poster are not yet approved, so `src` and `poster` are null. While
// `src` is null the homepage shows a clearly labelled placeholder and renders no <video> element,
// so no media request is made. To connect the finished assets, place them under public/media/ and
// set the paths below — no change to the homepage layout is needed.
//
// Captions and a transcript are not invented for an unfinished video. Add them here once they
// exist; the player renders a <track> per caption file and a transcript link when one is set.

export type PromoCaption = { src: string; srclang: string; label: string; default?: boolean };

export type PromoVideo = {
  /** Accessible name of the video, also shown beneath the player. */
  title: string;
  /** Shown beneath the player and on the play button, e.g. "3 min". */
  durationLabel: string | null;
  /** Video file URL, e.g. "/media/workspace-navigator-introduction.mp4". */
  src: string | null;
  /** MIME type of `src`. */
  type: string;
  /** Poster image URL (16:9), e.g. "/media/workspace-navigator-introduction-poster.jpg". */
  poster: string | null;
  captions: PromoCaption[];
  transcriptHref: string | null;
};

export const WN_INTRO_VIDEO: PromoVideo = {
  title: "Workspace Navigator — Introduction",
  durationLabel: null,
  src: null,
  type: "video/mp4",
  poster: null,
  captions: [],
  transcriptHref: null,
};
