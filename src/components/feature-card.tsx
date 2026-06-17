import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <Card className="h-full border-border/70 shadow-none">
      <CardContent className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
