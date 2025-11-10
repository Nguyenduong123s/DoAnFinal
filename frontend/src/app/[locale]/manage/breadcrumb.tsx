"use client";

import { usePathname } from "@/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/navigation";
import menuItems from "@/app/[locale]/manage/menuItems";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Define breadcrumb mapping
  const breadcrumbMap: Record<string, { title: string; href?: string }[]> = {
    "/manage/dashboard": [{ title: "Dashboard" }],
    "/manage/orders": [{ title: "Đơn hàng" }],
    "/manage/tables": [{ title: "Bàn ăn" }],
    "/manage/dishes": [{ title: "Món ăn" }],
    "/manage/accounts": [{ title: "Nhân viên" }],
    "/manage/setting": [{ title: "Cài đặt" }],
  };

  const currentBreadcrumbs = breadcrumbMap[pathname] || [{ title: "Quản lý" }];

  // Find current page info
  const currentItem = menuItems.find((item) => item.href === pathname);

  return (
    <nav className="flex items-center space-x-1 text-xs sm:text-sm">
      {/* Home Link */}
      <Link
        href="/manage/dashboard"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent dark:hover:bg-accent/50"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
      </Link>

      {/* Breadcrumb Items */}
      {currentBreadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5 rounded truncate max-w-24 sm:max-w-none hover:bg-accent dark:hover:bg-accent/50"
            >
              {item.title}
            </Link>
          ) : (
            <span className="font-medium text-foreground px-1 py-0.5 truncate max-w-24 sm:max-w-none">
              {item.title}
            </span>
          )}
        </div>
      ))}

      {/* Current Page Icon */}
      {currentItem && (
        <div className="flex items-center ml-1">
          <div className="h-4 w-4 rounded bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <currentItem.Icon className="h-2.5 w-2.5 text-primary" />
          </div>
        </div>
      )}
    </nav>
  );
}
