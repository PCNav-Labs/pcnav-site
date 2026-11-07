import { PUBLIC_PREVIEW } from "@/account/mode";
import { InactiveAuthForm } from "@/account/preview";
import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { identity, RequestError } from "@/account/identity";
import { TurnstileWidget, captchaEnabled } from "@/account/captcha";
import { AuthCard, Field, FormError, NotDirect, messageFor } from "@/account/forms";
import { REGISTRATION_OPEN } from "@/account/mode";

export const Route = createFileRoute("/account/join")({
  head: () => ({ meta: [{ title: "Join PCNav | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (PUBLIC_PREVIEW ? <InactiveAuthForm title="Join PCNav — free" fields={[{ id: "email", label: "Email", type: "email" }, { id: "password", label: "Password", type: "password", hint: "At least 12 characters." }]} submitLabel="Create free account" /> : <Join />),
});

// Registration is open only in test builds (WNM-11A). Otherwise this page offers no sign-up at all.
function Join() {
  return REGISTRATION_OPEN ? <JoinForm /> : (
    <AuthCard title="Registration isn't open yet">
      <p role="status" className="text-sm text-foreground" data-testid="registration-closed">Free PCNav membership isn't open for new members yet.</p>
      <p className="mt-4 text-sm">Already a member? <Link to="/account/sign-in" className="text-primary underline underline-offset-4">Sign in</Link></p>
    </AuthCard>
  );
}

function JoinForm() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState("");
  const [captcha, setCaptcha] = useState(""); const [captchaReset, setCaptchaReset] = useState(0);
  if (!identity.direct) return <NotDirect />;
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    const addr = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) { setError("Enter a valid email address."); return; }
    if (password.length < 12) { setError("Use a password of at least 12 characters."); return; }
    setBusy(true);
    try {
      if (captchaEnabled && !captcha) throw new RequestError(400, "CAPTCHA_REQUIRED");
      await identity.direct!.signUp(addr, password, captcha || undefined); setSent(addr);
    }
    catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); if (captchaEnabled) setCaptchaReset((n) => n + 1); }
  }
  if (sent) {
    return (
      <AuthCard title="Check your email">
        <p role="status" className="text-sm text-foreground" data-testid="join-sent">If this address can be used, we've sent a confirmation link to <strong>{sent}</strong>. Open it to finish joining.</p>
        <p className="mt-4 text-sm text-muted-foreground">Prototype: test email delivery is limited, so the message may not arrive.</p>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Join PCNav — free" intro={<p>Free membership · No purchase required</p>}>
      <form onSubmit={submit} noValidate className="space-y-4" aria-describedby={error ? "join-error" : undefined}>
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" hint="At least 12 characters." />
        {captchaEnabled && <TurnstileWidget onToken={setCaptcha} resetKey={captchaReset} onError={setError} />}
        <FormError id="join-error" message={error} />
        <Button type="submit" disabled={busy}>{busy ? "Creating account…" : "Create free account"}</Button>
      </form>
      <p className="mt-6 text-sm">Already a member? <Link to="/account/sign-in" className="text-primary underline underline-offset-4">Sign in</Link></p>
    </AuthCard>
  );
}
