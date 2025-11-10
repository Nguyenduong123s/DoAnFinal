"use client";
import menuItems from "@/app/[locale]/manage/menuItems";
import { useAppStore } from "@/components/app-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Package2, Settings, Sparkles } from "lucide-react";
import { Link, usePathname } from "@/navigation";

export default function NavLinks() {
  const pathname = usePathname();
  const role = useAppStore((state) => state.role);

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:flex dark:border-border/20 dark:bg-slate-950/95">
        {/* Brand */}
        <div className="border-b border-border/40 p-2 dark:border-border/20">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Big Boy Restaurant</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col items-center gap-2 px-2 py-4">
          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            if (!Item.roles.includes(role as any)) return null;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105",
                      {
                        "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg dark:from-blue-600 dark:to-purple-700":
                          isActive,
                        "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50":
                          !isActive,
                      }
                    )}
                  >
                    <Item.Icon className="h-5 w-5" />
                    <span className="sr-only">{Item.title}</span>
                    {isActive && (
                      <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center">
                        <Sparkles className="h-2 w-2 text-yellow-300 animate-pulse" />
                      </div>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  <div className="flex items-center gap-2">
                    <Item.Icon className="h-4 w-4" />
                    {Item.title}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <nav className="mt-auto flex flex-col items-center gap-2 px-2 py-4 border-t border-border/40 dark:border-border/20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105",
                  {
                    "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg dark:from-gray-600 dark:to-gray-700":
                      pathname === "/manage/setting",
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50":
                      pathname !== "/manage/setting",
                  }
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Cài đặt
              </div>
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
