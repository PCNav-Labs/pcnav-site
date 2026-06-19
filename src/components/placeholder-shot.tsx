export function PlaceholderShot({
  label,
  src,
  alt,
}: {
  label: string;
  src: string;
  alt: string;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      <div className="aspect-[16/10] overflow-hidden bg-muted/40">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <figcaption className="border-t border-border/60 bg-card px-4 py-2.5 text-sm font-medium text-foreground">
        {label}
      </figcaption>
    </figure>
  );
}
