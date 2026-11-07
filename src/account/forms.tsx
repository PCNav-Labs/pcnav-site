// Shared pieces for the in-page sign-in screens (WNM-6). Messages are deliberately generic:
// none says whether an email address has an account.
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MfaRequiredError, ReauthRequiredError, RequestError, identity } from "./identity";

export function messageFor(e: unknown): string {
  if (e instanceof ReauthRequiredError) return "For your security, sign in again first.";
  if (e instanceof MfaRequiredError) return "Enter a code from your authenticator app first.";
  const code = e instanceof RequestError ? e.message : "";
  switch (code) {
    case "INVALID_CREDENTIALS": return "Incorrect email or password.";
    case "EMAIL_NOT_CONFIRMED": return "Confirm your email address first, using the link we sent you.";
    case "RATE_LIMITED": return "Too many attempts. Wait a few minutes, then try again.";
    case "WEAK_PASSWORD": return "Use a password of at least 12 characters.";
    case "CODE_INVALID": return "That code didn't work. Check your authenticator app and try again.";
    case "LINK_INVALID": return "This link is invalid or has expired.";
    case "CAPTCHA_FAILED": return "The security check didn't pass. Please try it again.";
    case "CAPTCHA_REQUIRED": return "Complete the security check first.";
    default: return "Something went wrong. Please try again.";
  }
}

export const returnToFromUrl = () => {
  if (typeof window === "undefined") return "/account";
  const r = new URLSearchParams(window.location.search).get("returnTo") || "/account";
  return r.startsWith("/account") && !r.startsWith("//") ? r : "/account";
};

export function Field({ id, label, type = "text", value, onChange, autoComplete, hint, error, inputMode }: {
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void; autoComplete: string; hint?: string; error?: string; inputMode?: "numeric" | "email" | "text";
}) {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <Input id={id} name={id} type={type} className="mt-1.5" value={value} autoComplete={autoComplete} inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={describedBy} />
    </div>
  );
}

export function FormError({ id, message }: { id: string; message: string }) {
  return <p id={id} role={message ? "alert" : undefined} className="text-sm font-medium text-red-700 dark:text-red-400" data-testid="form-error">{message}</p>;
}

export function AuthCard({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="max-w-md">
      <h1 tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight outline-none sm:text-4xl">{title}</h1>
      {intro && <div className="mt-3 text-muted-foreground">{intro}</div>}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">{children}</div>
    </section>
  );
}

// TOTP code entry, used by Sign In, Reset and the account gate.
export function MfaChallengeForm({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!/^\d{6}$/.test(code.trim())) { setError("Enter the 6-digit code from your authenticator app."); return; }
    setBusy(true);
    try { await identity.direct!.challengeTotp(code.trim()); onDone(); }
    catch (err) { setError(messageFor(err)); setBusy(false); }
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-4" data-testid="mfa-challenge" aria-describedby={error ? "mfa-error" : undefined}>
      <p className="text-sm text-foreground">Two-step verification is on for this account. Enter the current code from your authenticator app.</p>
      <Field id="mfa-code" label="Authentication code" value={code} onChange={setCode} autoComplete="one-time-code" inputMode="numeric" error={error} />
      <FormError id="mfa-error" message={error} />
      <Button type="submit" disabled={busy}>{busy ? "Checking…" : "Verify"}</Button>
    </form>
  );
}

export function NotDirect() {
  return (
    <AuthCard title="Sign in">
      <p className="text-sm text-foreground">Sign-in for this site is handled by PCNav's sign-in service.</p>
      <Button className="mt-4" onClick={() => identity.signIn({ returnTo: returnToFromUrl() })}>Sign In</Button>
    </AuthCard>
  );
}
