import { Check } from "lucide-react";

const ITEMS = [
  "No telemetry",
  "No analytics",
  "No background update checks",
  "Local logs only",
];

export function PrivacyList() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {ITEMS.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary">
            <Check className="h-3.5 w-3.5" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
