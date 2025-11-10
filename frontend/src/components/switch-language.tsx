"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/config";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { Globe } from "lucide-react";

export default function SwitchLanguage() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        router.replace(pathname, {
          locale: value as Locale,
        });
        router.refresh();
      }}
    >
      <SelectTrigger className="w-[130px] h-10 bg-white/10 dark:bg-slate-700/50 border-white/30 dark:border-slate-500/50 text-white dark:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-600/50 transition-all duration-200 rounded-full backdrop-blur-sm focus:ring-2 focus:ring-white/50 dark:focus:ring-slate-400/50">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-white/80 dark:text-slate-200/80" />
          <SelectValue
            placeholder={t("title")}
            className="text-sm font-medium"
          />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-white/20 dark:border-slate-600/50 rounded-xl shadow-xl">
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem
              value={locale}
              key={locale}
              className="text-gray-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/70 focus:bg-orange-100 dark:focus:bg-slate-600/70 cursor-pointer rounded-lg mx-1 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 dark:from-slate-400 dark:to-slate-500"></div>
                <span className="font-medium">{t(locale)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
