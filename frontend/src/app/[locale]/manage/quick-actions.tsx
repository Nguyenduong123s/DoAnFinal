"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Zap,
  ShoppingCart,
  Table,
  Salad,
  Users,
  Bell,
  Activity,
} from "lucide-react";
import { Link } from "@/navigation";
import { useTableListQuery } from "@/queries/useTable";
import { useDishListQuery } from "@/queries/useDish";

export default function QuickActions() {
  const tableListQuery = useTableListQuery();
  const dishListQuery = useDishListQuery();

  const tables = tableListQuery.data?.payload.data ?? [];
  const dishes = dishListQuery.data?.payload.data ?? [];

  // Quick stats
  const availableTables = tables.filter(
    (table) => table.status === "Available"
  ).length;
  const reservedTables = tables.filter(
    (table) => table.status === "Reserved"
  ).length;
  const availableDishes = dishes.filter(
    (dish) => dish.status === "Available"
  ).length;

  return (
    <div className="flex items-center gap-1.5">
      {/* Compact Quick Status */}
      <div className="hidden lg:flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
          <span className="text-muted-foreground">{availableTables}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 bg-orange-500 rounded-full"></div>
          <span className="text-muted-foreground">{reservedTables}</span>
        </div>
      </div>

      {/* Quick Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Zap className="h-3.5 w-3.5" />
            <span className="sr-only">Quick Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-semibold">Thao tác nhanh</p>
            <p className="text-xs text-muted-foreground">
              Shortcuts thường dùng
            </p>
          </div>
          <DropdownMenuSeparator />

          {/* Create Actions */}
          <DropdownMenuItem asChild>
            <Link href="/manage/dishes" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Thêm món ăn</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/manage/tables" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Thêm bàn ăn</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Quick Navigation */}
          <DropdownMenuItem asChild>
            <Link href="/manage/orders" className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Xem đơn hàng</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                Mới
              </Badge>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/manage/tables" className="flex items-center">
              <Table className="mr-2 h-4 w-4" />
              <span>Quản lý bàn</span>
              <div className="ml-auto flex items-center gap-1">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">{availableTables}</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/manage/dishes" className="flex items-center">
              <Salad className="mr-2 h-4 w-4" />
              <span>Quản lý món ăn</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {availableDishes} món
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* System Actions */}
          <DropdownMenuItem disabled>
            <Activity className="mr-2 h-4 w-4" />
            <span>Thống kê realtime</span>
            <Badge variant="outline" className="ml-auto text-xs">
              Sớm
            </Badge>
          </DropdownMenuItem>

          <DropdownMenuItem disabled>
            <Bell className="mr-2 h-4 w-4" />
            <span>Thông báo</span>
            <Badge variant="outline" className="ml-auto text-xs">
              Sớm
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
