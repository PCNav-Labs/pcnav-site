import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinActions, PageTitle } from "@/account/ui";
import { DELETED_KEY } from "@/account/identity";

export const Route = createFileRoute("/account/signed-out")({
  head: () => ({ meta: [{ title: "Signed out | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SignedOut,
});

function SignedOut() {
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    // One-time flag set just before the post-deletion logout redirect (works with any provider).
    let flag = false;
    try { flag = sessionStorage.getItem(DELETED_KEY) === "1"; sessionStorage.removeItem(DELETED_KEY); } catch { /* none */ }
    setDeleted(flag || new URLSearchParams(window.location.search).get("deleted") === "1");
  }, []);
  return (
    <section className="max-w-2xl">
      <PageTitle title={deleted ? "Your PCNav account is deleted" : "You're signed out"}>
        <p data-testid="signed-out-message">
          {deleted ? "Your profile and followed products are deleted. Workspace Navigator keeps working." : "You've signed out of your PCNav account on this device."}
        </p>
      </PageTitle>
      <div className="flex flex-wrap gap-3"><JoinActions /></div>
      <p className="mt-6 text-sm"><Link to="/" className="text-primary underline underline-offset-4">Return to the PCNav homepage</Link></p>
    </section>
  );
}
