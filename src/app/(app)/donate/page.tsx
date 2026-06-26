import type { Metadata } from "next";

import { DonatePage } from "@/features/support";

export const metadata: Metadata = {
  title: "Buy me a coffee",
  description: "Support resumeforge - a free, open-source, local-first resume builder.",
};

export default function Donate() {
  return <DonatePage />;
}
