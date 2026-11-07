import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { identity } from "@/account/identity";
import { Loading, PageTitle } from "@/account/ui";

export const Route = createFileRoute("/account/callback")({
  head: () => ({ meta: [{ title: "Signing in | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Callback,
});

function Callback() {
  const navigate = useNavigate();
  const once = useRef(false);
  useEffect(() => {
    if (once.current) return; once.current = true;
    const search = window.location.search;
    // The router replaces this history entry on navigation, which removes the code and state from the URL.
    identity.handleCallback(search).then((to) => navigate({ to, replace: true }));
  }, [navigate]);
  return (
    <>
      <PageTitle title="Signing you in" />
      <Loading label="Signing you in" />
    </>
  );
}
