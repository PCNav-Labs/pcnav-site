import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { identity, RequestError } from "@/account/identity";
import { TurnstileWidget, captchaEnabled } from "@/account/captcha";
import { AuthCard, Field, FormError, MfaChallengeForm, NotDirect, messageFor, returnToFromUrl } from "@/account/forms";
import { REGISTRATION_OPEN } from "@/account/mode";

export const Route = createFileRoute("/account/sign-in")({
  head: () => ({ meta: [{ title: "Sign in | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [mfa, setMfa] = useState(false);
  const [captcha, setCaptcha] = useState(""); const [captchaReset, setCaptchaReset] = useState(0);
  if (!identity.direct) return <NotDirect />;
  const done = () => navigate({ to: returnToFromUrl() as "/account", replace: true });
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    setBusy(true);
    try {
      if (captchaEnabled && !captcha) throw new RequestError(400, "CAPTCHA_REQUIRED");
      (await identity.direct!.signInWithPassword(email.trim(), password, captcha || undefined)) === "mfa-required" ? setMfa(true) : done();
    }
    catch (err) { setError(messageFor(err)); }
    finally { setBusy(false); if (captchaEnabled) setCaptchaReset((n) => n + 1); }
  }
  const reauth = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("reauth") === "1";
  return (
    <AuthCard title="Sign in" intro={reauth ? <p>For your security, sign in again to continue.</p> : <p>Free membership · No purchase required</p>}>
      {mfa ? <MfaChallengeForm onDone={done} /> : (
        <form onSubmit={submit} noValidate className="space-y-4" aria-describedby={error ? "signin-error" : undefined}>
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="username" inputMode="email" />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {captchaEnabled && <TurnstileWidget onToken={setCaptcha} resetKey={captchaReset} onError={setError} />}
          <FormError id="signin-error" message={error} />
          <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
      )}
      <p className="mt-6 text-sm"><Link to="/account/forgot" className="text-primary underline underline-offset-4">Forgot your password?</Link></p>
      {REGISTRATION_OPEN && <p className="mt-2 text-sm">New to PCNav? <Link to="/account/join" className="text-primary underline underline-offset-4">Join free</Link></p>}
    </AuthCard>
  );
}
