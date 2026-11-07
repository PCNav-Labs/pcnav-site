import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { identity, ReauthRequiredError } from "@/account/identity";
import { memberData } from "@/account/data";
import { ErrorNote, Gate, Loading, PageTitle } from "@/account/ui";
import { InAppSecurity } from "@/account/security";
import { OptionalAnswersCard } from "@/account/optional-answers-card";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "My Profile | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (<Gate section="My Profile"><ProfilePage /></Gate>),
});

const REAUTH_SECONDS = 300;

function ProfilePage() {
  const qc = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: identity.getProfile, retry: false });
  const title = <PageTitle eyebrow="My Profile" title="My Profile" />;
  if (profile.isPending) return <>{title}<Loading label="Loading your profile" /></>;
  if (profile.isError) return <>{title}<ErrorNote message="We couldn't load your profile." onRetry={() => profile.refetch()} /></>;
  const p = profile.data;
  const refresh = () => qc.invalidateQueries({ queryKey: ["profile"] });

  return (
    <>
      {title}
      <div className="space-y-6">
        <EmailCard email={p.email} verified={p.emailVerified} pending={p.pendingEmail} onRequested={refresh} />
        <OptionalAnswersCard />

        <Card>
          <CardHeader><CardTitle className="text-lg">Membership</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Status</dt><dd className="font-medium text-foreground">Free member</dd></div>
              {p.createdAt && <div><dt className="text-muted-foreground">Member since</dt><dd className="font-medium text-foreground">{new Date(p.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</dd></div>}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security and recovery</CardTitle>
            <CardDescription>{identity.securityUrl("password") ? "These are managed by PCNav's sign-in service. You'll leave this page and come back afterwards." : "Your sign-in is protected by PCNav's sign-in service."}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {identity.securityUrl("password") ? (
              <>
                <Button asChild variant="outline"><a href={identity.securityUrl("password")!}>Change password</a></Button>
                <Button asChild variant="outline"><a href={identity.securityUrl("mfa")!}>Two-step verification</a></Button>
                <Button asChild variant="outline"><a href={identity.securityUrl("passkeys")!}>Passkeys</a></Button>
              </>
            ) : (
              identity.direct ? <InAppSecurity /> : <p className="w-full text-sm text-muted-foreground" data-testid="security-in-app">Changing your password, two-step verification and passkeys will be managed on this page. They aren't available in this prototype yet.</p>
            )}
            <SignOutEverywhere />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Communications</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>PCNav sends only account and security email, such as verification and password-reset links. Product news preferences will appear here if PCNav introduces a newsletter.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your data</CardTitle>
            <CardDescription>PCNav holds your email, membership date and the products you follow{memberData.optionalAnswers ? ", plus any optional answers you've given" : ""}. It holds no purchase or licence information in your account.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <ExportData />
            <DeleteAccount email={p.email} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function EmailCard({ email, verified, pending, onRequested }: { email: string; verified: boolean; pending: string | null; onRequested: () => void }) {
  const [open, setOpen] = useState(false); const [value, setValue] = useState("");
  const [awaitingCode, setAwaitingCode] = useState(""); const [code, setCode] = useState("");
  const [error, setError] = useState(""); const [status, setStatus] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault(); setStatus("");
    const next = value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(next)) { setError("Enter a valid email address."); return; }
    setError("");
    try {
      const r = await identity.requestEmailChange(next);
      setOpen(false); onRequested();
      if (r.verification === "code") { setAwaitingCode(next); setStatus(`We sent a verification code to ${next}. Enter it below to finish.`); }
      else setStatus(`We sent a verification link to ${next}. Your current email stays active until you verify the new one.`);
    } catch { setError("We couldn't start the email change. Try again."); }
  }
  async function confirm(e: FormEvent) {
    e.preventDefault(); setStatus("");
    if (!/^\d{4,8}$/.test(code.trim())) { setError("Enter the code from the email."); return; }
    setError("");
    try { await identity.confirmEmailChange(code.trim()); setAwaitingCode(""); setCode(""); setStatus("Your new email is verified."); onRequested(); }
    catch { setError("That code didn't work. Check it and try again."); }
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Email</CardTitle></CardHeader>
      <CardContent>
        <p className="flex flex-wrap items-center gap-2 text-foreground"><span data-testid="email">{email}</span>{verified && <Badge variant="secondary">Verified</Badge>}</p>
        {(pending || awaitingCode) && <p className="mt-2 text-sm text-muted-foreground" data-testid="pending-email">Waiting for verification: {pending || awaitingCode}</p>}
        {!open && !awaitingCode && <Button className="mt-4" variant="outline" onClick={() => setOpen(true)}>Change email</Button>}
        {open && (
          <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grow">
              <Label htmlFor="new-email">New email</Label>
              <Input id="new-email" type="email" className="mt-1.5" autoComplete="email" value={value} onChange={(e) => setValue(e.target.value)}
                aria-invalid={!!error} aria-describedby={error ? "new-email-error" : undefined} />
            </div>
            <Button type="submit">Send verification</Button>
            <Button type="button" variant="ghost" onClick={() => { setOpen(false); setError(""); }}>Cancel</Button>
          </form>
        )}
        {awaitingCode && (
          <form onSubmit={confirm} noValidate className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grow">
              <Label htmlFor="email-code">Verification code</Label>
              <Input id="email-code" inputMode="numeric" autoComplete="one-time-code" className="mt-1.5" value={code} onChange={(e) => setCode(e.target.value)}
                aria-invalid={!!error} aria-describedby={error ? "new-email-error" : undefined} />
            </div>
            <Button type="submit">Confirm</Button>
          </form>
        )}
        <p id="new-email-error" className="mt-2 text-sm font-medium text-destructive" role={error ? "alert" : undefined}>{error}</p>
        <p role="status" className="text-sm text-foreground" data-testid="email-status">{status}</p>
      </CardContent>
    </Card>
  );
}

function SignOutEverywhere() {
  const [error, setError] = useState("");
  return (
    <>
      <Button variant="outline" onClick={() => identity.signOutEverywhere().catch(() => setError("We couldn't sign out your other devices. Try again."))}>Sign out of all devices</Button>
      {error && <p role="alert" className="w-full text-sm font-medium text-destructive">{error}</p>}
    </>
  );
}

function ExportData() {
  const [status, setStatus] = useState("");
  async function run() {
    setStatus("");
    try {
      const [profile, member] = await Promise.all([identity.getProfile(), memberData.exportData()]);
      const doc = {
        generatedAt: new Date().toISOString(),
        note: "PCNav account data. Purchases and licences are not held in PCNav accounts, so none appear here.",
        profile: { email: profile.email, emailVerified: profile.emailVerified, memberSince: profile.createdAt },
        productInterests: member.interests,
        ...(member.optionalAnswers !== undefined ? { optionalAnswers: member.optionalAnswers } : {}),
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }));
      const a = document.createElement("a"); a.href = url; a.download = "pcnav-account-data.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("Your data file is downloading.");
    } catch { setStatus("We couldn't prepare your data. Try again."); }
  }
  return (<><Button variant="outline" onClick={run}>Download my data</Button><p role="status" className="w-full text-sm text-foreground" data-testid="export-status">{status}</p></>);
}

function DeleteAccount({ email }: { email: string }) {
  const [typed, setTyped] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const recent = identity.recentlyAuthenticated(REAUTH_SECONDS);
  async function confirm() {
    setBusy(true); setError("");
    try { await memberData.deleteMemberData(); await identity.deleteIdentity(); }
    catch (e) {
      setBusy(false);
      setError(e instanceof ReauthRequiredError ? "For your security, sign in again before deleting your account." : "We couldn't finish deleting your account. Try again.");
    }
  }
  return (
    <AlertDialog onOpenChange={(o) => { if (!o) { setTyped(""); setError(""); } }}>
      <AlertDialogTrigger asChild><Button variant="destructive" className="bg-red-700 text-white hover:bg-red-800">Delete account</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your PCNav account?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This permanently deletes the account for <strong className="text-foreground">{email}</strong>: your profile{memberData.optionalAnswers ? ", your optional answers" : ""} and the products you follow. It can't be undone.</p>
              <p>It doesn't affect Workspace Navigator or any licence. Any purchase records stay with the seller under its own retention.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {recent ? (
          <div>
            <Label htmlFor="confirm-delete">Type DELETE to confirm</Label>
            <Input id="confirm-delete" className="mt-1.5" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" aria-describedby={error ? "delete-error" : undefined} />
          </div>
        ) : (
          <p className="text-sm text-foreground" data-testid="reauth-needed">For your security, sign in again before deleting your account.</p>
        )}
        {error && <p id="delete-error" role="alert" className="text-sm font-medium text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {recent ? (
            <Button variant="destructive" className="bg-red-700 text-white hover:bg-red-800" disabled={typed !== "DELETE" || busy} onClick={confirm}>{busy ? "Deleting…" : "Delete account"}</Button>
          ) : (
            <Button onClick={() => identity.signIn({ returnTo: "/account/profile", forceLogin: true })}>Sign in again</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
