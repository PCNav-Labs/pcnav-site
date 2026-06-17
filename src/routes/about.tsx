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
  { icon: Lightbulb, label: "Clarity" },
  { icon: Eye, label: "Visibility" },
  { icon: BookOpen, label: "Understanding" },
  { icon: Compass, label: "Confidence" },
  { icon: ShieldCheck, label: "Privacy" },
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
          eyebrow="Why build these tools?"
          title="Focused on what matters."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map(({ icon: Icon, label }) => (
            <Card key={label} className="border-border/70 shadow-none">
              <CardContent className="flex flex-col items-start gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-medium">{label}</p>
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
          description="OS Map is the first PCNav product. Additional tools are planned with the same focus on clarity, visibility, and confidence."
        />
      </section>
    </>
  );
}
