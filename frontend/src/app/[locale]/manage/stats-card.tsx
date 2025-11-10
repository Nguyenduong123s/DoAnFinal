import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn("relative overflow-hidden border-0 shadow-sm", className)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-xl font-bold text-foreground">{value}</h3>
              {trend && (
                <Badge
                  variant={trend.isPositive ? "default" : "destructive"}
                  className="text-xs px-1 py-0"
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          <div className={cn("rounded-full p-2", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
