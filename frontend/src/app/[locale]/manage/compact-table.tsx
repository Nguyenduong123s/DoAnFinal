import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CompactTableProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export default function CompactTable({
  children,
  className,
  title,
  description,
  actions,
}: CompactTableProps) {
  return (
    <Card
      className={cn(
        "border-0 shadow-sm bg-card/50 dark:bg-card/30 backdrop-blur-sm",
        className
      )}
    >
      {(title || description || actions) && (
        <CardHeader className="px-4 py-3 border-b bg-muted/30 dark:bg-muted/10 dark:border-border/20">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              {title && (
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  );
}
