import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Compass, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

// Main navigation: Workspace Navigator | OS Map | Feedback ▾ | About, with a Download action.
// The PCNav mark links home. Account is reached from the footer while membership is Coming Soon
// (Owner decision D4, 2026-11-08); its pages are unchanged.
const NAV = [
  { to: "/workspace-navigator", label: "Workspace Navigator" },
  { to: "/os-map", label: "OS Map" },
] as const;

const NAV_AFTER_FEEDBACK = [{ to: "/about", label: "About" }] as const;

const FEEDBACK = [
  { to: "/feedback/workspace-navigator", label: "Workspace Navigator" },
  { to: "/feedback/os-map", label: "OS Map" },
] as const;

const DESKTOP_LINK =
  "rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:px-3";
const DESKTOP_LINK_ACTIVE = "rounded-md px-2 py-2 text-sm text-foreground font-medium lg:px-3";
const MOBILE_LINK =
  "rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground";
const MOBILE_LINK_ACTIVE =
  "rounded-md px-3 py-2 text-sm bg-accent text-accent-foreground font-medium";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const feedbackActive = pathname === "/feedback" || pathname.startsWith("/feedback/");

  const desktopLink = (item: { to: string; label: string }) => (
    <Link
      key={item.to}
      to={item.to}
      className={DESKTOP_LINK}
      activeProps={{ className: DESKTOP_LINK_ACTIVE }}
    >
      {item.label}
    </Link>
  );

  const mobileLink = (item: { to: string; label: string }, extra?: string) => (
    <Link
      key={item.to}
      to={item.to}
      onClick={() => setOpen(false)}
      className={cn(MOBILE_LINK, extra)}
      activeProps={{ className: cn(MOBILE_LINK_ACTIVE, extra) }}
      activeOptions={{ exact: item.to === "/" }}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight"
          aria-label="PCNav home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          PCNav
        </Link>

        <nav
          aria-label="Main"
          className="ml-4 hidden items-center gap-1 whitespace-nowrap md:flex lg:ml-6"
        >
          {NAV.map(desktopLink)}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className={cn(
                feedbackActive ? DESKTOP_LINK_ACTIVE : DESKTOP_LINK,
                "inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Feedback
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[12rem]">
              {FEEDBACK.map((item) => (
                <DropdownMenuItem key={item.to} asChild className="cursor-pointer">
                  <Link to={item.to}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV_AFTER_FEEDBACK.map(desktopLink)}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/workspace-navigator/download">
              <Download aria-hidden="true" /> Download
            </Link>
          </Button>
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-display">PCNav</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
                {mobileLink({ to: "/", label: "Home" })}
                {NAV.map((item) => mobileLink(item))}
                <div
                  role="group"
                  aria-labelledby="mobile-feedback-heading"
                  className="flex flex-col gap-1"
                >
                  <p
                    id="mobile-feedback-heading"
                    className={cn(
                      "px-3 pt-2 text-sm",
                      feedbackActive ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Feedback
                  </p>
                  {FEEDBACK.map((item) => mobileLink(item, "ml-3"))}
                </div>
                {NAV_AFTER_FEEDBACK.map((item) => mobileLink(item))}
              </nav>
              <Button asChild className="mt-6 w-full">
                <Link to="/workspace-navigator/download" onClick={() => setOpen(false)}>
                  <Download aria-hidden="true" /> Download Workspace Navigator
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
