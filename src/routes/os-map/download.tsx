import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, KeyRound, PackageOpen, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";

// OS Map 0.1.0 Beta (Owner decision D3, 2026-11-08): built 13 June 2026 at fec624c and publicly
// released as a beta on 21 June 2026. The download destination, file name, size and SHA-256 are
// unchanged and must stay so without separate authority. The package's provenance and its missing
// licence and third-party notices are unresolved and are not addressed or asserted here.
//
// Security wording is limited to verified facts: the build is not code-signed (its bundled
// TESTER_ONBOARDING.md; WinOS signing record), and it needs administrator rights (release
// validation ran elevated). Smart App Control behaviour is not verified and is not described.
const PACKAGE = {
  filename: "OS-Map-Beta-v0.1.0.zip",
  size: "58.4 MB (61,208,584 bytes)",
  sha256: "c7d2b90a70acff2ee7e70f004d9a50e8e9dd471f2e3d088a5554f27dcdf7e02c",
  url: "https://github.com/PCNav-Labs/os-map-releases/releases/download/v0.1.0/OS-Map-Beta-v0.1.0.zip",
};

const HASH_COMMAND = `Get-FileHash "$env:USERPROFILE\\Downloads\\${PACKAGE.filename}"`;

export const Route = createFileRoute("/os-map/download")({
  head: () => ({
    meta: [
      { title: "OS Map 0.1.0 Beta | PCNav" },
      {
        name: "description",
        content:
          "Download OS Map 0.1.0 Beta for Windows, with version, build, file size and SHA-256 verification details, what to expect on first launch, and release notes.",
      },
      { property: "og:title", content: "OS Map 0.1.0 Beta" },
      {
        property: "og:description",
        content:
          "Download OS Map 0.1.0 Beta for Windows, with version, build, file size and SHA-256 verification details plus release notes.",
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
          <Link
            to="/os-map"
            className="inline-flex min-h-6 items-center gap-1 py-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> OS Map overview
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Beta release
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            OS Map 0.1.0 Beta
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            OS Map 0.1.0 Beta for Windows has been publicly available since 21 June 2026. The file
            details below let you verify your download.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Release details</h2>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Version" value="0.1.0 Beta" />
                <Field label="Platform" value="Windows x64 · self-contained .NET 9" />
                <Field label="Built" value="13 June 2026" />
                <Field label="Public beta release" value="21 June 2026" />
                <Field label="Filename" value={PACKAGE.filename} mono />
                <Field label="File size" value={PACKAGE.size} />
                <Field label="Build commit" value="fec624c" mono />
                <Field label="Code signing" value="Not signed" />
                <div className="sm:col-span-2">
                  <Field label="SHA-256" value={PACKAGE.sha256} mono />
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Getting started</h2>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild size="lg">
                  <a href={PACKAGE.url}>
                    <Download aria-hidden="true" /> Download OS Map
                  </a>
                </Button>
              </div>
              <ol className="mt-6 space-y-4">
                <Step n={1}>Download the ZIP file.</Step>
                <Step n={2}>
                  Check the file before you open it (see{" "}
                  <a
                    href="#check-your-download"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Check your download
                  </a>
                  ).
                </Step>
                <Step n={3}>
                  Right-click it and choose{" "}
                  <span className="font-medium text-foreground">Extract All</span>.
                </Step>
                <Step n={4}>
                  Open the extracted folder, then the <span className="font-mono">App</span> folder.
                </Step>
                <Step n={5}>
                  Run <span className="font-mono">WinOS.App.exe</span>.
                </Step>
              </ol>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                <p>OS Map is portable and does not require installation.</p>
                <p>To remove OS Map, simply delete the extracted folder.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="before-you-launch" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Before you launch" title="What to expect." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <NoticeCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Not code-signed"
            body={
              <>
                OS Map 0.1.0 isn't code-signed, so Windows may show an "Unknown publisher" notice or
                a SmartScreen warning. Only run it if you downloaded it from this page's link and
                its SHA-256 checksum matches the value above.
              </>
            }
          />
          <NoticeCard
            icon={<KeyRound className="h-5 w-5" />}
            title="Administrator rights"
            body="OS Map needs administrator rights to read certain system information, so Windows asks for permission when it starts."
          />
          <NoticeCard
            icon={<PackageOpen className="h-5 w-5" />}
            title="The name WinOS inside the package"
            body="WinOS is OS Map's internal build name. In this release, the folder, the program file, the app's own window and its bundled guides use the name WinOS. The bundled getting-started guide was written for OS Map's first testers."
          />
        </div>

        <Card id="check-your-download" className="mt-8 scroll-mt-24 border-border/70 shadow-none">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold">Check your download</h3>
            <ol className="mt-6 space-y-4">
              <Step n={1}>After the download finishes, open Windows PowerShell.</Step>
              <Step n={2}>
                Run this command, changing the path if you saved the file somewhere else:
                <code className="mt-2 block overflow-x-auto rounded-md border border-border/70 bg-surface/60 px-3 py-2 font-mono text-xs text-foreground">
                  {HASH_COMMAND}
                </code>
              </Step>
              <Step n={3}>
                Compare the Hash value it shows with the SHA-256 above (upper or lower case doesn't
                matter). If they don't match, delete the file and don't open it.
              </Step>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Changelog" title="Release notes" />
        <Card className="mt-6 border-border/70 shadow-none">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold">OS Map 0.1.0 Beta — the first beta</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Built 13 June 2026 · publicly released as a beta on 21 June 2026.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              This release focuses on visibility-first Windows navigation — giving you a clear,
              honest view of what your system is doing rather than changing it. It ships as a
              self-contained Windows x64 package built on .NET 9, so there is no separate runtime to
              install, and includes onboarding and tester materials to help you get started and
              report what you find.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <Bullet>
                Visibility-first navigation across core Windows system and network surfaces.
              </Bullet>
              <Bullet>
                Self-contained Windows x64 build (.NET 9) — no separate runtime install required.
              </Bullet>
              <Bullet>
                Bundled onboarding and tester materials for getting started and submitting feedback.
              </Bullet>
              <Bullet>No telemetry, analytics, background update checks, or monitoring.</Bullet>
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className={`mt-1 text-sm ${mono ? "font-mono break-all" : "font-medium"}`}>{value}</dd>
    </div>
  );
}

function NoticeCard({ icon, title, body }: { icon: ReactNode; title: string; body: ReactNode }) {
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

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
        {n}
      </span>
      <div className="min-w-0 pt-0.5 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </li>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className="text-primary">
        •
      </span>
      {children}
    </li>
  );
}
