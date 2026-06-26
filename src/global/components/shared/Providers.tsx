"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "@/global/components/ui/tooltip";
import { Toaster } from "@/global/components/ui/sonner";

/**
 * App-wide client providers. Kept minimal - there is no server state to cache
 * (everything is local), so no data-fetching provider is needed.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      <Toaster />
    </ThemeProvider>
  );
}
