"use client";

import * as React from "react";
import { useState } from "react";
import { X } from "lucide-react";

import { Input, Label, Switch, Textarea } from "@/global/components/ui";
import { cn } from "@/global/utils/cn";

/** Labeled field wrapper. */
export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
  action,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <Label htmlFor={htmlFor} className="text-[12px]">
              {label}
            </Label>
          )}
          {action}
        </div>
      )}
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  className,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  className?: string;
}) {
  const id = React.useId();
  return (
    <Field label={label} htmlFor={id} hint={hint} className={className}>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
  action,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  action?: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <Field label={label} htmlFor={id} hint={hint} action={action}>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

/** Native month picker producing a `YYYY-MM` string. */
export function MonthField({
  label,
  value,
  onChange,
  disabled,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const id = React.useId();
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        type="month"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-[12px] font-normal">
        {label}
      </Label>
    </div>
  );
}

/** Multiline bullets - one highlight per line. */
export function BulletsField({
  label,
  value,
  onChange,
  hint = "Use one bullet per line. Start with a verb; quantify impact.",
  action,
  rows = 4,
}: {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  action?: React.ReactNode;
  rows?: number;
}) {
  return (
    <TextareaField
      label={label}
      value={value.join("\n")}
      rows={rows}
      hint={hint}
      action={action}
      onChange={(text) => onChange(text.split("\n"))}
      placeholder={"Led a team of 5 to ship…\nImproved performance by 32%…"}
    />
  );
}

/** Tag/keyword input - type and press Enter to add a parseable chip. */
export function ChipsField({
  label,
  value,
  onChange,
  placeholder = "Type a skill and press Enter",
  hint,
}: {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const items = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;
    onChange([...value, ...items]);
    setDraft("");
  }

  return (
    <Field label={label} hint={hint}>
      <div className="rounded-md border border-input bg-background p-1.5 shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        {value.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {value.map((chip, i) => (
              <span
                key={`${i}-${chip}`}
                className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[12px] font-medium text-accent-foreground"
              >
                {chip}
                <button
                  type="button"
                  aria-label={`Remove ${chip}`}
                  onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                  className="text-accent-foreground/70 hover:text-accent-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          className="w-full bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </Field>
  );
}
