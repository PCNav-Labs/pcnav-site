import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type CtaLink = { to: "/os-map/download" | "/workspace-navigator/download"; label: string };

export function CtaBand({
  title = "Want the details on OS Map?",
  description = "See the current beta release information.",
  links = [{ to: "/os-map/download", label: "View Release Details" }],
}: {
  title?: string;
  description?: string;
  links?: CtaLink[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {links.map((link) => (
            <Button key={link.to} asChild size="lg">
              <Link to={link.to}>
                <FileText /> {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
