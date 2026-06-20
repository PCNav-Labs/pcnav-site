import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  Wrench,
  LifeBuoy,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { SurfaceTile } from "@/components/surface-tile";
import { PrincipleCard } from "@/components/principle-card";

export const Route = createFileRoute("/os-map")({
  head: () => ({
    meta: [
      { title: "OS Map — Understand Your Windows PC | PCNav" },
      {
        name: "description",
        content:
          "A visibility-first Windows application that brings system, network, privacy, and web configuration information together in one clear interface.",
      },
      { property: "og:title", content: "OS Map — Understand Your Windows PC" },
      {
        property: "og:description",
        content: "System, network, privacy, and web configuration visibility in a single clear interface.",
      },
    ],
  }),
  component: OsMapPage,
});

const FEATURES = [
  {
    icon: Cpu,
    title: "System Information",
    items: ["See your hardware, storage, and OS at a glance", "See key details about your system"],
  },
  {
    icon: Network,
    title: "Network",
    items: ["See which adapters and connections are active", "View DNS, firewall, and port configuration"],
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    items: ["See how Windows privacy settings are configured", "Understand what each setting controls"],
  },
  {
    icon: Globe,
    title: "Web Configuration",
    items: ["See your DNS, hosts, proxy, and encrypted DNS", "Understand how web traffic is routed"],
  },
  {
    icon: Wrench,
    title: "Utilities",
    items: ["Reach common Windows settings quickly", "Practical shortcuts kept close at hand"],
  },
  {
    icon: LifeBuoy,
    title: "Help",
    items: ["Plain-language explanations of what you see", "Guidance and references when you need them"],
  },
];

const PRINCIPLES = [
  { title: "Visibility First", description: "See what's there." },
  { title: "Understanding Second", description: "Know what it means." },
  { title: "Action Third", description: "Decide what to do." },
  { title: "Automation Last", description: "Only when well understood." },
];

function OsMapPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Product</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">OS Map</h1>
          <p className="mt-3 text-xl font-medium text-foreground/90">Understand Your Windows PC.</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A visibility-first Windows application designed to help users understand system, network, privacy,
            and web configuration information in one place.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/download">
                <FileText /> View Release Details
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            OS Map 0.1.0 is currently in trusted testing. View release details, verification
            information, and project status.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why OS Map exists"
          title="Everything you need to see, in one place."
        />
        <div className="mt-6 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2">
          <p>
            Windows holds a great deal of useful information about your system, network, privacy
            settings, and web configuration — but it's spread across dozens of separate dialogs,
            panels, and command-line tools. Finding any single detail often means knowing exactly
            where to look.
          </p>
          <p>
            OS Map gathers that information into one clear interface, organised so you can find what
            you need and understand what it means. It's built to show you your system, not to change
            it — you stay in control of any action you take.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <SectionHeading eyebrow="Feature areas" title="Six areas of visibility." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} items={f.items} />
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Philosophy"
            title="Designed to help you understand."
            description="OS Map is not an optimizer, cleaner, or performance booster."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <PrincipleCard key={p.title} index={i + 1} title={p.title} description={p.description} />
            ))}
          </div>
        </div>
      </section>

      {/* A look inside */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="A look inside"
          title="One interface, built for clarity."
          description="OS Map brings system, network, privacy, and web configuration into a single, consistent layout — so everything reads the same way, wherever you look."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <SurfaceTile
            icon={Cpu}
            label="System Information"
            caption="Your system at a glance"
            src="/screenshots/system-information.png"
            alt="OS Map System Information screen showing a read-only snapshot of the PC's operating system edition, version, install date, and system type."
          />
          <SurfaceTile
            icon={Network}
            label="Network"
            caption="Adapters, DNS, firewall, and ports"
            src="/screenshots/network.png"
            alt="OS Map Network screen with cards for adapters, connections, DNS, firewall, interfaces, and ports."
          />
          <SurfaceTile
            icon={ShieldCheck}
            label="Privacy"
            caption="How privacy settings are configured"
            src="/screenshots/privacy.png"
            alt="OS Map Privacy screen showing the Windows telemetry setting currently reduced, with an output log area."
          />
          <SurfaceTile
            icon={Globe}
            label="Web Configuration"
            caption="DNS, hosts, proxy, encrypted DNS"
            src="/screenshots/web-configuration.png"
            alt="OS Map Web Configuration screen showing DNS details, hosts file status, proxy settings, and encrypted DNS."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">OS Map release details</h2>
          <p className="mt-3 text-base text-muted-foreground">See the current beta release information.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/download">
              <FileText /> View Release Details
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
