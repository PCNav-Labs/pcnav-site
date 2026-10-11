import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Compass, FileText, ChevronDown } from "lucide-react";
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

// Main navigation: Home | OS Map | Workspace Navigator | Feedback ▾ | About.
const NAV_BEFORE_FEEDBACK = [
  { to: "/", label: "Home" },
  { to: "/os-map", label: "OS Map" },
  { to: "/workspace-navigator", label: "Workspace Navigator" },
] as const;

const NAV_AFTER_FEEDBACK = [{ to: "/about", label: "About" }] as const;

const FEEDBACK = [
  { to: "/feedback/os-map", label: "OS Map" },
  { to: "/feedback/workspace-navigator", label: "Workspace Navigator" },
] as const;

const DESKTOP_LINK =
  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";
const DESKTOP_LINK_ACTIVE = "rounded-md px-3 py-2 text-sm text-foreground font-medium";
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
      activeOptions={{ exact: item.to === "/" }}
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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <Compass className="h-5 w-5 text-primary" />
          PCNav
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 whitespace-nowrap md:flex">
          {NAV_BEFORE_FEEDBACK.map(desktopLink)}
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
          <ThemeToggle />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/os-map/download">
              <FileText /> OS Map Release Details
            </Link>
          </Button>

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
                {NAV_BEFORE_FEEDBACK.map((item) => mobileLink(item))}
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
                <Button asChild className="mt-4">
                  <Link to="/os-map/download" onClick={() => setOpen(false)}>
                    <FileText /> OS Map Release Details
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
