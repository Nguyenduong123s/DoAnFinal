import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  badge,
  children,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {badge && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
          {children}
          {actions}
        </div>
      )}
    </div>
  );
}
