import { Card, CardContent } from "@/components/ui/card";

export function PrincipleCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/70 bg-card/60 shadow-none">
      <CardContent className="p-6">
        <div className="font-display text-3xl font-semibold text-primary">
          {String(index).padStart(2, "0")}
        </div>
        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
