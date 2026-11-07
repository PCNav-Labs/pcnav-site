import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { identity, type AccountState } from "./identity";
import { MfaChallengeForm } from "./forms";
import { ACCOUNT_CONFIG } from "./config";
import { REGISTRATION_OPEN } from "./mode";

const SERVER_STATE: AccountState = { status: "signed-out" };
export function useAccount(): AccountState {
  return useSyncExternalStore(identity.subscribe, identity.getState, () => SERVER_STATE);
}

export const SECTIONS = [
  { to: "/account", label: "Overview" },
  { to: "/account/profile", label: "My Profile" },
  { to: "/account/products", label: "My Products" },
  { to: "/account/resources", label: "Member Resources" },
] as const;

export function SectionNav() {
  return (
    <nav aria-label="Account sections" className="mb-8 lg:mb-0">
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {SECTIONS.map((s) => (
          <li key={s.to}>
            <Link
              to={s.to}
              activeOptions={{ exact: true }}
              className="block min-h-10 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeProps={{ className: "block min-h-10 rounded-md px-3 py-2 text-sm bg-accent font-medium text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "aria-current": "page" }}
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PrototypeNotice() {
  if (!ACCOUNT_CONFIG.prototype) return null;
  return (
    <p role="note" className="mb-6 flex items-start gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm text-foreground">
      <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{(import.meta.env as Record<string, string | undefined>).VITE_PCNAV_IDP === "supabase"
        ? <><strong>Test environment.</strong> Accounts here exist only on test services and may be deleted at any time.</>
        : <><strong>Prototype.</strong> Accounts on this page are simulated by local test services. No real account is created and no email is sent.</>}</span>
    </p>
  );
}

// After an in-app page change, the new page heading takes focus. On the first page of a
// load nothing is focused, so the skip link stays the first Tab stop.
let lastHeadingPath: string | null = null;

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const here = window.location.pathname;
    if (lastHeadingPath !== null && lastHeadingPath !== here) ref.current?.focus();
    lastHeadingPath = here;
  }, []);
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>}
      <h1 ref={ref} tabIndex={-1} className="mt-2 font-display text-3xl font-semibold tracking-tight outline-none sm:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}

export function Panel({ tone = "info", title, children, actions }: { tone?: "info" | "warning"; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <section aria-labelledby="panel-title" className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 id="panel-title" className="flex items-center gap-2 font-display text-xl font-semibold">
        {tone === "warning" ? <AlertTriangle aria-hidden="true" className="h-5 w-5 text-destructive" /> : <Info aria-hidden="true" className="h-5 w-5 text-primary" />}
        {title}
      </h2>
      {children && <div className="mt-2 text-muted-foreground">{children}</div>}
      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </section>
  );
}

export function JoinActions({ returnTo }: { returnTo?: string }) {
  return (
    <>
      {REGISTRATION_OPEN && <Button size="lg" onClick={() => identity.signIn({ screen: "signup", returnTo })}>Join Free</Button>}
      <Button size="lg" variant="outline" onClick={() => identity.signIn({ returnTo })}>Sign In</Button>
    </>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-3" data-state="loading">
      <p className="sr-only">{label}</p>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-destructive/60 bg-card p-4 text-sm" data-state="error">
      <p className="font-medium text-foreground">{message}</p>
      {onRetry && <Button className="mt-3" size="sm" variant="outline" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

// Gate: only a signed-in, verified member sees `children`. This decides what to SHOW;
// it protects nothing. Member data is authorized by the member API and the provider.
export function Gate({ section, children }: { section: string; children: ReactNode }) {
  const s = useAccount();
  const here = typeof window === "undefined" ? "/account" : window.location.pathname;
  if (s.status === "signed-in") return <>{children}</>;
  if (s.status === "loading") return <Loading label="Loading your account" />;
  if (s.status === "expired")
    return (
      <Panel tone="warning" title="Your session has ended" actions={<Button onClick={() => identity.signIn({ returnTo: here })}>Sign In again</Button>}>
        <p>For your security, you were signed out. Sign in again to continue to {section}.</p>
      </Panel>
    );
  if (s.status === "unverified") return <Unverified />;
  if (s.status === "mfa-required")
    return (
      <Panel title="Enter your authentication code">
        <MfaChallengeForm onDone={() => {}} />
      </Panel>
    );
  if (s.status === "error")
    return (
      <Panel tone="warning" title="Sign-in didn't complete" actions={<JoinActions returnTo={here} />}>
        <p>{s.message}</p>
      </Panel>
    );
  return (
    <Panel title={`Sign in to see ${section}`} actions={<JoinActions returnTo={here} />}>
      {s.message && <p role="status" className="text-foreground" data-testid="restore-notice">{s.message}</p>}
      <p>Free membership · No purchase required</p>
    </Panel>
  );
}

function Unverified() {
  const s = useAccount();
  const [sent, setSent] = useState<"" | "sent" | "failed">("");
  return (
    <Panel
      tone="warning"
      title="Verify your email to continue"
      actions={
        <>
          <Button onClick={() => identity.resendVerification().then(() => setSent("sent"), () => setSent("failed"))}>Resend verification email</Button>
          <Button variant="outline" onClick={() => identity.signOut()}>Sign out</Button>
          <p role="status" className="w-full text-sm text-foreground">{sent === "sent" ? `We sent a new verification link to ${s.claims?.email}.` : sent === "failed" ? "We couldn't send the link. Try again." : ""}</p>
        </>
      }
    >
      <p>We sent a verification link to <strong className="text-foreground">{s.claims?.email}</strong>. Open it, then sign in again. Your account area stays closed until your email is verified.</p>
    </Panel>
  );
}
