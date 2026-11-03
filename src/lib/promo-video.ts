// Homepage introduction video for Workspace Navigator.
//
// The finished video is served from public/media/ as a web-delivery copy (H.264/AAC, faststart); a
// replacement takes a new versioned filename. Its poster is not yet approved, so `poster` is
// null and the player shows the neutral title card until playback starts. If `src` is set back to
// null, the homepage shows a clearly labelled placeholder and renders no <video> element.
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
  title: "Workspace Navigator — Video Introduction",
  durationLabel: "3 min",
  src: "/media/workspace-navigator-introduction-v1.mp4",
  type: "video/mp4",
  poster: null,
  captions: [],
  transcriptHref: null,
};
