import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { identity, RequestError } from "@/account/identity";
import { TurnstileWidget, captchaEnabled } from "@/account/captcha";
import { AuthCard, Field, FormError, NotDirect, messageFor } from "@/account/forms";

export const Route = createFileRoute("/account/forgot")({
  head: () => ({ meta: [{ title: "Reset your password | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState("");
  const [captcha, setCaptcha] = useState(""); const [captchaReset, setCaptchaReset] = useState(0);
  if (!identity.direct) return <NotDirect />;
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    const addr = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) { setError("Enter a valid email address."); return; }
    setBusy(true);
    try {
      if (captchaEnabled && !captcha) throw new RequestError(400, "CAPTCHA_REQUIRED");
      await identity.direct!.requestPasswordReset(addr, captcha || undefined); setSent(addr);
    }
    catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); if (captchaEnabled) setCaptchaReset((n) => n + 1); }
  }
  return (
    <AuthCard title="Reset your password">
      {sent ? (
        <p role="status" className="text-sm text-foreground" data-testid="forgot-sent">If an account uses <strong>{sent}</strong>, we've sent a link to reset its password.</p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4" aria-describedby={error ? "forgot-error" : undefined}>
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" inputMode="email" />
        {captchaEnabled && <TurnstileWidget onToken={setCaptcha} resetKey={captchaReset} onError={setError} />}
          <FormError id="forgot-error" message={error} />
          <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</Button>
        </form>
      )}
      <p className="mt-6 text-sm"><Link to="/account/sign-in" className="text-primary underline underline-offset-4">Back to sign in</Link></p>
    </AuthCard>
  );
}
