import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Download,
  ShieldAlert,
  ShieldOff,
  TriangleAlert,
  MessageSquarePlus,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { WORKSPACE_NAVIGATOR_FEEDBACK } from "@/components/app-feedback";

// PRE-RELEASE. Owner-approved beta disclosures (RR-19, 2026-10-28), prepared before distribution is
// authorized. The page offers no installer or release link: the download button stays disabled and
// the source-code section names no URL. Activating the download is a separate, reviewed change made
// only after the Owner authorizes distribution and the GitHub release exists.
//
// Every product statement below describes the accepted 0.5.0 Beta build and its in-app Help, not
// later development builds.
export const Route = createFileRoute("/workspace-navigator/download")({
  head: () => ({
    meta: [
      { title: "Workspace Navigator 0.5.0 Beta | PCNav" },
      {
        name: "description",
        content:
          "Workspace Navigator 0.5.0 Beta for Windows: compatibility, the unsigned installer, beta expiry, known limitations, privacy, source code and feedback. Not yet available to download.",
      },
      { property: "og:title", content: "Workspace Navigator 0.5.0 Beta" },
      {
        property: "og:description",
        content:
          "What to know about the Workspace Navigator 0.5.0 Beta for Windows. The beta isn't available to download yet.",
      },
    ],
  }),
  component: BetaReleasePage,
});

const INSTALLER = {
  version: "0.5.0 Beta",
  filename: "Workspace Navigator Setup 0.5.0.exe",
  size: "117 MB (122,789,897 bytes)",
  sha256: "5ca39bd15dd224edec2501ede498f8b7ab095023e2e07710d42eb5a94b0a75e2",
  expires: "23 January 2027, 16:24 UTC",
};

const HASH_COMMAND = `Get-FileHash "$env:USERPROFILE\\Downloads\\${INSTALLER.filename}"`;

const EXTERNAL = { target: "_blank", rel: "noreferrer noopener" } as const;

function BetaReleasePage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Beta release
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Workspace Navigator 0.5.0 Beta
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The first public beta of Workspace Navigator for Windows: a free, early version for
            testing and feedback. It isn't a finished product, and you may find problems. Keep your
            own backups of anything important — Workspace Navigator doesn't make automatic backups.
          </p>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            This beta is intended for users in Canada and the United States.
          </p>
          <p className="mt-6 max-w-2xl text-sm font-medium text-foreground">
            The beta isn't available to download yet. This page describes it ahead of its release.
          </p>
        </div>
      </section>

      <section id="download" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Release details</h2>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Version" value={INSTALLER.version} />
                <Field label="Platform" value="Windows 10 and Windows 11 · x64" />
                <Field label="Filename" value={INSTALLER.filename} mono wrap="words" />
                <Field label="File size" value={INSTALLER.size} />
                <Field label="Beta expires" value={INSTALLER.expires} />
                <Field label="Code signing" value="Not signed" />
                <div className="sm:col-span-2">
                  <Field label="SHA-256" value={INSTALLER.sha256} mono />
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold">Download</h2>
              <div className="mt-6">
                <Button
                  size="lg"
                  disabled
                  className="h-auto min-h-10 w-full whitespace-normal sm:w-auto"
                >
                  <Download /> Download not yet available
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                When the beta is released, the installer and its source code will be published
                together on GitHub, and this page will link to them.
              </p>
              <ol className="mt-6 space-y-4">
                <Step n={1}>Download the installer.</Step>
                <Step n={2}>
                  Check the file before you run it (see{" "}
                  <a
                    href="#check-your-download"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Check your download
                  </a>
                  ).
                </Step>
                <Step n={3}>
                  Run the installer and follow its steps. You can install Workspace Navigator for
                  your own Windows account without administrator rights.
                </Step>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="system-requirements" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Compatibility" title="System requirements." />
        <ul className="mt-6 max-w-3xl space-y-3 text-sm text-muted-foreground">
          <Bullet>
            Designed for Windows 10 and Windows 11 on 64-bit (x64) PCs with Intel or AMD processors.
          </Bullet>
          <Bullet>
            Tested for this beta on Windows 10 Pro version 22H2 and on Windows 11. Testing doesn't
            cover every PC, edition or configuration.
          </Bullet>
          <Bullet>This beta isn't intended for Windows on Arm PCs.</Bullet>
        </ul>
      </section>

      <section id="before-you-install" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Before you install" title="The installer isn't signed." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <NoticeCard
            icon={<TriangleAlert className="h-5 w-5" />}
            title="Unsigned installer"
            body="This beta's installer isn't yet signed with a code-signing certificate, so Windows treats it as coming from an unknown publisher."
          />
          <NoticeCard
            icon={<ShieldOff className="h-5 w-5" />}
            title="Smart App Control"
            body="If Smart App Control is turned on (a Windows 11 security feature), Windows blocks this installer and it can't be installed on that PC. We don't ask you to turn off Smart App Control, or any other Windows security protection, to try this beta."
          />
          <NoticeCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="SmartScreen and browser warnings"
            body="Microsoft Defender SmartScreen or your browser may warn that the file is uncommon or unrecognized. Only continue if you downloaded the installer from this page's link and its SHA-256 checksum matches."
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
                matter). If they don't match, delete the file and don't run it.
              </Step>
            </ol>
          </CardContent>
        </Card>
      </section>

      <section id="expiry" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Beta expiry" title="This beta expires on 23 January 2027." />
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Each beta stops working 90 days after it was built. This one expires on 23 January 2027
            at 16:24 UTC (11:24 a.m. Eastern, 8:24 a.m. Pacific). From 24 December 2026, Workspace
            Navigator reminds you of the date once each time you start it.
          </p>
          <p>
            After it expires, Workspace Navigator no longer opens normally. It shows a message with
            options to open your Workspace folder or to visit pcnav.net, and there is no read-only
            mode. If it's open when it expires, it asks you to save or discard any unsaved changes,
            then closes — so save your work regularly as the date approaches.
          </p>
          <p className="rounded-lg border border-border/70 bg-card px-4 py-3 text-foreground">
            <span className="font-semibold">Your files don't expire.</span> They stay in your
            Workspace folder, and you can keep using them with other programs. Expiry doesn't delete
            or change your files or projects.
          </p>
          <p>
            The expiry date is checked on your computer, without an internet connection, and can't
            be extended. Check this page to see whether a later version is available.
          </p>
        </div>
      </section>

      <section id="known-limitations" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHeading eyebrow="Known limitations" title="Things to expect in this beta." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard title="Your last session may not reopen">
            When Workspace Navigator starts — especially the first time after it's installed over an
            existing installation — it may not reopen the project you last had open. Panes may
            appear at their default widths, and your last-opened document may not appear. Selecting
            the project again can bring back its saved layout and last-opened document. This doesn't
            affect your files.
          </InfoCard>
          <InfoCard title="No automatic updates">
            Workspace Navigator doesn't update itself or check for updates. To get a later version,
            come back to this page.
          </InfoCard>
          <InfoCard title="Uninstalling">
            Uninstalling removes the app but leaves your Workspace folder and Workspace Navigator's
            settings on your computer. On some PCs, a Start menu shortcut may remain afterwards; you
            can delete it.
          </InfoCard>
        </div>
      </section>

      <section id="your-information" className="bg-surface/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Your information"
            title="How this beta handles your information."
          />
          <ul className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
            <Bullet>
              Your projects stay on your computer. Each project keeps Workspace Navigator's records
              in a reserved <span className="font-mono">.workspace</span> folder inside the project.
            </Bullet>
            <Bullet>
              There are no accounts, no telemetry or usage analytics, and no built-in sharing:
              Workspace Navigator doesn't send your projects, documents or notes to other people or
              other computers.
            </Bullet>
            <Bullet>
              Web Browsing opens the websites you save, and those websites receive what a web
              browser normally sends them. Choosing External Browser, a link you confirm, or Get
              Current Version passes the address to your usual web browser.
            </Bullet>
          </ul>
          <p className="mt-6 max-w-3xl text-xs text-muted-foreground">
            This describes how the 0.5.0 Beta behaves. It isn't a complete privacy policy.
          </p>
        </div>
      </section>

      <section id="source-code" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Source code and licences" title="Open-source components." />
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Workspace Navigator includes open-source components. Their licences and notices are
            installed with the app, in <span className="font-mono">THIRD_PARTY_NOTICES.txt</span> in
            its installation folder, and will also be published with the release.
          </p>
          <p>
            The complete corresponding source code for the LGPL-licensed components in this version
            — FFmpeg, Nsis7z and StdUtils — will be published on the GitHub release page alongside
            the installer, with a README describing each file. This page will link to it when the
            beta is released. The source will remain available for at least three years after this
            version is last offered for download.
          </p>
          <p>
            No account or licence agreement is needed to download or use this beta. Nothing on this
            page restricts the rights those open-source licences give you, including the right to
            modify those components and to reverse-engineer for debugging such modifications.
          </p>
        </div>
      </section>

      <section id="feedback-and-support" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <SectionHeading eyebrow="Feedback and support" title="Tell us what you find." />
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>This is a free beta. Support and response times aren't guaranteed.</p>
          <p>
            Report problems and suggest improvements in the Workspace Navigator feedback repository
            on GitHub. Issues there are public, so don't include personal information, passwords or
            private files.
          </p>
          <p>
            To report a security vulnerability, don't open a public issue. Use the repository's
            private vulnerability reporting instead (a GitHub account is required).
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link to="/feedback/workspace-navigator">
              <MessageSquarePlus /> Share Feedback
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a href={`${WORKSPACE_NAVIGATOR_FEEDBACK.repoUrl}/issues`} {...EXTERNAL}>
              <Github /> Browse existing issues
            </a>
          </Button>
          {WORKSPACE_NAVIGATOR_FEEDBACK.privateReportingUrl && (
            <Button asChild variant="outline">
              <a href={WORKSPACE_NAVIGATOR_FEEDBACK.privateReportingUrl} {...EXTERNAL}>
                <ShieldAlert /> Report a vulnerability privately
              </a>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  mono,
  wrap = "anywhere",
}: {
  label: string;
  value: string;
  mono?: boolean;
  // A checksum breaks anywhere; a filename with spaces breaks between its words.
  wrap?: "anywhere" | "words";
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm ${mono ? `font-mono ${wrap === "words" ? "break-words" : "break-all"}` : "font-medium"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function NoticeCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
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

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="h-full border-border/70 shadow-none">
      <CardContent className="p-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
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
      <span>{children}</span>
    </li>
  );
}
