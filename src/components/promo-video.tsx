import { Clock, ExternalLink, Play } from "lucide-react";
import type { PromoVideo as PromoVideoConfig } from "@/lib/promo-video";

// A static thumbnail that opens the video file in a new tab, where the browser's own player plays
// it. One link carries the thumbnail and the title. The image is decorative, so the link's
// accessible name comes from the visible title, duration and new-tab note.
export function PromoVideo({ video }: { video: PromoVideoConfig }) {
  return (
    <a
      href={video.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group @container mx-auto block w-full max-w-5xl rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <span className="relative block aspect-video w-full overflow-hidden rounded-2xl border border-border/70 bg-[#0b1626] shadow-xl shadow-black/10">
        <img
          src={video.thumbnail}
          alt=""
          width={1280}
          height={720}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0b1626] shadow-2xl transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 @md:h-20 @md:w-20 @2xl:h-24 @2xl:w-24">
            <Play className="ml-1 h-7 w-7 fill-current @md:h-9 @md:w-9 @2xl:h-10 @2xl:w-10" />
          </span>
        </span>
      </span>

      <span className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="font-medium text-foreground underline-offset-4 group-hover:underline">
          {video.title}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {video.durationLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Opens in a new tab
        </span>
      </span>
    </a>
  );
}
