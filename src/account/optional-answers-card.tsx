// My Profile — optional answers (WNM-9P Amendment A). View, change, clear one, clear all.
// Clearing removes the stored value (NULL), and clearing everything deletes the row.
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { memberData } from "./data";
import { AnswersNotice, NO_ANSWERS, OptionalQuestions, QUESTIONS, describe, isEmpty, normalise, type OptionalAnswers } from "./onboarding";
import { ErrorNote, Loading } from "./ui";

const KEY = ["optional-answers"];

export function OptionalAnswersCard() {
  const store = memberData.optionalAnswers;
  const qc = useQueryClient();
  const saved = useQuery({ queryKey: KEY, queryFn: () => store!.get(), enabled: !!store, retry: false });
  const [draft, setDraft] = useState<OptionalAnswers>(NO_ANSWERS);
  const [status, setStatus] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (saved.data) setDraft(saved.data); }, [saved.data]);
  if (!store) return null;

  async function persist(next: OptionalAnswers, message: string, keepDraft?: OptionalAnswers) {
    setStatus(""); setError(""); setBusy(true);
    try {
      const result = isEmpty(next) ? (await store!.clearAll(), NO_ANSWERS) : await store!.save(normalise(next));
      qc.setQueryData(KEY, result); setDraft(keepDraft ?? result); setStatus(message);
    } catch { setError("We couldn't update your answers. Try again."); }
    finally { setBusy(false); }
  }
  const current = saved.data ?? NO_ANSWERS;
  const save = (e: FormEvent) => { e.preventDefault(); void persist(draft, "Your answers are saved."); };
  const clearOne = (key: keyof OptionalAnswers) => {
    const q = QUESTIONS.find((x) => x.key === key)!;
    void persist({ ...current, [key]: null }, `Your ${q.title.toLowerCase()} answer is cleared.`, { ...draft, [key]: null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Optional questions</CardTitle>
        <CardDescription>Optional and private. View, change or clear your answers here at any time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6"><AnswersNotice id="profile-notice" heading="h3" /></div>
        {saved.isPending ? <Loading label="Loading your answers" /> : saved.isError ? <ErrorNote message="We couldn't load your answers." onRetry={() => saved.refetch()} /> : (
          <>
            <h3 className="text-sm font-medium text-foreground">Saved answers</h3>
            <dl className="mt-2 grid gap-3 text-sm sm:grid-cols-2" data-testid="saved-answers">
              {QUESTIONS.map((q) => (
                <div key={q.key} data-answer={q.key}>
                  <dt className="text-muted-foreground">{q.title}</dt>
                  <dd className="font-medium text-foreground">{describe(q, current)}</dd>
                </div>
              ))}
            </dl>
            <form onSubmit={save} noValidate className="mt-6" aria-describedby={error ? "answers-error" : undefined}>
              <OptionalQuestions idPrefix="profile" value={draft} onChange={setDraft} onClear={clearOne} disabled={busy} />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="submit" disabled={busy}>Save answers</Button>
                {!isEmpty(current) && <Button type="button" variant="outline" disabled={busy} onClick={() => void persist(NO_ANSWERS, "All your optional answers are cleared.")}>Clear all answers</Button>}
              </div>
            </form>
          </>
        )}
        <p id="answers-error" className="mt-2 text-sm font-medium text-red-700 dark:text-red-400" role={error ? "alert" : undefined}>{error}</p>
        <p role="status" className="text-sm text-foreground" data-testid="answers-status">{status}</p>
      </CardContent>
    </Card>
  );
}
