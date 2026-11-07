import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { identity } from "@/account/identity";
import { AuthCard, Field, FormError, MfaChallengeForm, NotDirect, messageFor } from "@/account/forms";
import { Loading, useAccount } from "@/account/ui";

export const Route = createFileRoute("/account/reset")({
  head: () => ({ meta: [{ title: "Choose a new password | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Reset,
});

function Reset() {
  const s = useAccount();
  const once = useRef(false);
  const [phase, setPhase] = useState<"opening" | "ready" | "done" | "error">("opening");
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (once.current || !identity.direct) return; once.current = true;
    const tokenHash = new URLSearchParams(window.location.search).get("token_hash") || "";
    if (!tokenHash) { setPhase("error"); setError("This link is invalid or has expired."); return; }
    identity.direct.openPasswordReset(tokenHash).then(() => setPhase("ready"), (e) => { setPhase("error"); setError(messageFor(e)); });
  }, []);
  if (!identity.direct) return <NotDirect />;
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (password.length < 12) { setError("Use a password of at least 12 characters."); return; }
    setBusy(true);
    try { await identity.direct!.setNewPassword(password); setPhase("done"); }
    catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); }
  }
  if (phase === "opening") return <AuthCard title="Choose a new password"><Loading label="Opening your reset link" /></AuthCard>;
  if (phase === "error") return (
    <AuthCard title="Link not valid">
      <p role="alert" className="text-sm text-foreground" data-testid="reset-error">{error}</p>
      <p className="mt-4 text-sm"><Link to="/account/forgot" className="text-primary underline underline-offset-4">Send a new reset link</Link></p>
    </AuthCard>
  );
  if (phase === "done") return (
    <AuthCard title="Password changed">
      <p role="status" className="text-sm text-foreground" data-testid="reset-done">Your password is changed.</p>
      <p className="mt-4 text-sm"><Link to="/account" className="text-primary underline underline-offset-4">Go to your account</Link></p>
    </AuthCard>
  );
  if (s.status === "mfa-required") return <AuthCard title="Choose a new password"><MfaChallengeForm onDone={() => setPhase("ready")} /></AuthCard>;
  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={submit} noValidate className="space-y-4" aria-describedby={error ? "reset-error" : undefined}>
        <Field id="new-password" label="New password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 12 characters." />
        <FormError id="reset-error" message={error} />
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save new password"}</Button>
      </form>
    </AuthCard>
  );
}
