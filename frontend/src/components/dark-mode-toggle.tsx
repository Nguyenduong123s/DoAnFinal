"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DarkModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-md bg-background/50 dark:bg-background/30 border border-border/40 dark:border-border/20 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 transition-all duration-200 backdrop-blur-sm"
        >
          <SunIcon className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-amber-400" />
          <MoonIcon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400 dark:text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/95 dark:bg-background/95 backdrop-blur-md border border-border/40 dark:border-border/20 rounded-lg shadow-lg min-w-[140px]"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer transition-colors duration-200"
        >
          <div className="flex items-center gap-3 w-full">
            <SunIcon className="h-4 w-4 text-amber-500" />
            <span className="font-medium">Sáng</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer transition-colors duration-200"
        >
          <div className="flex items-center gap-3 w-full">
            <MoonIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span className="font-medium">Tối</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer transition-colors duration-200"
        >
          <div className="flex items-center gap-3 w-full">
            <Monitor className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            <span className="font-medium">Hệ thống</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
