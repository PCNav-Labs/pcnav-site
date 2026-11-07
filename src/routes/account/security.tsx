import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

// Account Security (WNM-11B): password, two-step verification, sign-out everywhere, data export and
// account deletion. Moved unchanged from My Profile (WNM-3 to WNM-9PC); only the page changed.
export const Route = createFileRoute("/account/security")({
  head: () => ({ meta: [{ title: "Account Security | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (<Gate section="Account Security"><SecurityPage /></Gate>),
});

const REAUTH_SECONDS = 300;

function SecurityPage() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: identity.getProfile, retry: false });
  const title = <PageTitle eyebrow="Account Security" title="Account Security" />;
  if (profile.isPending) return <>{title}<Loading label="Loading your account security" /></>;
  if (profile.isError) return <>{title}<ErrorNote message="We couldn't load your account." onRetry={() => profile.refetch()} /></>;
  const p = profile.data;
  return (
    <>
      {title}
      <div className="space-y-6">
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
            <Button onClick={() => identity.signIn({ returnTo: "/account/security", forceLogin: true })}>Sign in again</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
