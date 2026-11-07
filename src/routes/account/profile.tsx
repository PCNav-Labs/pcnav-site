import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { identity } from "@/account/identity";
import { memberData } from "@/account/data";
import { ErrorNote, Gate, Loading, PageTitle } from "@/account/ui";
import { OptionalAnswersCard } from "@/account/optional-answers-card";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "My Profile | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (<Gate section="My Profile"><ProfilePage /></Gate>),
});

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
          <CardContent className="text-sm text-foreground">
            <p>Download your data or delete your account in <Link to="/account/security" className="text-primary underline underline-offset-4">Account Security</Link>. Password and two-step verification are there too.</p>
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
