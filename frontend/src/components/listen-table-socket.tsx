"use client";

import { useAppStore } from "@/components/app-provider";
import { useInvalidateTableQueries } from "@/queries/useTable";
import { usePathname } from "@/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const MANAGEMENT_PATHS = ["/manage"];

export default function ListenTableSocket() {
  const pathname = usePathname();
  const socket = useAppStore((state) => state.socket);
  const {
    invalidateTableList,
    updateTableInCache,
    removeTableFromCache,
    updateTableStatusInCache,
  } = useInvalidateTableQueries();

  useEffect(() => {
    // Listen to table events on all management pages since table status can change from orders
    if (!MANAGEMENT_PATHS.some((path) => pathname.includes(path))) {
      console.log("⏭️ Not on management page, skipping table socket listeners");
      return;
    }
    if (!socket) {
      console.log("❌ No socket connection available");
      return;
    }

    console.log("✅ Setting up table socket listeners", {
      pathname,
      socketConnected: socket.connected,
      socketId: socket.id,
    });

    const handleTableCreated = (event: { type: string; data: any }) => {
      console.log("🔔 Table created:", event.data);
      // Force refresh instead of just updating cache
      invalidateTableList();
      // Only show toast on table management page
      if (pathname.includes("/manage/tables")) {
        toast({
          title: "✅ Bàn mới được tạo",
          description: `Bàn số ${event.data.number} đã được tạo thành công`,
          duration: 3000,
        });
      }
    };

    const handleTableUpdated = (event: { type: string; data: any }) => {
      console.log("🔔 Table updated:", event.data);
      // Force refresh instead of just updating cache
      invalidateTableList();
      // Only show toast on table management page
      if (pathname.includes("/manage/tables")) {
        toast({
          title: "📝 Bàn được cập nhật",
          description: `Bàn số ${event.data.number} đã được cập nhật`,
          duration: 3000,
        });
      }
    };

    const handleTableDeleted = (event: { type: string; data: any }) => {
      console.log("🔔 Table deleted:", event.data);
      // Force refresh instead of just updating cache
      invalidateTableList();
      // Only show toast on table management page
      if (pathname.includes("/manage/tables")) {
        toast({
          title: "🗑️ Bàn đã được xóa",
          description: `Bàn số ${event.data.number} đã được xóa`,
          duration: 3000,
        });
      }
    };

    const handleTableStatusUpdated = (event: {
      tableNumber: number;
      status: string;
    }) => {
      console.log("🔔 Table status updated:", event);

      // Force invalidate queries instead of just updating cache
      // This ensures UI refreshes properly
      invalidateTableList();

      // Show debug toast for realtime updates (show on all management pages for debugging)
      toast({
        title: "🔄 Trạng thái bàn cập nhật",
        description: `Bàn số ${event.tableNumber} → ${
          event.status === "Available"
            ? "Trống"
            : event.status === "Reserved"
            ? "Đã đặt"
            : event.status
        }`,
        duration: 3000,
        variant: "default",
      });
    };

    // Add payment event listener to trigger table status updates
    const handlePayment = (event: any) => {
      console.log("💰 Payment event received:", event);

      // Force refresh table list after payment
      invalidateTableList();

      // Payment completed, trigger table status refresh
      if (Array.isArray(event) && event.length > 0 && event[0].tableNumber) {
        toast({
          title: "💰 Thanh toán thành công",
          description: `Bàn số ${event[0].tableNumber} đã được thanh toán`,
          duration: 3000,
        });
      }
    };

    // Register socket listeners
    socket.on("table-created", handleTableCreated);
    socket.on("table-updated", handleTableUpdated);
    socket.on("table-deleted", handleTableDeleted);
    socket.on("table-status-updated", handleTableStatusUpdated);
    socket.on("payment", handlePayment);

    console.log("🔌 Table socket listeners registered");

    // Cleanup on unmount
    return () => {
      socket.off("table-created", handleTableCreated);
      socket.off("table-updated", handleTableUpdated);
      socket.off("table-deleted", handleTableDeleted);
      socket.off("table-status-updated", handleTableStatusUpdated);
      socket.off("payment", handlePayment);
      console.log("🔌 Table socket listeners removed");
    };
  }, [
    socket,
    pathname,
    updateTableInCache,
    removeTableFromCache,
    updateTableStatusInCache,
  ]);

  return null;
}
