"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps, toast } from "@/global/components/ui";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "value"> {
  value: string;
  label?: string;
  copiedLabel?: string;
  /** Toast message on success; pass null to disable the toast. */
  toastMessage?: string | null;
}

/** Copies `value` to the clipboard with brief in-button confirmation. */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  toastMessage = "Copied to clipboard",
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (toastMessage) toast.success(toastMessage);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn’t copy - please copy manually.");
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleCopy} {...props}>
      {copied ? <Check className="text-success" /> : <Copy />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
