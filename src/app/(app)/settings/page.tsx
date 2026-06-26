import type { Metadata } from "next";

import { SettingsPage } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Appearance, AI assistant, and local data management.",
};

export default function Settings() {
  return <SettingsPage />;
}
