import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Cpu,
  Eye,
  Github,
  Lightbulb,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompassRose } from "@/components/product-visuals";
import { OS_MAP_BETA, PUBLISHER, WN_BETA } from "@/lib/releases";

// Publisher and contact: Owner decision D6 (2026-11-08). The principles and pillars are the site's
// existing wording, consolidated here from the homepage.
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PCNav" },
      {
        name: "description",
        content:
          "PCNav makes Workspace Navigator and OS Map, practical Windows software designed to help people understand and navigate technology. PCNav is a brand of Papaya Services Ltd.",
      },
      { property: "og:title", content: "About PCNav" },
      {
        property: "og:description",
        content: "Tools focused on clarity, visibility, understanding, and confidence.",
      },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  { title: "Visibility First", description: "See what is happening before anything else." },
  {
    title: "Understanding Second",
    description: "Make information clear so you know what it means.",
  },
  { title: "Action Third", description: "Take action only after seeing and understanding." },
  {
    title: "Automation Last",
    description: "Automate only what is well understood and intentional.",
  },
];

const PILLARS: { icon: LucideIcon; label: string; description: string }[] = [
  {
    icon: Lightbulb,
    label: "Clarity",
    description:
      "Information is presented plainly, so you don't need to be an expert to follow it.",
  },
  {
    icon: Eye,
    label: "Visibility",
    description: "You can see what is happening before deciding what, if anything, to change.",
  },
  {
    icon: BookOpen,
    label: "Understanding",
    description: "Each view explains what it shows and why it matters, not just raw values.",
  },
  {
    icon: Compass,
    label: "Confidence",
    description: "Seeing and understanding makes everyday technology decisions less uncertain.",
  },
  {
    icon: ShieldCheck,
    label: "Privacy",
    description:
      "Your information should remain under your control, with clear and honest handling of any data a tool uses.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blueprint text-hero-foreground">
        <CompassRose className="pointer-events-none absolute -right-24 -top-20 h-[28rem] w-[28rem] text-hero-accent/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hero-accent">
            About
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            About PCNav.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-hero-muted">
            PCNav develops practical tools designed to help people better understand and navigate
            technology.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Who we are
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Software that shows you what's going on.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                PCNav is a brand of {PUBLISHER.name}, which owns and publishes Workspace Navigator
                and OS Map under the PCNav name.
              </p>
              <p>
                Everything PCNav builds starts from a simple idea: technology is easier to trust
                when you can clearly understand what it's doing. OS Map applies that idea to your
                Windows PC. Workspace Navigator applies it to your own work, keeping each project's
                pieces together so you can see where things stand.
              </p>
              <p>PCNav is independent and is not affiliated with Microsoft or Windows.</p>
            </div>
          </div>

          <div className="grid content-start gap-4">
            <ProductLink
              to="/workspace-navigator"
              icon={Compass}
              name="Workspace Navigator"
              status={WN_BETA.label}
              text="Your Continuity Compass for projects, documents and ongoing work."
            />
            <ProductLink
              to="/os-map"
              icon={Cpu}
              name="OS Map"
              status={OS_MAP_BETA.label}
              text="Understand your system, network, privacy settings and web configuration."
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            How we build
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Four principles, in order.
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                className="rounded-xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <span
                  className="font-display text-3xl font-semibold text-primary"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </li>
            ))}
          </ol>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PILLARS.map(({ icon: Icon, label, description }) => (
              <li key={label} className="rounded-xl border border-border/70 bg-card/70 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-semibold">{label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Contact and support
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Get in touch.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">General enquiries</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Write to{" "}
              <a
                href={`mailto:${PUBLISHER.contact}`}
                className="text-primary underline underline-offset-4 hover:no-underline"
              >
                {PUBLISHER.contact}
              </a>
              .
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card p-6 shadow-sm">
            <Github className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Problems and suggestions</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Each application has a public feedback repository on GitHub for bug reports, feature
              suggestions and private security reports.
            </p>
            <Button asChild variant="link" className="mt-2 h-auto px-0">
              <Link to="/feedback">
                Choose an application <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          How each application handles your information is described on its release page:{" "}
          <Link
            to="/workspace-navigator/download"
            hash="your-information"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            Workspace Navigator
          </Link>{" "}
          and{" "}
          <Link
            to="/os-map/download"
            className="text-primary underline underline-offset-4 hover:no-underline"
          >
            OS Map
          </Link>
          .
        </p>
      </section>
    </>
  );
}

function ProductLink({
  to,
  icon: Icon,
  name,
  status,
  text,
}: {
  to: "/workspace-navigator" | "/os-map";
  icon: LucideIcon;
  name: string;
  status: string;
  text: string;
}) {
  return (
    <Link
      to={to}
      className="group flex gap-4 rounded-xl border border-border/70 bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {status}
        </span>
        <span className="mt-0.5 flex items-center gap-1 font-semibold">
          {name}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{text}</span>
      </span>
    </Link>
  );
}
