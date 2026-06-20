import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/section-heading";
import { PrivacyList } from "@/components/privacy-list";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Lightbulb, BookOpen, Compass, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PCNav" },
      {
        name: "description",
        content:
          "PCNav develops practical tools designed to help people better understand and navigate technology.",
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

const PILLARS = [
  {
    icon: Lightbulb,
    label: "Clarity",
    description: "Information is presented plainly, so you don't need to be an expert to follow it.",
  },
  {
    icon: Eye,
    label: "Visibility",
    description: "You can see what your system is doing before deciding what, if anything, to change.",
  },
  {
    icon: BookOpen,
    label: "Understanding",
    description: "Each view explains what it shows and why it matters, not just raw values.",
  },
  {
    icon: Compass,
    label: "Confidence",
    description: "Seeing and understanding your system makes everyday technology decisions less uncertain.",
  },
  {
    icon: ShieldCheck,
    label: "Privacy",
    description: "Your information should remain under your control, with clear and honest handling of any data a tool uses.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">About</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            About PCNav.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            PCNav develops practical tools designed to help people better understand and navigate technology.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="The project"
          title="An independent project."
        />
        <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            PCNav is an independent software project maintained by PCNav Labs, built around a simple
            idea: technology is easier to trust when you can clearly understand what it's doing. That
            visibility-first principle shapes every tool it produces, starting with OS Map.
          </p>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          PCNav is an independent project and is not affiliated with Microsoft or Windows.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why build these tools?"
          title="Focused on what matters."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map(({ icon: Icon, label, description }) => (
            <Card key={label} className="border-border/70 shadow-none">
              <CardContent className="flex flex-col items-start gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-medium">{label}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Privacy"
            title="Quiet by design."
          />
          <div className="mt-8">
            <PrivacyList />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Any future changes will be clearly disclosed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <SectionHeading
          eyebrow="Ecosystem"
          title="A growing set of tools."
          description="Everything PCNav builds follows the same order: see first, understand next, then act. OS Map applies that approach to Windows; future tools will apply it elsewhere."
        />
      </section>
    </>
  );
}
