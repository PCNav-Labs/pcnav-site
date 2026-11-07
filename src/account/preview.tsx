// Public scaffolding (WNM-11B): what visitors see when the membership section is visible but not
// open. Descriptions only describe features that exist in this code; no entitlement, price or date
// is promised. Forms are rendered disabled inside a disabled <fieldset> and have no submit handler,
// so nothing can be entered, sent or stored.
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "./forms";
import { AnswersNotice, NO_ANSWERS, ONBOARDING_EXPLANATION, OptionalQuestions } from "./onboarding";
import { PageTitle, SECTIONS } from "./ui";

export function ComingSoonNotice() {
  return (
    <p role="note" className="mb-6 flex items-start gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm text-foreground" data-testid="coming-soon">
      <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span><strong>Coming soon.</strong> PCNav membership isn't open yet. These pages show what it will include. Nothing here signs you in or stores anything.</span>
    </p>
  );
}

// Section previews, keyed by the section name each page passes to <Gate>. Add an entry here when a
// new member section is added (see src/account/README.md).
export const SECTION_PREVIEWS: Record<string, { title: string; intro: string; items: string[] }> = {
  "your account": {
    title: "Overview", intro: "Your membership at a glance.",
    items: ["The products you follow and their release status.", "The latest PCNav announcement.", "Quick links to your profile, products, resources and account security."],
  },
  "My Profile": {
    title: "My Profile", intro: "Your account information and the choices you've made.",
    items: ["Your email address, with a verified change of address.", "Your membership status and the date you joined.", "Four optional questions you can answer, change or clear at any time.", "What PCNav holds about you, in plain words."],
  },
  "My Products": {
    title: "My Products", intro: "The PCNav products you choose to follow.",
    items: ["Follow Workspace Navigator and OS Map to keep their release information together.", "Links to each product's overview, releases and feedback.", "Following a product isn't a purchase or a licence. Workspace Navigator never needs an account."],
  },
  "Member Resources": {
    title: "Member Resources", intro: "Help and information for each product.",
    items: ["Documentation, release information and feedback links for each product.", "A place for member-only resources. None exist yet."],
  },
  "Account Security": {
    title: "Account Security", intro: "Control over your sign-in and your data.",
    items: ["Change your password.", "Two-step verification with an authenticator app.", "Sign out of all your devices.", "Download your data.", "Delete your account and its data."],
  },
};

export function SectionPreview({ section }: { section: string }) {
  const p = SECTION_PREVIEWS[section] ?? { title: section, intro: "Part of PCNav membership.", items: [] };
  return (
    <>
      <PageTitle eyebrow="Coming soon" title={p.title}><p>{p.intro} When membership opens, this page will show:</p></PageTitle>
      <ul className="max-w-2xl list-disc space-y-2 pl-5 text-foreground" data-testid="section-preview">
        {p.items.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">This is a description, not your account. No account information is shown or stored.</p>
    </>
  );
}

type PreviewField = { id: string; label: string; type?: string; hint?: string };
// A disabled preview of an authentication form: no handler, no values, nothing submitted.
export function InactiveAuthForm({ title, fields, submitLabel, footer }: { title: string; fields: PreviewField[]; submitLabel: string; footer?: ReactNode }) {
  return (
    <AuthCard title={title} intro={<p>Free membership · No purchase required</p>}>
      <p role="status" className="mb-4 text-sm text-foreground" data-testid="inactive-form">Coming soon. This form isn't active yet, so it can't sign you in or create an account.</p>
      <form noValidate onSubmit={(e) => e.preventDefault()} aria-describedby="inactive-form-note">
        <fieldset disabled className="space-y-4" data-testid="inactive-fieldset">
          {fields.map((f) => (
            <div key={f.id}>
              <Label htmlFor={`preview-${f.id}`}>{f.label}</Label>
              {f.hint && <p className="mt-1 text-sm text-muted-foreground">{f.hint}</p>}
              <Input id={`preview-${f.id}`} type={f.type || "text"} className="mt-1.5" defaultValue="" autoComplete="off" />
            </div>
          ))}
          <Button type="submit">{submitLabel}</Button>
        </fieldset>
        <p id="inactive-form-note" className="sr-only">This form is disabled until PCNav membership opens.</p>
      </form>
      {footer}
    </AuthCard>
  );
}

// Supporting routes (verification, reset, sign-in callback, signed out) in the scaffolding.
export function SupportingPreview({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AuthCard title={title}>
      <div className="space-y-3 text-sm text-foreground" data-testid="supporting-preview">{children}</div>
      <p className="mt-6 text-sm"><Link to="/account" className="text-primary underline underline-offset-4">About PCNav membership</Link></p>
    </AuthCard>
  );
}

// The onboarding page, shown read-only: the four approved questions, the explanation and the notice.
export function PreviewOnboarding() {
  return (
    <>
      <PageTitle eyebrow="Coming soon" title="A few optional questions">
        <p data-testid="onboarding-explanation">{ONBOARDING_EXPLANATION}</p>
        <p className="mt-2">New members will see this page once, after confirming their email. This preview can't be filled in.</p>
      </PageTitle>
      <div className="mb-6"><AnswersNotice id="welcome-notice" /></div>
      <form noValidate onSubmit={(e) => e.preventDefault()} data-testid="onboarding-preview">
        <OptionalQuestions idPrefix="preview" value={NO_ANSWERS} onChange={() => {}} disabled />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="submit" disabled>Save and Continue</Button>
          <Button type="button" variant="outline" disabled>Skip for Now</Button>
        </div>
      </form>
    </>
  );
}

// The landing page's directory of member sections (public scaffolding). Built from SECTIONS, so a
// new section appears here automatically.
export function SectionDirectory() {
  return (
    <section aria-labelledby="planned-title" className="mt-10 max-w-3xl">
      <h2 id="planned-title" className="font-display text-xl font-semibold">What membership will include</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2" data-testid="section-directory">
        {SECTIONS.map((s) => {
          const p = SECTION_PREVIEWS[s.label === "Overview" ? "your account" : s.label];
          return (
            <li key={s.to} className="rounded-lg border border-border p-4">
              <Link to={s.to} className="font-medium text-primary underline underline-offset-4">{s.label}</Link>
              <p className="mt-1 text-sm text-muted-foreground">{p?.intro}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
