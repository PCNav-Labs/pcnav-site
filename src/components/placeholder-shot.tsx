import { ImageIcon } from "lucide-react";

export function PlaceholderShot({ label }: { label: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border/70 bg-surface/60">
      <div className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,var(--color-surface),var(--color-accent))] text-muted-foreground">
        <ImageIcon className="h-8 w-8 opacity-60" />
      </div>
      <figcaption className="border-t border-border/70 bg-card px-4 py-3 text-sm font-medium">
        {label}
        <span className="ml-2 text-xs font-normal text-muted-foreground">Screenshot placeholder</span>
      </figcaption>
    </figure>
  );
}
