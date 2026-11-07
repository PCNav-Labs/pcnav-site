// Cloudflare Turnstile for the in-page sign-in screens (WNM-8). The script is loaded only when a
// screen that needs it mounts, and only if a site key is configured (VITE_TURNSTILE_SITEKEY), so
// other pages and builds never contact Cloudflare. Tokens are single-use: reset after every submit.
// CSP needs https://challenges.cloudflare.com in script-src and frame-src (no unsafe-inline).
import { useEffect, useRef } from "react";

type Turnstile = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: Turnstile } }

const SITEKEY = (import.meta.env as Record<string, string | undefined>).VITE_TURNSTILE_SITEKEY || "";
export const captchaEnabled = SITEKEY !== "";

let loader: Promise<Turnstile> | null = null;
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("TURNSTILE_UNAVAILABLE")));
      s.onerror = () => { loader = null; reject(new Error("TURNSTILE_UNAVAILABLE")); };
      document.head.appendChild(s);
    });
  }
  return loader;
}

// Renders the check and reports its token ("" when there is none). Changing `resetKey` asks for a
// fresh token after a submission has used the previous one.
export function TurnstileWidget({ onToken, resetKey, onError }: { onToken: (t: string) => void; resetKey: number; onError: (msg: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadTurnstile().then(
      (t) => {
        if (cancelled || !box.current) return;
        id.current = t.render(box.current, {
          sitekey: SITEKEY,
          theme: "auto",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(""),
          "error-callback": () => { onToken(""); onError("The security check couldn't load. Refresh the page and try again."); },
        });
      },
      () => onError("The security check couldn't load. Check your connection and refresh the page."),
    );
    return () => { cancelled = true; if (id.current && window.turnstile) window.turnstile.remove(id.current); id.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (resetKey > 0 && id.current && window.turnstile) { onToken(""); window.turnstile.reset(id.current); }
  }, [resetKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div role="group" aria-labelledby="captcha-label">
      <p id="captcha-label" className="text-sm font-medium text-foreground">Security check</p>
      <div ref={box} className="mt-2 min-h-[65px]" data-testid="turnstile" />
    </div>
  );
}
