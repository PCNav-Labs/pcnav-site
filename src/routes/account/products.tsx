import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATALOGUE, memberData, type Interest } from "@/account/data";
import { ErrorNote, Gate, Loading, PageTitle } from "@/account/ui";

export const Route = createFileRoute("/account/products")({
  head: () => ({ meta: [{ title: "My Products | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (<Gate section="My Products"><ProductsPage /></Gate>),
});

// Purchased and Licensed are fixed statements. They are never computed from
// membership or from Following, and no purchase or licence data exists here.
const PURCHASED = "Not connected. Purchases aren't linked to PCNav accounts.";
const LICENSED = "Not connected. Licences are checked inside the app, offline.";

function ProductsPage() {
  const qc = useQueryClient();
  const interests = useQuery({ queryKey: ["interests"], queryFn: memberData.interests, retry: false });
  const [announce, setAnnounce] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const title = (<PageTitle eyebrow="My Products" title="My Products"><p>Follow the products you're interested in. Following is free and doesn't buy, license or install anything.</p></PageTitle>);
  if (interests.isPending) return <>{title}<Loading label="Loading your products" /></>;
  if (interests.isError) return <>{title}<ErrorNote message="We couldn't load your products." onRetry={() => interests.refetch()} /></>;
  const following = new Map(interests.data.map((i: Interest) => [i.productId, i.since]));

  async function toggle(id: string, name: string) {
    setBusy(id); setError(""); setAnnounce("");
    try {
      const was = following.has(id);
      const next = was ? await memberData.unfollow(id) : await memberData.follow(id);
      qc.setQueryData(["interests"], next);
      setAnnounce(was ? `You're no longer following ${name}.` : `Following ${name}.`);
    } catch { setError(`We couldn't update ${name}. Try again.`); }
    finally { setBusy(""); }
  }

  return (
    <>
      {title}
      <p role="status" className="sr-only" data-testid="follow-announce">{announce}</p>
      {error && <div className="mb-4"><ErrorNote message={error} /></div>}
      <ul className="grid gap-6">
        {CATALOGUE.map((p) => {
          const since = following.get(p.id);
          return (
            <li key={p.id}>
              <Card data-product={p.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
                  <div>
                    <CardTitle className="flex flex-wrap items-center gap-2 text-xl"><h2>{p.name}</h2><Badge variant="outline">{p.status}</Badge></CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  </div>
                  <Button
                    variant={since ? "secondary" : "default"}
                    aria-pressed={!!since}
                    aria-label={since ? `Following ${p.name}` : `Follow ${p.name}`}
                    disabled={busy === p.id}
                    onClick={() => toggle(p.id, p.name)}
                    data-testid={`follow-${p.id}`}
                  >
                    {since ? "Following" : "Follow"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-lg border border-border p-3"><dt className="font-medium text-foreground">Following</dt><dd className="mt-1 text-muted-foreground" data-testid={`following-${p.id}`}>{since ? `Yes, since ${new Date(since).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}` : "No"}</dd></div>
                    <div className="rounded-lg border border-border p-3"><dt className="font-medium text-foreground">Purchased</dt><dd className="mt-1 text-muted-foreground" data-testid={`purchased-${p.id}`}>{PURCHASED}</dd></div>
                    <div className="rounded-lg border border-border p-3"><dt className="font-medium text-foreground">Licensed</dt><dd className="mt-1 text-muted-foreground" data-testid={`licensed-${p.id}`}>{LICENSED}</dd></div>
                  </dl>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {p.links.map((l) => (<li key={l.to}><Link to={l.to} className="text-primary underline underline-offset-4">{l.label}<span className="sr-only">: {p.name}</span></Link></li>))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
