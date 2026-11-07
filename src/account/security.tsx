// In-page security settings for providers without hosted account pages (Supabase, WNM-6):
// change password, and TOTP two-step verification (enrol, verify, remove).
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { identity, ReauthRequiredError, type MfaFactor, type TotpEnrollment } from "./identity";
import { Field, FormError, messageFor } from "./forms";

export function InAppSecurity() {
  return (
    <div className="w-full space-y-8">
      <ChangePassword />
      <TwoStep />
    </div>
  );
}

function ChangePassword() {
  const [pw, setPw] = useState(""); const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(""); const [status, setStatus] = useState(""); const [reauth, setReauth] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError(""); setStatus(""); setReauth(false);
    if (pw.length < 12) { setError("Use a password of at least 12 characters."); return; }
    if (pw !== confirm) { setError("The two passwords don't match."); return; }
    try { await identity.direct!.changePassword(pw); setPw(""); setConfirm(""); setStatus("Your password is changed."); }
    catch (err) { if (err instanceof ReauthRequiredError) setReauth(true); setError(messageFor(err)); }
  }
  return (
    <section aria-labelledby="pw-title">
      <h3 id="pw-title" className="font-medium text-foreground">Change password</h3>
      <form onSubmit={submit} noValidate className="mt-3 space-y-3" aria-describedby={error ? "pw-error" : undefined}>
        <Field id="pw-new" label="New password" type="password" value={pw} onChange={setPw} autoComplete="new-password" hint="At least 12 characters." />
        <Field id="pw-confirm" label="Confirm new password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <FormError id="pw-error" message={error} />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="outline">Change password</Button>
          {reauth && <Button type="button" onClick={() => identity.signIn({ returnTo: "/account/profile", forceLogin: true })}>Sign in again</Button>}
        </div>
        <p role="status" className="text-sm text-foreground" data-testid="pw-status">{status}</p>
      </form>
    </section>
  );
}

function TwoStep() {
  const [factors, setFactors] = useState<MfaFactor[] | null>(null);
  const [enrolment, setEnrolment] = useState<TotpEnrollment | null>(null);
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [status, setStatus] = useState("");
  const load = () => identity.direct!.mfaFactors().then(setFactors, (e) => setError(messageFor(e)));
  useEffect(() => { void load(); }, []);
  const verified = factors?.find((f) => f.status === "verified");

  async function start() {
    setError(""); setStatus("");
    try { setEnrolment(await identity.direct!.enrollTotp()); } catch (e) { setError(messageFor(e)); }
  }
  async function confirm(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!/^\d{6}$/.test(code.trim())) { setError("Enter the 6-digit code from your authenticator app."); return; }
    try { await identity.direct!.verifyTotpEnrollment(enrolment!.factorId, code.trim()); setEnrolment(null); setCode(""); setStatus("Two-step verification is on."); await load(); }
    catch (err) { setError(messageFor(err)); }
  }
  async function cancel() { if (enrolment) await identity.direct!.removeFactor(enrolment.factorId).catch(() => {}); setEnrolment(null); setCode(""); setError(""); await load(); }
  async function remove() {
    setError(""); setStatus("");
    try { await identity.direct!.removeFactor(verified!.id); setStatus("Two-step verification is off."); await load(); }
    catch (err) { setError(messageFor(err)); }
  }

  return (
    <section aria-labelledby="mfa-title" data-testid="two-step">
      <h3 id="mfa-title" className="font-medium text-foreground">Two-step verification</h3>
      {factors === null && !error && <p className="mt-2 text-sm text-muted-foreground">Checking…</p>}
      {factors && !enrolment && (verified ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-foreground" data-testid="mfa-on">On. Signing in asks for a code from your authenticator app.</p>
          <Button variant="outline" onClick={remove}>Turn off two-step verification</Button>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <p className="text-sm text-muted-foreground">Off. Add a code from an authenticator app to each sign-in.</p>
          <Button variant="outline" onClick={start}>Set up two-step verification</Button>
        </div>
      ))}
      {enrolment && (
        <form onSubmit={confirm} noValidate className="mt-3 space-y-3" aria-describedby={error ? "mfa-enrol-error" : undefined}>
          <p className="text-sm text-foreground">Scan this code with your authenticator app, or enter the key below. Then type the 6-digit code it shows.</p>
          <img src={enrolment.qrSvgDataUri} alt="QR code for adding PCNav to your authenticator app" width={176} height={176} className="rounded-md border border-border bg-white p-2" />
          <p className="text-sm text-foreground">Key: <code className="break-all rounded bg-muted px-1.5 py-0.5" data-testid="totp-secret">{enrolment.secret}</code></p>
          <Field id="mfa-enrol-code" label="Code from your app" value={code} onChange={setCode} autoComplete="one-time-code" inputMode="numeric" />
          <FormError id="mfa-enrol-error" message={error} />
          <div className="flex flex-wrap gap-3">
            <Button type="submit">Turn on</Button>
            <Button type="button" variant="ghost" onClick={cancel}>Cancel</Button>
          </div>
        </form>
      )}
      {!enrolment && <FormError id="mfa-error-main" message={error} />}
      <p role="status" className="mt-2 text-sm text-foreground" data-testid="mfa-status">{status}</p>
    </section>
  );
}
