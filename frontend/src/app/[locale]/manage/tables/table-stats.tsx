"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTableListQuery } from "@/queries/useTable";
import { useMemo } from "react";
import { Table, Users, Clock, EyeOff } from "lucide-react";

export default function TableStats() {
  const tableListQuery = useTableListQuery();
  const tableList = tableListQuery.data?.payload.data ?? [];

  const stats = useMemo(() => {
    // Tính toán dựa trên trạng thái thực tế của bàn trong database
    const totalTables = tableList.length;
    const availableTables = tableList.filter(
      (table) => table.status === "Available"
    ).length;
    const reservedTables = tableList.filter(
      (table) => table.status === "Reserved"
    ).length;
    const hiddenTables = tableList.filter(
      (table) => table.status === "Hidden"
    ).length;

    return {
      total: totalTables,
      available: availableTables,
      reserved: reservedTables,
      hidden: hiddenTables,
    };
  }, [tableList]);

  const isLoading = tableListQuery.isPending;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Tổng số bàn */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Tổng số bàn
              </p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  stats.total
                )}
              </h3>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                Tất cả bàn trong hệ thống
              </p>
            </div>
            <div className="rounded-xl p-3 bg-blue-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Table className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bàn có sẵn */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                Bàn có sẵn
              </p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  stats.available
                )}
              </h3>
              {!isLoading && (
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  🟢 Sẵn sàng phục vụ khách
                </p>
              )}
            </div>
            <div className="rounded-xl p-3 bg-green-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đã đặt */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                Đã đặt
              </p>
              <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  stats.reserved
                )}
              </h3>
              {!isLoading && (
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70">
                  🟡 Đang có khách sử dụng
                </p>
              )}
            </div>
            <div className="rounded-xl p-3 bg-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bàn ẩn */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Bàn ẩn
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  stats.hidden
                )}
              </h3>
              {!isLoading && (
                <p className="text-xs text-gray-600/70 dark:text-gray-400/70">
                  ⚫ Tạm thời không sử dụng
                </p>
              )}
            </div>
            <div className="rounded-xl p-3 bg-gray-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <EyeOff className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
