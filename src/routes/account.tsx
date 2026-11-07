import { useEffect } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { identity } from "@/account/identity";
import { PrototypeNotice, SectionNav, useAccount } from "@/account/ui";
import { MEMBERSHIP_ENABLED } from "@/account/mode";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your PCNav Account | PCNav" },
      { name: "description", content: "Free PCNav membership. No purchase required." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (MEMBERSHIP_ENABLED ? <AccountLayout /> : <MembershipUnavailable />),
});

// With membership off (the default build), no account feature runs at all.
function MembershipUnavailable() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">PCNav accounts aren't available yet</h1>
      <p className="mt-4 text-muted-foreground">Free PCNav membership isn't open yet. Workspace Navigator and OS Map don't need an account.</p>
    </div>
  );
}

function AccountLayout() {
  const s = useAccount();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const member = s.status === "signed-in";
  const bare = ["/account/callback", "/account/signed-out", "/account/sign-in", "/account/join", "/account/forgot", "/account/verify", "/account/reset"].some((p) => pathname.startsWith(p));

  // Session restoration: one bounded, silent provider sign-in per page load (identity.restore).
  useEffect(() => { if (!bare) identity.restore(window.location.pathname); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PrototypeNotice />
      {member && !bare ? (
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
          <div>
            <SectionNav />
            <Button variant="outline" size="sm" className="mt-4 hidden lg:inline-flex" onClick={() => identity.signOut()}>Sign out</Button>
          </div>
          <div className="min-w-0">
            <Outlet />
            <Button variant="outline" size="sm" className="mt-10 lg:hidden" onClick={() => identity.signOut()}>Sign out</Button>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
