"use client";
import { useAppStore } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { RoleType } from "@/types/jwt.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
  requireLogin?: boolean;
}[] = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "menu",
    href: "/guest/menu",
    role: [Role.Guest],
    requireLogin: true,
  },
  {
    title: "orders",
    href: "/guest/orders",
    role: [Role.Guest],
    requireLogin: true,
  },
  {
    title: "login",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "manage",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
    requireLogin: true,
  },
];

// Server: Món ăn, Đăng nhập. Do server không biết trạng thái đăng nhập của user
// CLient: Đầu tiên client sẽ hiển thị là Món ăn, Đăng nhập.
// Nhưng ngay sau đó thì client render ra là Món ăn, Đơn hàng, Quản lý do đã check được trạng thái đăng nhập

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error: any) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Check if user is authenticated (has any role)
        const isLoggedIn = !!role;

        // For items that require login but user is not logged in
        if (item.requireLogin && !isLoggedIn) {
          return null;
        }

        // For items that should only show when logged in with specific role
        if (item.role && isLoggedIn && !item.role.includes(role)) {
          return null;
        }

        // For items that should only show when NOT logged in
        if (item.hideWhenLogin && isLoggedIn) {
          return null;
        }

        // For items with specific roles - only show if user has the correct role
        const shouldShowRoleBasedItem =
          item.role && isLoggedIn && item.role.includes(role);

        // For items without role restrictions - show based on login status
        const shouldShowGeneralItem =
          !item.role && (!item.hideWhenLogin || !isLoggedIn);

        if (shouldShowRoleBasedItem || shouldShowGeneralItem) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          );
        }

        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>{t("logout")}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("logoutDialog.logoutQuestion")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("logoutDialog.logoutConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("logoutDialog.logoutCancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
