import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANNOUNCEMENTS, CATALOGUE, RESOURCES, memberData, type Interest } from "@/account/data";
import { ErrorNote, Gate, Loading, PageTitle } from "@/account/ui";

export const Route = createFileRoute("/account/resources")({
  head: () => ({ meta: [{ title: "Member Resources | PCNav Account" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: () => (<Gate section="Member Resources"><ResourcesPage /></Gate>),
});

const nameOf = (id: string) => CATALOGUE.find((p) => p.id === id)?.name ?? id;

function ResourcesPage() {
  const interests = useQuery({ queryKey: ["interests"], queryFn: memberData.interests, retry: false });
  const priv = useQuery({ queryKey: ["private-resources"], queryFn: memberData.privateResources, retry: false });
  const title = (<PageTitle eyebrow="Member Resources" title="Member Resources"><p>Announcements and the product information already published on PCNav.net, gathered in one place. Products you follow come first.</p></PageTitle>);
  if (interests.isPending) return <>{title}<Loading label="Loading member resources" /></>;
  if (interests.isError) return <>{title}<ErrorNote message="We couldn't load member resources." onRetry={() => interests.refetch()} /></>;
  const followed = new Set(interests.data.map((i: Interest) => i.productId));
  const ordered = [...RESOURCES].sort((a, b) => Number(followed.has(b.productId)) - Number(followed.has(a.productId)));

  return (
    <>
      {title}

      <section aria-labelledby="announcements" className="mb-10">
        <h2 id="announcements" className="font-display text-2xl font-semibold">Announcements</h2>
        <p className="mt-1 text-sm text-muted-foreground">Shown to members. This information is also public.</p>
        <ul className="mt-4 space-y-3">
          {ANNOUNCEMENTS.map((a) => (
            <li key={a.id} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground"><time dateTime={a.date}>{new Date(`${a.date}T12:00:00`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</time></p>
              <h3 className="mt-1 font-medium text-foreground">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.body} {a.to && <InternalLink to={a.to}>Read more<span className="sr-only">: {a.title}</span></InternalLink>}</p>
            </li>
          ))}
        </ul>
      </section>

      {ordered.map((r) => (
        <section key={r.productId} aria-labelledby={`res-${r.productId}`} className="mb-10">
          <h2 id={`res-${r.productId}`} className="flex flex-wrap items-center gap-2 font-display text-2xl font-semibold">
            {nameOf(r.productId)} {followed.has(r.productId) && <Badge variant="secondary">Following</Badge>}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {r.groups.map((g) => (
              <Card key={g.heading}>
                <CardHeader><CardTitle className="text-base"><h3>{g.heading}</h3></CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {g.items.map((i) => (<li key={i.to}><InternalLink to={i.to}>{i.label}</InternalLink> <span className="text-muted-foreground">(public)</span></li>))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          {r.productId === "workspace-navigator" && (
            <p className="mt-3 text-sm text-muted-foreground">More documentation and tutorials will be published on workspacenavigator.com when that site opens.</p>
          )}
        </section>
      ))}

      <section aria-labelledby="private" className="mb-4">
        <h2 id="private" className="font-display text-2xl font-semibold">Private resources</h2>
        <p className="mt-1 text-sm text-muted-foreground">Private resources are released only by PCNav's member service to signed-in members, never by this page.</p>
        <div className="mt-4" data-testid="private-resources">
          {priv.isPending ? <Loading label="Checking for private resources" />
            : priv.isError ? <ErrorNote message="We couldn't check for private resources." onRetry={() => priv.refetch()} />
            : priv.data.resources.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-foreground">There are no private resources yet.</p>
            : null}
        </div>
      </section>
    </>
  );
}

// In-app links keep the in-memory session; a full page load would end it.
function InternalLink({ to, children }: { to: string; children: React.ReactNode }) {
  const [path, hash] = to.split("#");
  return <Link to={path} hash={hash} className="text-primary underline underline-offset-4">{children}</Link>;
}
