import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  ArrowRight,
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  FolderTree,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { PrincipleCard } from "@/components/principle-card";
import { PrivacyList } from "@/components/privacy-list";
import { CtaBand } from "@/components/cta-band";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PCNav — Navigate Technology With Confidence" },
      {
        name: "description",
        content:
          "PCNav develops practical tools designed to help people understand, navigate, and manage technology with clarity.",
      },
      { property: "og:title", content: "PCNav — Navigate Technology With Confidence" },
      {
        property: "og:description",
        content: "A technology navigation ecosystem focused on visibility, clarity, and confidence.",
      },
    ],
  }),
  component: HomePage,
});

const PRINCIPLES = [
  { title: "Visibility First", description: "See what is happening on your system before anything else." },
  { title: "Understanding Second", description: "Make information clear so you know what it means." },
  { title: "Action Third", description: "Take action only after seeing and understanding." },
  { title: "Automation Last", description: "Automate only what is well understood and intentional." },
];

// Descriptions come from each application's own information page; no new claims are made here.
const APPS = [
  {
    to: "/os-map",
    name: "OS Map",
    status: "Application · 0.1.0 in trusted testing",
    tagline: "Understand Your Windows PC.",
    description:
      "OS Map helps users understand their system, network, privacy settings, and web configuration without digging through dozens of Windows tools.",
    note: "",
    icons: [Cpu, Network, ShieldCheck, Globe],
  },
  {
    to: "/workspace-navigator",
    name: "Workspace Navigator",
    status: "Application · Beta in preparation",
    tagline: "",
    description:
      "A Windows desktop application that keeps a project's files, notes, tags, tasks and saved web destinations together in one place.",
    note: "Version 0.5.0 beta is being prepared. It isn't available to download yet.",
    icons: [FolderTree, FileText, StickyNote, Globe],
  },
] as const;

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-accent)_0%,transparent_70%)] opacity-60" />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              PCNav · Makers of OS Map and Workspace Navigator
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              Navigate Technology With Confidence.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Practical tools designed to help people understand, navigate, and manage technology with greater
              clarity.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/os-map/download">
                  <FileText /> View OS Map Release Details
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#what-is-pcnav">Learn More</a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              OS Map 0.1.0 is currently in trusted testing. View release details, verification
              information, and project status. A Workspace Navigator 0.5.0 beta is being prepared
              and isn't available to download yet.
            </p>
          </div>
        </div>
      </section>

      {/* What is PCNav */}
      <section id="what-is-pcnav" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="What is PCNav?"
          title="Technology should be easier to understand."
          description="PCNav develops practical tools focused on visibility, clarity, and confidence rather than complexity."
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          PCNav builds practical tools that help you see and understand what your computer is doing.
          Windows already holds the information that matters — it's just spread across many separate
          screens and settings. PCNav brings that information together and presents it plainly, so you
          can make decisions with a clearer picture of what's happening.
        </p>
      </section>

      {/* Applications */}
      <section id="applications" className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Applications"
          title="Two separate applications."
          description="OS Map and Workspace Navigator are independent Windows applications, each with its own information page, release page and feedback channel."
        />
        <div className="mt-10 grid gap-6">
          {APPS.map((app) => (
            <Card key={app.name} className="overflow-hidden border-border/70 shadow-none">
              <CardContent className="grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {app.status}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {app.name}
                  </h3>
                  {app.tagline && (
                    <p className="mt-2 text-lg font-medium text-foreground/90">{app.tagline}</p>
                  )}
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {app.description}
                  </p>
                  {app.note && <p className="mt-3 text-sm text-muted-foreground">{app.note}</p>}
                  <Button asChild className="mt-6" variant="default">
                    <Link to={app.to}>
                      Explore {app.name} <ArrowRight />
                    </Link>
                  </Button>
                </div>
                <div className="hidden items-center justify-center md:flex">
                  <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                    {app.icons.map((Icon, i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-xl border border-border/70 bg-surface/60"
                      >
                        <Icon className="h-7 w-7 text-primary/80" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core philosophy */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Core philosophy"
          title="Four principles, in order."
          description="A simple sequence shapes everything PCNav builds."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <PrincipleCard key={p.title} index={i + 1} title={p.title} description={p.description} />
          ))}
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="bg-surface/40 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Trust & privacy"
            title="Quiet by design."
            description="How OS Map behaves on your computer."
          />
          <div className="mt-8">
            <PrivacyList />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Any future changes to these behaviours will be clearly disclosed.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            How Workspace Navigator handles your information is described on{" "}
            <Link
              to="/workspace-navigator"
              className="text-primary underline-offset-4 hover:underline"
            >
              its own page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Ecosystem"
          title="Part of a growing ecosystem."
          description="OS Map and Workspace Navigator are the first two applications in the PCNav ecosystem. Each is developed and released separately."
        />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          More tools are planned over time, each focused on making a specific part of technology
          easier to understand.
        </p>
      </section>

      <CtaBand description="See the current beta release information." />
    </>
  );
}
