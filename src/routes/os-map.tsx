import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  Network,
  ShieldCheck,
  Globe,
  Wrench,
  LifeBuoy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { PlaceholderShot } from "@/components/placeholder-shot";
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
  { icon: Cpu, title: "System Information", items: ["Hardware", "Storage", "Operating system information"] },
  { icon: Network, title: "Network", items: ["Adapters", "Connections", "DNS", "Firewall", "Ports"] },
  { icon: ShieldCheck, title: "Privacy", items: ["Windows privacy visibility", "Configuration awareness"] },
  { icon: Globe, title: "Web Configuration", items: ["DNS", "Hosts", "Proxy", "Encrypted DNS"] },
  { icon: Wrench, title: "Utilities", items: ["Practical Windows shortcuts", "Useful tools"] },
  { icon: LifeBuoy, title: "Help", items: ["Guidance", "Explanations", "References"] },
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
                <Download /> Download OS Map
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why OS Map exists"
          title="Everything you need to see, in one place."
        />
        <div className="mt-6 grid gap-6 text-base leading-relaxed text-muted-foreground md:grid-cols-2">
          <p>Windows contains valuable information, but it is often scattered across many tools.</p>
          <p>
            OS Map brings important visibility together into a single interface designed for clarity.
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

      {/* Screenshots */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="A look inside"
          title="Screenshots"
          description="A look at OS Map's main views."
        />
        <div className="mt-10 grid gap-6 md:gap-8 sm:grid-cols-2">
          <PlaceholderShot
            label="System Information"
            src={systemInformationShot.url}
            alt="OS Map — System Information view showing operating system, device, and hardware details."
          />
          <PlaceholderShot
            label="Network"
            src={networkShot.url}
            alt="OS Map — Network view showing adapters, connections, DNS, firewall, interfaces, and ports."
          />
          <PlaceholderShot
            label="Privacy"
            src={privacyShot.url}
            alt="OS Map — Privacy view showing Windows telemetry setting and output panel."
          />
          <PlaceholderShot
            label="Web Configuration"
            src={webConfigurationShot.url}
            alt="OS Map — Web Configuration view showing DNS details, hosts file, proxy settings, and encrypted DNS."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-accent/60 to-surface px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Download OS Map</h2>
          <p className="mt-3 text-base text-muted-foreground">Get started on Windows.</p>
          <Button asChild size="lg" className="mt-6">
            <Link to="/download">
              <Download /> Download OS Map
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
