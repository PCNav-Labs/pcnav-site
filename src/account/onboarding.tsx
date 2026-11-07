// PCNav account — optional onboarding questions (WNM-9P Amendment A, LOCAL prototype).
// Four optional questions. Nothing is required and nothing is preselected. Answers are linked
// to the member's account (they are not anonymous) and are stored apart from sign-in data.
// Nothing here is inferred from IP address, email address or browsing.
//
// RESPONSE CATEGORIES ARE PROPOSED, pending Owner confirmation. The values must match the
// database check constraints in supabase/migrations/20261107000002_wnm9pa_optional_answers.sql.
import { Button } from "@/components/ui/button";

export type OptionalAnswers = {
  ageRange: string | null;
  region: string | null;
  memberCategories: string[] | null;
  intendedUses: string[] | null;
};
export const NO_ANSWERS: OptionalAnswers = { ageRange: null, region: null, memberCategories: null, intendedUses: null };

type Option = { value: string; label: string; description?: string };
export type Question = { key: keyof OptionalAnswers; number: number; title: string; hint: string; multiple: boolean; options: Option[] };

export const QUESTIONS: Question[] = [
  {
    key: "ageRange", number: 1, title: "Age range", multiple: false, hint: "Choose one.",
    options: [
      { value: "18-24", label: "18–24" }, { value: "25-34", label: "25–34" }, { value: "35-44", label: "35–44" },
      { value: "45-54", label: "45–54" }, { value: "55-64", label: "55–64" }, { value: "65-plus", label: "65 or older" },
    ],
  },
  {
    key: "region", number: 2, title: "Geographic region", multiple: false, hint: "Choose one. Examples show where some countries belong.",
    options: [
      { value: "canada", label: "Canada" },
      { value: "united-states", label: "United States" },
      { value: "mexico-central-america-caribbean", label: "Mexico, Central America and the Caribbean" },
      { value: "south-america", label: "South America" },
      { value: "europe", label: "Europe", description: "Including the United Kingdom, Ukraine and Russia" },
      { value: "middle-east-north-africa", label: "Middle East and North Africa", description: "For example Egypt, Iran, Israel, Morocco, Saudi Arabia and Türkiye" },
      { value: "sub-saharan-africa", label: "Sub-Saharan Africa", description: "For example Ethiopia, Kenya, Nigeria and South Africa" },
      { value: "asia", label: "Central, South and East Asia", description: "For example China, India, Japan, Kazakhstan, Pakistan and the Philippines" },
      { value: "oceania", label: "Australia, New Zealand and the Pacific Islands" },
    ],
  },
  {
    key: "memberCategories", number: 3, title: "Member category", multiple: true, hint: "Choose any that apply.",
    options: [
      { value: "personal", label: "Individual or home user" },
      { value: "student", label: "Student" },
      { value: "educator", label: "Educator" },
      { value: "technology-professional", label: "Software developer or IT professional" },
      { value: "small-business", label: "Small business owner or self-employed" },
      { value: "business-employee", label: "Employee of a business" },
      { value: "non-profit-public-sector", label: "Non-profit, government or public sector" },
    ],
  },
  {
    key: "intendedUses", number: 4, title: "Intended product use", multiple: true, hint: "Choose any that apply.",
    options: [
      { value: "personal-organisation", label: "Organising personal files and projects" },
      { value: "work-projects", label: "Managing work or business projects" },
      { value: "study-teaching", label: "Study or teaching" },
      { value: "software-development", label: "Software development" },
      { value: "it-support", label: "IT support or system administration" },
      { value: "research-writing", label: "Research or writing" },
      { value: "system-privacy-understanding", label: "Understanding my computer, network or privacy settings" },
      { value: "evaluating", label: "Evaluating PCNav products" },
    ],
  },
];

export const questionTitle = (q: Question) => `Question ${q.number} of ${QUESTIONS.length} — ${q.title}`;

// Empty selections become null, so nothing empty is ever stored.
export function normalise(a: OptionalAnswers): OptionalAnswers {
  const arr = (v: string[] | null) => (v && v.length ? [...new Set(v)] : null);
  return { ageRange: a.ageRange || null, region: a.region || null, memberCategories: arr(a.memberCategories), intendedUses: arr(a.intendedUses) };
}
export const isEmpty = (a: OptionalAnswers) => { const n = normalise(a); return !n.ageRange && !n.region && !n.memberCategories && !n.intendedUses; };

export function describe(q: Question, a: OptionalAnswers): string {
  const v = a[q.key];
  const label = (x: string) => q.options.find((o) => o.value === x)?.label || x;
  if (!v || (Array.isArray(v) && !v.length)) return "Not answered";
  return Array.isArray(v) ? v.map(label).join(", ") : label(v);
}

// The four questions as native fieldsets: one legend each, radios for single choice,
// checkboxes for multiple choice. `onClear` adds a per-question "Clear answer" button.
export function OptionalQuestions({ idPrefix, value, onChange, onClear, disabled }: {
  idPrefix: string; value: OptionalAnswers; onChange: (next: OptionalAnswers) => void;
  onClear?: (key: keyof OptionalAnswers) => void; disabled?: boolean;
}) {
  return (
    <div className="space-y-6">
      {QUESTIONS.map((q) => {
        const current = value[q.key];
        const answered = Array.isArray(current) ? current.length > 0 : !!current;
        const hintId = `${idPrefix}-${q.key}-hint`;
        return (
          <fieldset key={q.key} className="rounded-lg border border-border p-4" aria-describedby={hintId} data-question={q.key} disabled={disabled}>
            <legend className="px-1 font-medium text-foreground">{questionTitle(q)}</legend>
            <p id={hintId} className="mb-3 text-sm text-muted-foreground">{q.hint} Optional.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o) => {
                const id = `${idPrefix}-${q.key}-${o.value}`;
                const checked = Array.isArray(current) ? current.includes(o.value) : current === o.value;
                return (
                  <div key={o.value} className="flex items-start gap-2">
                    <input
                      id={id} type={q.multiple ? "checkbox" : "radio"} name={`${idPrefix}-${q.key}`} value={o.value} checked={checked}
                      className="mt-1 h-4 w-4 shrink-0 accent-primary" aria-describedby={o.description ? `${id}-desc` : undefined}
                      onChange={(e) => {
                        if (q.multiple) {
                          const list = (current as string[] | null) || [];
                          onChange({ ...value, [q.key]: e.target.checked ? [...list, o.value] : list.filter((x) => x !== o.value) });
                        } else onChange({ ...value, [q.key]: o.value });
                      }}
                    />
                    <div>
                      <label htmlFor={id} className="text-sm text-foreground">{o.label}</label>
                      {o.description && <p id={`${id}-desc`} className="text-xs text-muted-foreground">{o.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            {answered && (
              <Button type="button" variant="ghost" size="sm" className="mt-3"
                onClick={() => (onClear ? onClear(q.key) : onChange({ ...value, [q.key]: null }))}>
                Clear answer<span className="sr-only"> to {q.title.toLowerCase()}</span>
              </Button>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

// Approved onboarding explanation (WNM-9PB) and the local data notice for optional answers.
// Prototype wording only: not published legal terms and not legally reviewed.
export const ONBOARDING_EXPLANATION = "These optional questions help us understand our members and improve PCNav products. You can skip any question, and change or remove your answers later in My Profile.";
export const NOTICE_POINTS = [
  "Your answers are linked to your PCNav account, so they aren't anonymous.",
  "Every question is optional, and your answers are private: they aren't shown to other members, and PCNav doesn't publish individual answers.",
  "PCNav uses them only in aggregate, for audience and product research.",
  "You can change or clear any answer, or all of them, in My Profile. Clearing removes them from your account.",
  "Cleared or deleted answers may remain for a limited time in backups and technical records until those expire.",
  "Your answers are kept separately from your sign-in details and from any purchase or licence records.",
];
export function AnswersNotice({ id, heading: Heading = "h2" }: { id: string; heading?: "h2" | "h3" }) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-border bg-surface/60 p-4 text-sm" data-testid="answers-notice">
      <Heading id={id} className="font-medium text-foreground">About your answers</Heading>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
        {NOTICE_POINTS.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </section>
  );
}
