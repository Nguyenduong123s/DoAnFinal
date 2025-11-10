"use client";
import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { useAppStore } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { toast } from "@/components/ui/use-toast";

export default function TableStatusGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const role = useAppStore((state) => state.role);
  const socket = useAppStore((state) => state.socket);

  useEffect(() => {
    if (role !== Role.Guest || !socket) return;

    const handleTableStatusUpdate = (data: {
      tableNumber: number;
      status: string;
      message?: string;
    }) => {
      if (data.status === "Hidden") {
        toast({
          title: "Bàn đã bị ẩn",
          description:
            data.message ||
            `Bàn ${data.tableNumber} đã bị ẩn. Bạn sẽ được chuyển về trang chủ.`,
          variant: "destructive",
        });

        // Chuyển về trang chủ sau 3 giây
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    const handleForceLogout = (data: { message: string }) => {
      toast({
        title: "Đã bị đăng xuất",
        description: data.message,
        variant: "destructive",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    };

    socket.on("table-status-updated", handleTableStatusUpdate);
    socket.on("force-logout", handleForceLogout);

    return () => {
      socket.off("table-status-updated", handleTableStatusUpdate);
      socket.off("force-logout", handleForceLogout);
    };
  }, [role, socket, router]);

  return <>{children}</>;
}
