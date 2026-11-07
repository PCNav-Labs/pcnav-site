import { PUBLIC_PREVIEW } from "@/account/mode";
import { PreviewOnboarding } from "@/account/preview";
import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { memberData } from "@/account/data";
import { AnswersNotice, NO_ANSWERS, ONBOARDING_EXPLANATION, OptionalQuestions, isEmpty, normalise, type OptionalAnswers } from "@/account/onboarding";
import { Gate, PageTitle } from "@/account/ui";

export const Route = createFileRoute("/account/welcome")({
  head: () => ({ meta: [{ title: "Welcome | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (PUBLIC_PREVIEW ? <PreviewOnboarding /> : <Gate section="your account"><Welcome /></Gate>),
});

// The one optional onboarding page, shown once after email verification. Skipping stores
// nothing at all; saving stores only what was selected.
function Welcome() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<OptionalAnswers>(NO_ANSWERS);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const store = memberData.optionalAnswers;
  const toAccount = () => navigate({ to: "/account", replace: true });
  if (!store) return <p className="text-sm text-muted-foreground">Your account is ready. <Link to="/account" className="text-primary underline underline-offset-4">Continue to your account</Link></p>;

  async function save(e: FormEvent) {
    e.preventDefault(); setError("");
    if (isEmpty(answers)) { toAccount(); return; } // nothing selected: nothing to store
    setBusy(true);
    try { await store!.save(normalise(answers)); toAccount(); }
    catch { setBusy(false); setError("We couldn't save your answers. Try again, or skip for now."); }
  }
  return (
    <>
      <PageTitle eyebrow="Welcome to PCNav" title="A few optional questions">
        <p data-testid="onboarding-explanation">{ONBOARDING_EXPLANATION}</p>
      </PageTitle>
      <div className="mb-6"><AnswersNotice id="welcome-notice" /></div>
      <form onSubmit={save} noValidate aria-describedby={error ? "welcome-error" : undefined} data-testid="onboarding-form">
        <OptionalQuestions idPrefix="welcome" value={answers} onChange={setAnswers} disabled={busy} />
        <p id="welcome-error" className="mt-4 text-sm font-medium text-red-700 dark:text-red-400" role={error ? "alert" : undefined}>{error}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save and Continue"}</Button>
          <Button type="button" variant="outline" disabled={busy} onClick={toAccount}>Skip for Now</Button>
        </div>
      </form>
    </>
  );
}
