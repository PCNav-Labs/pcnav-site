import { createFileRoute } from "@tanstack/react-router";
import { Github, MessageSquarePlus, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GITHUB_ISSUES_URL = "https://github.com/Xtopher888/pcnav/issues";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback | PCNav" },
      {
        name: "description",
        content: "Report problems and suggest ideas to help improve OS Map.",
      },
      { property: "og:title", content: "Feedback — PCNav" },
      { property: "og:description", content: "Observations help improve OS Map." },
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
            Observations help improve OS Map.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="grid gap-4">
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Bug className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Report a problem</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Found something unexpected? Open an issue on GitHub.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <a href={GITHUB_ISSUES_URL} target="_blank" rel="noreferrer noopener">
                  <Github /> GitHub Issues
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <MessageSquarePlus className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Suggest an idea</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Have an idea for OS Map? Open an issue on GitHub and tell us what you'd find useful.
              </p>
              <Button asChild className="mt-6" variant="outline">
                <a href={GITHUB_ISSUES_URL} target="_blank" rel="noreferrer noopener">
                  <Github /> Suggest on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
