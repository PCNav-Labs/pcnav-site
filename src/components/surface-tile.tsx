import type { LucideIcon } from "lucide-react";

export function SurfaceTile({
  icon: Icon,
  label,
  caption,
}: {
  icon: LucideIcon;
  label: string;
  caption?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border/70 bg-surface/60">
      <div className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,var(--color-surface),var(--color-accent))] text-primary/80">
        <Icon className="h-10 w-10" />
      </div>
      <figcaption className="border-t border-border/70 bg-card px-4 py-3">
        <span className="text-sm font-medium">{label}</span>
        {caption && <span className="ml-2 text-xs font-normal text-muted-foreground">{caption}</span>}
      </figcaption>
    </figure>
  );
}
