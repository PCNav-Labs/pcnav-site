import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  ArrowLeft,
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

// PUBLIC BETA. Owner-approved beta disclosures (RR-19, 2026-10-28; the E45s4 content accepted at
// 058f733d on 2026-10-31), activated for the GitHub release v0.5.0-beta.1 in
// PCNav-Labs/workspace-navigator-releases. The download and source links point to that release's
// assets. Deploy this only after the release exists and its assets have been downloaded back and
// verified against the values below.
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
          "Workspace Navigator 0.5.0 Beta for Windows: compatibility, the unsigned installer, beta expiry, known limitations, privacy, source code and feedback.",
      },
      { property: "og:title", content: "Workspace Navigator 0.5.0 Beta" },
      {
        property: "og:description",
        content:
          "Download the Workspace Navigator 0.5.0 Beta for Windows, and what to know before you install it.",
      },
    ],
  }),
  component: BetaReleasePage,
});

const RELEASE = {
  title: "Workspace Navigator v0.5.0 Public Beta",
  url: "https://github.com/PCNav-Labs/workspace-navigator-releases/releases/tag/v0.5.0-beta.1",
  download:
    "https://github.com/PCNav-Labs/workspace-navigator-releases/releases/download/v0.5.0-beta.1",
};

// GitHub serves a release asset under its asset name, in which the spaces of the built installer's
// file name become periods; the bytes, size and SHA-256 are unchanged.
const INSTALLER = {
  version: "0.5.0 Beta",
  filename: "Workspace.Navigator.Setup.0.5.0.exe",
  size: "117 MB (122,925,830 bytes)",
  sha256: "3092a8c8b008f1ca3555127716f77c1e845c7275403e0dbb095b98d6cebe1be3",
  expires: "29 January 2027, 04:06 UTC",
  url: `${RELEASE.download}/Workspace.Navigator.Setup.0.5.0.exe`,
};

const SOURCE = {
  filename: "workspace-navigator-v0.5.0-beta.1-corresponding-source.zip",
  size: "20 MB (20,576,747 bytes)",
  sha256: "be9a0f5fd6b85b6d2639a7051f7447da049668d11a18e317d2a387b66165e701",
  url: `${RELEASE.download}/workspace-navigator-v0.5.0-beta.1-corresponding-source.zip`,
};

const HASH_COMMAND = `Get-FileHash "$env:USERPROFILE\\Downloads\\${INSTALLER.filename}"`;

const EXTERNAL = { target: "_blank", rel: "noreferrer noopener" } as const;

function BetaReleasePage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Link
            to="/workspace-navigator"
            className="inline-flex min-h-6 items-center gap-1 py-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Workspace Navigator overview
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
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
                  asChild
                  size="lg"
                  className="h-auto min-h-10 w-full whitespace-normal sm:w-auto"
                >
                  <a href={INSTALLER.url}>
                    <Download /> Download for Windows
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                The installer and its source code are published together on GitHub, in the release{" "}
                <a
                  href={RELEASE.url}
                  {...EXTERNAL}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {RELEASE.title}
                </a>
                .
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
        <SectionHeading
          eyebrow="Beta expiry"
          title="This beta expires on the evening of 28 January 2027 (North America)."
        />
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Each beta stops working 90 days after it was built. This one expires on 29 January 2027
            at 04:06 UTC, which is 11:06 p.m. Eastern and 8:06 p.m. Pacific on 28 January. From 30
            December 2026 at 04:06 UTC (the evening of 29 December in North America), Workspace
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
          <InfoCard title="Replace All in Word documents">
            In a Word document, Replace All changes at most 22 matches at a time. If there are more,
            it changes nothing and asks you to replace them in smaller steps. Undoing a Replace All
            can take one or more Undo steps for each replacement, and if you close the document
            before you've undone them all, the replacements you haven't undone stay in the file.
          </InfoCard>
          <InfoCard title="Some Word documents open read-only">
            Word documents that contain tracked changes, or that use settings Workspace Navigator
            can't keep — such as change tracking or document protection — open read-only. Tracked
            changes are shown, not accepted. To edit these documents, use another program.
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
            its installation folder, and are also published with the release, in the source archive
            below.
          </p>
          <p>
            The complete corresponding source code for the LGPL-licensed components in this version
            — FFmpeg, Nsis7z and StdUtils — is published on the GitHub release page alongside the
            installer, as one ZIP archive with a README describing each file:{" "}
            <a href={SOURCE.url} className="text-primary underline-offset-4 hover:underline">
              {SOURCE.filename}
            </a>{" "}
            ({SOURCE.size}; SHA-256 <span className="break-all font-mono">{SOURCE.sha256}</span>).
            The source will remain available for at least three years after this version is last
            offered for download.
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
