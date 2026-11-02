import { useEffect, useRef, useState, type ReactNode } from "react";
import { Compass, Play, Clock, FileText } from "lucide-react";
import type { PromoVideo as PromoVideoConfig } from "@/lib/promo-video";
import { cn } from "@/lib/utils";

const SPEEDS = [1, 1.25, 1.5, 2] as const;

type PlayerState = "ready" | "started" | "error";

// A 16:9 promotional video player built on the native <video> element and its controls
// (play/pause, seek, volume, full screen, keyboard). Nothing autoplays: playback starts only when
// the viewer presses the play button, and preload="none" keeps the video out of the initial page
// load. While no video is configured, a labelled placeholder is shown and no <video> is rendered.
export function PromoVideo({ video }: { video: PromoVideoConfig }) {
  return video.src ? <Player video={video} src={video.src} /> : <Unavailable video={video} />;
}

function Frame({ children, state }: { children: ReactNode; state: string }) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/70 bg-[#0b1626] shadow-xl shadow-black/10"
      data-promo-state={state}
    >
      {children}
    </div>
  );
}

function Player({ video, src }: { video: PromoVideoConfig; src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<PlayerState>("ready");
  const [rate, setRate] = useState(1);

  // Move focus to the native controls once the video is no longer inert.
  useEffect(() => {
    if (state === "started") ref.current?.focus();
  }, [state]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The native controls can also change the rate; keep the speed buttons in step with them.
    const onRate = () => setRate(el.playbackRate);
    el.addEventListener("ratechange", onRate);
    return () => el.removeEventListener("ratechange", onRate);
  }, []);

  const start = () => {
    const el = ref.current;
    if (!el) return;
    setState("started");
    // play() runs inside the click, so the browser treats it as user-initiated.
    el.play().catch(() => {
      // Refused or interrupted; the native controls remain available.
    });
  };

  const setSpeed = (r: number) => {
    if (ref.current) ref.current.playbackRate = r;
  };

  return (
    <figure className="mx-auto w-full max-w-5xl">
      <Frame state={state}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          src={src}
          poster={video.poster ?? undefined}
          controls
          preload="none"
          playsInline
          aria-label={video.title}
          inert={state === "ready"}
          onError={() => setState("error")}
        >
          {video.captions.map((c) => (
            <track
              key={c.src}
              kind="captions"
              src={c.src}
              srcLang={c.srclang}
              label={c.label}
              default={c.default}
            />
          ))}
        </video>

        {state === "ready" && (
          <div className="absolute inset-0">
            {video.poster ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            ) : (
              <TitleCard showTitle={false} />
            )}
            <button
              type="button"
              onClick={start}
              aria-label={`Play video: ${video.title}${video.durationLabel ? `, ${video.durationLabel}` : ""}`}
              className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 text-white focus-visible:outline-none"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#0b1626] shadow-2xl ring-white/60 ring-offset-4 ring-offset-[#0b1626] transition-transform group-hover:scale-105 group-focus-visible:ring-4 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-24 sm:w-24">
                <Play className="ml-1 h-9 w-9 fill-current sm:h-10 sm:w-10" aria-hidden="true" />
              </span>
              <span className="rounded-full bg-black/55 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                Play video{video.durationLabel ? ` · ${video.durationLabel}` : ""}
              </span>
            </button>
          </div>
        )}

        {state === "error" && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#0b1626]/95 p-6 text-center text-white"
            role="status"
          >
            <p className="max-w-sm text-sm leading-relaxed">
              The video could not be loaded. Please try again later.
            </p>
          </div>
        )}
      </Frame>

      <figcaption className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Caption video={video} />
        {state !== "error" && (
          <div className="flex items-center gap-2" role="group" aria-label="Playback speed">
            <span className="text-xs font-medium uppercase tracking-[0.14em]">Speed</span>
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                aria-pressed={rate === s}
                aria-label={`${s} times speed`}
                className={cn(
                  "min-w-11 cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
                  rate === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent",
                )}
              >
                {s}×
              </button>
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

const UNAVAILABLE = "Video in production — not yet available";

// Shown while no finished video is configured. It is labelled as unavailable and offers no play
// control, so it cannot be mistaken for a playable video.
function Unavailable({ video }: { video: PromoVideoConfig }) {
  return (
    <figure className="mx-auto w-full max-w-5xl">
      <Frame state="unavailable">
        {video.poster ? (
          <img
            src={video.poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <TitleCard />
        )}
        {/* On narrow screens the label moves below the frame so it does not cover the title. */}
        <div className="absolute inset-x-0 bottom-0 hidden justify-center p-6 sm:flex">
          <p className="rounded-full bg-black/60 px-4 py-1.5 text-center text-sm font-medium text-white backdrop-blur-sm">
            {UNAVAILABLE}
          </p>
        </div>
      </Frame>
      <figcaption className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
        <Caption video={video} />
        <p className="font-medium text-foreground sm:hidden">{UNAVAILABLE}</p>
      </figcaption>
    </figure>
  );
}

function Caption({ video }: { video: PromoVideoConfig }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="font-medium text-foreground">{video.title}</span>
      {video.durationLabel && (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {video.durationLabel}
        </span>
      )}
      {video.transcriptHref && (
        <a
          href={video.transcriptHref}
          className="inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Read the transcript
        </a>
      )}
    </div>
  );
}

// Neutral title card used where no approved poster image exists. It is not a final poster.
function TitleCard({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_20%_10%,#1d3557_0%,#0b1626_55%,#05090f_100%)]"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="promo-flow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#9ecbff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#cfe6ff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-50 640 C 300 520, 520 760, 860 600 S 1380 420, 1650 520 L 1650 600 C 1380 520, 1150 700, 860 690 S 300 600, -50 720 Z"
          fill="url(#promo-flow)"
        />
        <path
          d="M-50 560 C 340 470, 600 660, 900 540 S 1400 380, 1650 450"
          fill="none"
          stroke="#e6f1ff"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
      </svg>
      {showTitle && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 pb-10 text-center text-white sm:gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 sm:h-16 sm:w-16">
            <Compass className="h-6 w-6 text-white/85 sm:h-8 sm:w-8" />
          </span>
          <p className="font-display text-lg font-semibold tracking-tight sm:text-3xl">
            Workspace Navigator
          </p>
          <p className="text-xs uppercase tracking-[0.22em] text-white/70 sm:text-sm">
            Introduction
          </p>
        </div>
      )}
    </div>
  );
}
