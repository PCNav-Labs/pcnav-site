import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const APPS = [
  {
    to: "/feedback/os-map",
    name: "OS Map",
    description: "Report a bug or suggest a feature for OS Map.",
  },
  {
    to: "/feedback/workspace-navigator",
    name: "Workspace Navigator",
    description: "Report a bug or suggest a feature for Workspace Navigator.",
  },
] as const;

export const Route = createFileRoute("/feedback/")({
  head: () => ({
    meta: [
      { title: "Feedback | PCNav" },
      {
        name: "description",
        content:
          "Report problems and suggest ideas to help improve OS Map and Workspace Navigator.",
      },
      { property: "og:title", content: "Feedback — PCNav" },
      { property: "og:description", content: "Observations help improve PCNav applications." },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Feedback</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Feedback welcome.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Observations help improve PCNav applications. Choose the application your feedback is
            about.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {APPS.map((app) => (
            <Link
              key={app.to}
              to={app.to}
              className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full border-border/70 shadow-none transition-colors group-hover:border-primary/50">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold">{app.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{app.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {app.name} feedback <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
