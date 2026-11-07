import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Check, Package, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { identity } from "@/account/identity";
import { memberData, ANNOUNCEMENTS, CATALOGUE } from "@/account/data";
import { ErrorNote, Gate, JoinActions, Loading, PageTitle, useAccount } from "@/account/ui";
import { PUBLIC_PREVIEW } from "@/account/mode";
import { SectionDirectory } from "@/account/preview";

export const Route = createFileRoute("/account/")({ component: AccountHome });

function AccountHome() {
  const s = useAccount();
  if (s.status === "signed-out") return <Landing />;
  return (
    <Gate section="your account">
      <Overview />
    </Gate>
  );
}

const BENEFITS = [
  "Follow PCNav products, starting with Workspace Navigator.",
  "Find release information, documentation and announcements in one place.",
  "Manage your profile, your data and your account yourself, including deleting it.",
];

function Landing() {
  const s = useAccount();
  return (
    <section aria-labelledby="landing-title" className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">PCNav membership</p>
      <h1 id="landing-title" tabIndex={-1} className="mt-3 font-display text-4xl font-semibold tracking-tight outline-none sm:text-5xl">Your PCNav Account</h1>
      <p className="mt-4 text-lg text-muted-foreground">One free account for PCNav products and member services.</p>
      <p role="status" className="mt-4 text-sm text-foreground" data-testid="restore-notice">{s.message ?? ""}</p>
      <p className="mt-6 inline-flex rounded-full border border-border bg-surface/60 px-4 py-1.5 text-sm font-medium text-foreground">Free membership · No purchase required</p>
      <ul className="mt-8 space-y-3">
        {BENEFITS.map((b) => (
          <li key={b} className="flex gap-3 text-foreground">
            <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3"><JoinActions /></div>
      {PUBLIC_PREVIEW && <SectionDirectory />}
      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Workspace Navigator works without an account. Signing in here never signs you in to the app, and your licence doesn't depend on it.
      </p>
    </section>
  );
}

function Overview() {
  const s = useAccount();
  const profile = useQuery({ queryKey: ["profile"], queryFn: identity.getProfile, retry: false });
  const interests = useQuery({ queryKey: ["interests"], queryFn: memberData.interests, retry: false });
  if (profile.isPending || interests.isPending) return <><PageTitle eyebrow="Overview" title="Your PCNav Account" /><Loading label="Loading your account overview" /></>;
  if (profile.isError || interests.isError)
    return <><PageTitle eyebrow="Overview" title="Your PCNav Account" /><ErrorNote message="We couldn't load your account overview." onRetry={() => { profile.refetch(); interests.refetch(); }} /></>;

  const p = profile.data; const latest = ANNOUNCEMENTS[0];
  const followed = interests.data.length;
  return (
    <>
      <PageTitle eyebrow="Overview" title="Your PCNav Account">
        <p>Welcome, {p.email || s.claims?.email}.</p>
      </PageTitle>
      {p.loginCount === 1 && (
        <section aria-labelledby="welcome-title" className="mb-8 rounded-xl border border-primary/40 bg-surface/60 p-6" data-testid="welcome">
          <h2 id="welcome-title" className="font-display text-xl font-semibold">Welcome to PCNav</h2>
          <p className="mt-2 text-muted-foreground">
            Your free membership is ready. Follow the products you care about in <Link to="/account/products" className="text-primary underline underline-offset-4">My Products</Link>.
            Membership never signs you in to an app and never tracks how you use one.
          </p>
        </section>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound aria-hidden="true" className="h-4 w-4 text-primary" />Membership</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="text-foreground">Free member</p>
            {p.createdAt && <p>Member since {new Date(p.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>}
            <Link to="/account/profile" className="mt-3 inline-block text-primary underline underline-offset-4">My Profile</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Package aria-hidden="true" className="h-4 w-4 text-primary" />Products</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="text-foreground" data-testid="followed-count">Following {followed} of {CATALOGUE.length} products</p>
            <Link to="/account/products" className="mt-3 inline-block text-primary underline underline-offset-4">My Products</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen aria-hidden="true" className="h-4 w-4 text-primary" />Resources</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="text-foreground">Latest: {latest.title}</p>
            <Link to="/account/resources" className="mt-3 inline-block text-primary underline underline-offset-4">Member Resources</Link>
          </CardContent>
        </Card>
      </div>
      <p className="mt-8 rounded-lg border border-border bg-card p-4 text-sm text-foreground">
        Workspace Navigator works without membership. Your licence is checked inside the app, offline, and is not connected to this account.
      </p>
    </>
  );
}
