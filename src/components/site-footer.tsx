import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Mail } from "lucide-react";
import { MEMBERSHIP_ENABLED } from "@/account/mode";
import { PUBLISHER } from "@/lib/releases";

// Publisher and contact: Owner decision D6 (2026-11-08). Account: Owner decision D4 — reached from
// here, marked Coming Soon, only in builds that include the membership scaffolding.
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-surface/50 sm:mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-base font-semibold"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" aria-hidden="true" />
            </span>
            PCNav
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Practical Windows software for understanding your computer and keeping your work in
            order.
          </p>
          <p className="mt-4 text-sm">
            <a
              href={`mailto:${PUBLISHER.contact}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {PUBLISHER.contact}
            </a>
          </p>
        </div>

        <FooterCol title="Workspace Navigator">
          <FooterLink to="/workspace-navigator">Overview</FooterLink>
          <FooterLink to="/workspace-navigator/download">Beta release</FooterLink>
          <FooterLink to="/workspace-navigator/concept-video-transcript">
            Video transcript
          </FooterLink>
          <FooterLink to="/feedback/workspace-navigator">Feedback</FooterLink>
        </FooterCol>

        <FooterCol title="OS Map">
          <FooterLink to="/os-map">Overview</FooterLink>
          <FooterLink to="/os-map/download">Beta release</FooterLink>
          <FooterLink to="/feedback/os-map">Feedback</FooterLink>
        </FooterCol>

        <FooterCol title="PCNav">
          <FooterLink to="/about">About</FooterLink>
          <FooterLink to="/feedback">Feedback</FooterLink>
          {MEMBERSHIP_ENABLED && (
            <Link
              to="/account"
              className="inline-flex flex-wrap items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Account
              <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-foreground">
                Coming Soon
              </span>
            </Link>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 {PUBLISHER.name} All rights reserved.</p>
          <p>PCNav is a brand of {PUBLISHER.name}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <div>
      <h2 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground">
      {children}
    </Link>
  );
}
