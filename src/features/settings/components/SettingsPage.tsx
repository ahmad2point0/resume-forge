"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Database, Download, Monitor, Moon, Sparkles, Sun, Trash2 } from "lucide-react";

import { AiSettingsForm } from "@/global/ai";
import { resumeRepository } from "@/global/lib/resume";
import { storage } from "@/global/lib/storage";
import { downloadFile } from "@/global/utils/download";
import { useHydrated } from "@/global/hooks";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from "@/global/components/ui";
import { ConfirmDialog } from "@/global/components/shared";
import { cn } from "@/global/utils/cn";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const [confirmClear, setConfirmClear] = useState(false);

  async function exportAll() {
    const summaries = await resumeRepository.list();
    if (summaries.length === 0) {
      toast.error("No resumes to export yet.");
      return;
    }
    const full = await Promise.all(
      summaries.map((s) => resumeRepository.get(s.id)),
    );
    downloadFile(
      `resumeforge-backup.json`,
      JSON.stringify({ resumes: full.filter(Boolean) }, null, 2),
    );
    toast.success(`Exported ${summaries.length} resume(s)`);
  }

  async function clearAll() {
    await storage.clear();
    toast.success("All local data cleared");
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Preferences and data live only in this browser.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how resumeforge looks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 sm:max-w-sm">
              {THEMES.map((t) => {
                const active = hydrated && theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-[12.5px] font-medium transition-colors",
                      active
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <t.icon className="size-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI assistant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> AI assistant
            </CardTitle>
            <CardDescription>
              Optional. Bring your own API key to generate summaries and improve
              bullet points. Requests go directly from your browser to the
              provider - resumeforge has no server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiSettingsForm />
          </CardContent>
        </Card>

        {/* Data & privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-4 text-primary" /> Data &amp; privacy
            </CardTitle>
            <CardDescription>
              Your resumes are stored locally with IndexedDB and never leave this
              device. Export a backup any time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={exportAll}>
              <Download className="size-4" /> Export all resumes
            </Button>
            <Button variant="destructive" onClick={() => setConfirmClear(true)}>
              <Trash2 className="size-4" /> Clear all local data
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear all local data?"
        description="This permanently deletes every resume stored in this browser. Export a backup first if you want to keep anything. This cannot be undone."
        confirmLabel="Delete everything"
        destructive
        onConfirm={clearAll}
      />
    </div>
  );
}
