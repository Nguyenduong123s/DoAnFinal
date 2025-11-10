import DarkModeToggle from "@/components/dark-mode-toggle";
import DropdownAvatar from "@/app/[locale]/manage/dropdown-avatar";
import NavLinks from "@/app/[locale]/manage/nav-links";
import MobileNavLinks from "@/app/[locale]/manage/mobile-nav-links";
import WebsocketDebug from "@/components/websocket-debug";
import Breadcrumb from "@/app/[locale]/manage/breadcrumb";
import QuickActions from "@/app/[locale]/manage/quick-actions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-blue-950">
      <NavLinks />
      <div className="flex flex-col sm:gap-3 sm:py-3 sm:pl-16">
        {/* Compact Header */}
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-4 sm:backdrop-blur-none dark:border-border/20">
          <MobileNavLinks />

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <Breadcrumb />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <QuickActions />
            <div className="h-4 w-px bg-border" />
            <DarkModeToggle />
            <DropdownAvatar />
          </div>
        </header>

        {/* Main Content - Compact spacing */}
        <main className="flex-1 space-y-4 px-3 sm:px-4">{children}</main>
      </div>
      <WebsocketDebug />
    </div>
  );
}
