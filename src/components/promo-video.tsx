import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, FileText, Play } from "lucide-react";
import type { PromoVideo as PromoVideoConfig } from "@/lib/promo-video";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

type PlayerState = "ready" | "started" | "error";

const speedLabel = (rate: number) => `${rate}×`;

// An inline 16:9 player built on the native <video> element and its controls (play/pause, seek,
// volume, full screen, keyboard). Nothing autoplays and preload="none" keeps the video out of the
// page load: the poster is shown until the viewer presses play. The speed selector is the one
// speed control; the browser's own speed menu is hidden where the browser supports that, and any
// rate set elsewhere is shown as it is rather than as the nearest listed speed.
export function PromoVideo({ video }: { video: PromoVideoConfig }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<PlayerState>("ready");
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(false);

  // Move focus to the native controls once the video is no longer inert.
  useEffect(() => {
    if (state === "started") ref.current?.focus();
  }, [state]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Keep the selector in step with every rate change, wherever it comes from.
    const onRate = () => setRate(el.playbackRate);
    const onWaiting = () => setLoading(true);
    const onReady = () => setLoading(false);
    el.addEventListener("ratechange", onRate);
    el.addEventListener("waiting", onWaiting);
    for (const e of ["playing", "canplay", "pause"]) el.addEventListener(e, onReady);
    return () => {
      el.removeEventListener("ratechange", onRate);
      el.removeEventListener("waiting", onWaiting);
      for (const e of ["playing", "canplay", "pause"]) el.removeEventListener(e, onReady);
    };
  }, []);

  const start = () => {
    const el = ref.current;
    if (!el) return;
    setState("started");
    setLoading(true);
    // play() runs inside the click, so the browser treats it as user-initiated.
    el.play().catch(() => {
      // Refused or interrupted; the native controls remain available.
      setLoading(false);
    });
  };

  const setSpeed = (value: string) => {
    const el = ref.current;
    const r = Number(value);
    if (!el || !Number.isFinite(r) || r <= 0) return;
    // The default rate too, so a reload of the media keeps the chosen speed.
    el.defaultPlaybackRate = r;
    el.playbackRate = r;
  };

  const listed = (SPEEDS as readonly number[]).includes(rate);

  return (
    <figure className="@container mx-auto w-full max-w-5xl">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/70 bg-[#0b1626] shadow-xl shadow-black/10"
        data-video-state={state}
      >
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          src={video.src}
          poster={video.poster}
          controls
          controlsList="noplaybackrate"
          preload="none"
          playsInline
          aria-label={video.title}
          inert={state === "ready"}
          onError={() => {
            setLoading(false);
            setState("error");
          }}
        />

        {state === "ready" && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <button
              type="button"
              onClick={start}
              aria-label={video.accessibleLabel}
              aria-describedby="wn-video-duration wn-video-description"
              className="group absolute inset-0 flex cursor-pointer items-center justify-center text-white focus-visible:outline-none"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0b1626] shadow-2xl ring-white/60 ring-offset-4 ring-offset-[#0b1626] transition-transform group-hover:scale-105 group-focus-visible:ring-4 motion-reduce:transition-none motion-reduce:group-hover:scale-100 @md:h-20 @md:w-20 @2xl:h-24 @2xl:w-24">
                <Play
                  className="ml-1 h-7 w-7 fill-current @md:h-9 @md:w-9 @2xl:h-10 @2xl:w-10"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        )}

        {state === "error" && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#0b1626]/95 p-6 text-center text-white"
            role="alert"
          >
            <p className="max-w-sm text-sm leading-relaxed">
              The video could not be loaded. Please try again later.
            </p>
          </div>
        )}
      </div>

      <p className="sr-only" role="status">
        {state === "started" && loading ? "Loading video…" : ""}
      </p>

      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-medium text-foreground">{video.title}</span>
          <span id="wn-video-duration" className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {video.durationLabel}
          </span>
        </span>
        {state !== "error" && (
          <span className="inline-flex items-center gap-2">
            <label htmlFor="wn-video-speed" className="text-xs font-medium">
              Playback speed
            </label>
            <select
              id="wn-video-speed"
              value={String(rate)}
              onChange={(e) => setSpeed(e.target.value)}
              className="h-9 min-w-[4.5rem] cursor-pointer rounded-md border border-border bg-background px-2 text-sm font-medium tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {!listed && (
                <option value={String(rate)}>{`${speedLabel(rate)} (set by browser)`}</option>
              )}
              {SPEEDS.map((s) => (
                <option key={s} value={String(s)}>
                  {speedLabel(s)}
                </option>
              ))}
            </select>
          </span>
        )}
      </figcaption>

      <p id="wn-video-description" className="mt-2 text-sm text-muted-foreground">
        {video.description}
      </p>

      <Link
        to="/workspace-navigator/video-transcript"
        className="mt-2 inline-flex items-center gap-1.5 rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Read the transcript and credits
      </Link>
    </figure>
  );
}
