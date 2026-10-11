import { Link } from "@tanstack/react-router";
import { Github, MessageSquarePlus, Bug, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type FeedbackApp = {
  name: string;
  repoUrl: string;
  bugTemplate: string;
  featureTemplate: string;
  // Present only where GitHub private vulnerability reporting is enabled on the repository.
  privateReportingUrl?: string;
};

export const OS_MAP_FEEDBACK: FeedbackApp = {
  name: "OS Map",
  repoUrl: "https://github.com/PCNav-Labs/os-map-feedback",
  bugTemplate: "bug_report.md",
  featureTemplate: "feature_request.md",
  privateReportingUrl: "https://github.com/PCNav-Labs/os-map-feedback/security/advisories/new",
};

export const WORKSPACE_NAVIGATOR_FEEDBACK: FeedbackApp = {
  name: "Workspace Navigator",
  repoUrl: "https://github.com/PCNav-Labs/workspace-navigator-feedback",
  bugTemplate: "bug_report.md",
  featureTemplate: "feature_request.md",
  privateReportingUrl:
    "https://github.com/PCNav-Labs/workspace-navigator-feedback/security/advisories/new",
};

const EXTERNAL = { target: "_blank", rel: "noreferrer noopener" } as const;

export function AppFeedbackPage({ app }: { app: FeedbackApp }) {
  const newIssue = (template: string) =>
    `${app.repoUrl}/issues/new?template=${encodeURIComponent(template)}`;

  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Feedback</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {app.name} feedback
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Observations help improve {app.name}. Feedback is collected as issues in the {app.name}{" "}
            feedback repository on GitHub.
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
                <h2 className="text-xl font-semibold">Report a bug</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Found something unexpected in {app.name}? Open a bug report on GitHub.
              </p>
              <Button asChild className="mt-6 h-auto min-h-9 whitespace-normal" variant="outline">
                <a href={newIssue(app.bugTemplate)} {...EXTERNAL}>
                  <Github /> Report a bug on GitHub
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
                <h2 className="text-xl font-semibold">Suggest a feature</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Have an idea for {app.name}? Open a feature request on GitHub and tell us what you'd
                find useful.
              </p>
              <Button asChild className="mt-6 h-auto min-h-9 whitespace-normal" variant="outline">
                <a href={newIssue(app.featureTemplate)} {...EXTERNAL}>
                  <Github /> Suggest a feature on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-surface/40 shadow-none">
            <CardContent className="p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Before you post</h2>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                GitHub Issues are public. Don't include passwords or other credentials, licence
                keys, private documents, or diagnostic details that could identify you or your
                computer.
              </p>
              {app.privateReportingUrl ? (
                <>
                  <p className="mt-3 text-sm text-muted-foreground">
                    If you think you've found a security vulnerability, don't open a public issue.
                    Report it privately through GitHub instead.
                  </p>
                  <Button
                    asChild
                    className="mt-6 h-auto min-h-9 whitespace-normal"
                    variant="outline"
                  >
                    <a href={app.privateReportingUrl} {...EXTERNAL}>
                      <ShieldAlert /> Report a vulnerability privately
                    </a>
                  </Button>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  If you think you've found a security vulnerability, please don't describe it in a
                  public issue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a
            href={`${app.repoUrl}/issues`}
            {...EXTERNAL}
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Browse existing {app.name} issues
          </a>
          <Link
            to="/feedback"
            className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Feedback for another application
          </Link>
        </div>
      </section>
    </>
  );
}
