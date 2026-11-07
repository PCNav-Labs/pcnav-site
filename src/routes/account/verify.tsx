import { PUBLIC_PREVIEW } from "@/account/mode";
import { SupportingPreview } from "@/account/preview";
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { identity } from "@/account/identity";
import { memberData } from "@/account/data";
import { AuthCard, NotDirect, messageFor } from "@/account/forms";
import { Loading } from "@/account/ui";

export const Route = createFileRoute("/account/verify")({
  head: () => ({ meta: [{ title: "Confirming | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (PUBLIC_PREVIEW ? <SupportingPreview title="Confirm your email"><p>When membership opens, the link in your confirmation email will bring you here to confirm your address.</p></SupportingPreview> : <Verify />),
});

function Verify() {
  const navigate = useNavigate();
  const once = useRef(false);
  const [outcome, setOutcome] = useState<"" | "pending" | "error">(""); const [message, setMessage] = useState("");
  useEffect(() => {
    if (once.current || !identity.direct) return; once.current = true;
    const q = new URLSearchParams(window.location.search);
    const tokenHash = q.get("token_hash") || ""; const type = q.get("type") || "";
    if (!tokenHash || !["signup", "email_change", "email"].includes(type)) { setOutcome("error"); setMessage("This link is invalid or has expired."); return; }
    identity.direct.verifyEmailLink(tokenHash, type as "signup" | "email_change" | "email").then(
      // A new member who has just verified sees the one optional onboarding page (WNM-9P A).
      (r) => (r === "email-change-pending" ? setOutcome("pending") : navigate({ to: type === "signup" && r === "signed-in" && memberData.optionalAnswers ? "/account/welcome" : "/account", replace: true })),
      (e) => { setOutcome("error"); setMessage(messageFor(e)); },
    );
  }, [navigate]);
  if (!identity.direct) return <NotDirect />;
  if (outcome === "pending") return <AuthCard title="One more step"><p role="status" className="text-sm text-foreground" data-testid="verify-pending">Confirmed. To finish the change, also open the link sent to your other email address.</p></AuthCard>;
  if (outcome === "error") return (
    <AuthCard title="Link not valid">
      <p role="alert" className="text-sm text-foreground" data-testid="verify-error">{message}</p>
      <p className="mt-4 text-sm"><Link to="/account/sign-in" className="text-primary underline underline-offset-4">Sign in</Link></p>
    </AuthCard>
  );
  return <AuthCard title="Confirming your email"><Loading label="Confirming your email" /></AuthCard>;
}
