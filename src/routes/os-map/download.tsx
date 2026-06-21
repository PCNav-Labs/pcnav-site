import { createFileRoute } from "@tanstack/react-router";
import { Download, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

export const Route = createFileRoute("/os-map/download")({
  head: () => ({
    meta: [
      { title: "OS Map Release Details | PCNav" },
      {
        name: "description",
        content:
          "Release details for OS Map on Windows — version, build, and SHA-256 verification, plus current status. The public download is being finalized.",
      },
      { property: "og:title", content: "OS Map Release Details" },
      {
        property: "og:description",
        content:
          "Version, build, and SHA-256 verification details for the OS Map beta on Windows. The public download isn't open yet — view release status and notes.",
      },
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
                <Field label="Release date" value="2026-06-13" />
                <Field label="File size" value="58.4 MB (61,208,584 bytes)" />
                <Field label="Platform" value="Windows x64 · self-contained .NET 9" />
                <Field label="Filename" value="OS-Map-Beta-v0.1.0.zip" mono />
                <Field label="Build commit" value="fec624c" mono />
                <Field label="SHA-256" value="c7d2b90a70acff2ee7e70f004d9a50e8e9dd471f2e3d088a5554f27dcdf7e02c" mono />
              </dl>
              <p className="mt-6 text-xs text-muted-foreground">
                OS Map 0.1.0 is the first beta delivery candidate. Download hosting is being
                finalized — the file is not yet publicly available. The details above are the
                verified release values; use the SHA-256 to confirm your download once it goes live.
              </p>
            </CardContent>
          </Card>

          {/* Download options */}
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Download options</h2>
              <div className="mt-6 flex flex-col gap-3">
                <Button size="lg" disabled>
                  <Download /> Download — not yet public
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                The download button is disabled while hosting for the OS Map 0.1.0 beta is being
                finalized. It will be enabled here once the release is published.
              </p>
            </CardContent>
          </Card>
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
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold">OS Map 0.1.0 — first beta</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Released 2026-06-13 · the first beta delivery candidate of OS Map.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              This release focuses on visibility-first Windows navigation — giving you a clear,
              honest view of what your system is doing rather than changing it. It ships as a
              self-contained Windows x64 package built on .NET 9, so there is no separate runtime
              to install, and includes onboarding and tester materials to help you get started and
              report what you find.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span aria-hidden className="text-primary">•</span>
                Visibility-first navigation across core Windows system and network surfaces.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-primary">•</span>
                Self-contained Windows x64 build (.NET 9) — no separate runtime install required.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-primary">•</span>
                Bundled onboarding and tester materials for getting started and submitting feedback.
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-primary">•</span>
                No telemetry, analytics, background update checks, or monitoring.
              </li>
            </ul>
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <p>
                OS Map may request administrator (UAC) elevation to read certain system information.
              </p>
              <p>
                Because code signing is not yet finalized, Windows SmartScreen may display a warning
                the first time you run this beta.
              </p>
            </div>
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
