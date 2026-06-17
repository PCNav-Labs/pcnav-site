import { createFileRoute } from "@tanstack/react-router";
import { Download, Github, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

const GITHUB_URL = "https://github.com/pcnav";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download OS Map | PCNav" },
      {
        name: "description",
        content: "Download OS Map for Windows. Release info, SHA-256 hash, and GitHub source link.",
      },
      { property: "og:title", content: "Download OS Map" },
      { property: "og:description", content: "Get the latest release of OS Map for Windows." },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Download</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Get OS Map for Windows.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The latest release is listed below, along with file details so you can verify your download.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Release card */}
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Current release</h2>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Version" value="0.1.0" />
                <Field label="Release date" value="TBA" />
                <Field label="File size" value="—" />
                <Field label="SHA-256" value="—" mono />
              </dl>
              <p className="mt-6 text-xs text-muted-foreground">
                Placeholder values. Real release details will appear here once published.
              </p>
            </CardContent>
          </Card>

          {/* Download options */}
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Download options</h2>
              <div className="mt-6 flex flex-col gap-3">
                <Button size="lg" disabled>
                  <Download /> Download OS Map
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer noopener">
                    <Github /> View on GitHub
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Prefer to review the project, follow development, or provide feedback? Visit the GitHub repository.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 max-w-2xl">
          <h3 className="font-display text-lg font-semibold">Prefer to explore first?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Technical users can review the project, follow development, submit feedback, and access project resources on GitHub.
          </p>
        </div>
      </section>



      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Before you launch" title="A couple of things to expect." />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <NoticeCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="SmartScreen"
            body="Windows may display a SmartScreen warning for newly distributed software."
          />
          <NoticeCard
            icon={<KeyRound className="h-5 w-5" />}
            title="UAC"
            body="OS Map requests administrator privileges to access certain system information."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Changelog" title="Release notes" />
        <Card className="mt-6 border-border/70 shadow-none">
          <CardContent className="p-8 text-sm text-muted-foreground">
            Release notes will appear here once the first version is published.
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm ${mono ? "font-mono break-all" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

function NoticeCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex gap-4 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
      </CardContent>
    </Card>
  );
}
