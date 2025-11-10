import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DarkModeToggle from "@/components/dark-mode-toggle";
import NavItems from "@/app/[locale]/(public)/nav-items";
import SwitchLanguage from "@/components/switch-language";
import { Link } from "@/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
export default function Layout({
  children,
  modal,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <header className="sticky z-20 top-0 flex h-20 items-center gap-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 shadow-lg backdrop-blur-sm px-4 md:px-6 border-b border-transparent dark:border-slate-600/50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-8 md:text-sm lg:gap-10">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-white hover:text-orange-100 dark:text-slate-100 dark:hover:text-slate-300 transition-colors duration-300"
          >
            <div className="relative">
              <Package2 className="h-8 w-8 text-white dark:text-slate-100 drop-shadow-lg" />
              <div className="absolute -inset-1 bg-white/20 dark:bg-slate-400/20 rounded-full blur-sm"></div>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <NavItems className="text-white/90 hover:text-white dark:text-slate-200/90 dark:hover:text-slate-100 transition-all duration-300 hover:scale-105 font-medium flex-shrink-0" />
          </div>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 md:hidden text-white hover:bg-white/20 hover:text-white dark:text-slate-100 dark:hover:bg-slate-700/50 dark:hover:text-slate-100 border-white/30 dark:border-slate-500/30"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-gradient-to-b from-orange-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 border-r-orange-200 dark:border-r-slate-700"
          >
            <nav className="grid gap-8 text-lg font-medium mt-8">
              <Link
                href="/"
                className="flex items-center gap-3 text-xl font-bold text-orange-600 hover:text-red-600 dark:text-slate-100 dark:hover:text-slate-300 transition-colors duration-300"
              >
                <Package2 className="h-8 w-8" />
                <span>Big Boy</span>
              </Link>
              <div className="grid gap-4 mt-4">
                <NavItems className="text-gray-700 hover:text-orange-600 dark:text-slate-300 dark:hover:text-slate-100 transition-colors duration-300 font-medium" />
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 dark:border-slate-600/50">
            <SwitchLanguage />
            <div className="w-px h-6 bg-white/30 dark:bg-slate-400/50"></div>
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 w-full">
        {children}
        {modal}
      </main>
    </div>
  );
}
