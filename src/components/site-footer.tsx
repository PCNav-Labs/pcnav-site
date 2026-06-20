import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

const GITHUB_URL = "https://github.com/PCNav-Labs/pcnav";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold">
            <Compass className="h-5 w-5 text-primary" /> PCNav
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Navigate technology with confidence.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            An independent project by PCNav Labs.
          </p>
        </div>

        <FooterCol title="Site">
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/about">About</FooterLink>
        </FooterCol>

        <FooterCol title="Product">
          <FooterLink to="/os-map">OS Map</FooterLink>
          <FooterLink to="/download">Release</FooterLink>
        </FooterCol>

        <FooterCol title="Project">
          <FooterLink to="/feedback">Feedback</FooterLink>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </FooterCol>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>No telemetry. No analytics. Local logs only.</p>
          <p>© {new Date().getFullYear()} PCNav</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">{Array.isArray(children) ? children.map((c, i) => <li key={i}>{c}</li>) : <li>{children}</li>}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
      {children}
    </Link>
  );
}
