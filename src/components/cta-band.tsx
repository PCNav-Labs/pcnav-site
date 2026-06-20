import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand({
  title = "Want the details on OS Map?",
  description = "See the current beta release information.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/download">
            <FileText /> View Release Details
          </Link>
        </Button>
      </div>
    </section>
  );
}
