import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// PRE-RELEASE INFORMATION ONLY. This page offers no installer, checksum or release manifest.
// A download may be added only after the release is accepted and its publication authorized.
export const Route = createFileRoute("/workspace-navigator/download")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator Release Status | PCNav" },
      {
        name: "description",
        content:
          "Release status for Workspace Navigator for Windows. The 0.5.0 beta is being prepared and isn't available to download yet.",
      },
      { property: "og:title", content: "Workspace Navigator Release Status" },
      {
        property: "og:description",
        content:
          "The Workspace Navigator 0.5.0 beta is being prepared and isn't available to download yet.",
      },
    ],
  }),
  component: ReleaseStatusPage,
});

function ReleaseStatusPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Release</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator for Windows.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The first public beta is being prepared. There is no installer to download yet.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Release status</h2>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Version" value="0.5.0 beta" />
                <Field label="Status" value="In preparation — not yet released" />
                <Field label="Platform" value="Windows desktop" />
                <Field label="Download" value="Not available yet" />
              </dl>
              <p className="mt-6 text-xs text-muted-foreground">
                When the beta is released, this page will list its file details and how to verify
                your download.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-surface/40 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">In the meantime</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Read what Workspace Navigator does, or share an observation or idea in its feedback
                repository.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild variant="outline">
                  <Link to="/workspace-navigator">
                    About Workspace Navigator <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/feedback/workspace-navigator">
                    <MessageSquarePlus /> Share Feedback
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
