import type { LucideIcon } from "lucide-react";

export function SurfaceTile({
  icon: Icon,
  label,
  caption,
  src,
  alt,
}: {
  icon: LucideIcon;
  label: string;
  caption?: string;
  src?: string;
  alt?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border/70 bg-surface/60">
      <div className="aspect-[16/10] bg-[linear-gradient(135deg,var(--color-surface),var(--color-accent))]">
        {src ? (
          <img
            src={src}
            alt={alt ?? label}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/80">
            <Icon className="h-10 w-10" />
          </div>
        )}
      </div>
      <figcaption className="border-t border-border/70 bg-card px-4 py-3">
        <span className="text-sm font-medium">{label}</span>
        {caption && <span className="ml-2 text-xs font-normal text-muted-foreground">{caption}</span>}
      </figcaption>
    </figure>
  );
}
