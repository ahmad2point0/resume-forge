"use client";

import type { ContactFieldKey } from "@/global/@types";
import { ALL_CONTACT_FIELDS, templateContactFields } from "@/global/templates";

import { useEditorStore } from "../../../store/editor.store";
import { TextField } from "../fields/Fields";

/** The three optional link fields, with their labels/placeholders. */
const LINK_FIELDS: Record<
  ContactFieldKey,
  { label: string; placeholder: string }
> = {
  website: { label: "Website", placeholder: "yoursite.dev" },
  linkedin: { label: "LinkedIn", placeholder: "linkedin.com/in/you" },
  github: { label: "GitHub", placeholder: "github.com/you" },
};

/** Editor for contact/identity basics. Always first; never reorderable. */
export function PersonalInfoSection() {
  const basics = useEditorStore((s) => s.resume?.data.basics);
  const updateBasics = useEditorStore((s) => s.updateBasics);
  const templateId = useEditorStore((s) => s.resume?.settings.templateId);

  if (!basics) return null;

  const supported = templateId
    ? templateContactFields(templateId)
    : ALL_CONTACT_FIELDS;
  const supportedSet = new Set(supported);
  const hidden = ALL_CONTACT_FIELDS.filter((f) => !supportedSet.has(f));

  return (
    <div className="space-y-3">
      <p className="text-[12px] text-muted-foreground">
        Keep contact details plain and parseable. No icons, no fancy formatting.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={basics.fullName}
          onChange={(v) => updateBasics({ fullName: v })}
          placeholder="Jordan Avery"
        />
        <TextField
          label="Job title"
          value={basics.jobTitle}
          onChange={(v) => updateBasics({ jobTitle: v })}
          placeholder="Senior Frontend Engineer"
        />
        <TextField
          label="Email"
          type="email"
          value={basics.email}
          onChange={(v) => updateBasics({ email: v })}
          placeholder="you@email.com"
        />
        <TextField
          label="Phone"
          value={basics.phone}
          onChange={(v) => updateBasics({ phone: v })}
          placeholder="(415) 555-0148"
        />
        <TextField
          label="Location"
          value={basics.location}
          onChange={(v) => updateBasics({ location: v })}
          placeholder="San Francisco, CA"
        />
        {/* Only show link inputs the current template actually renders. */}
        {ALL_CONTACT_FIELDS.filter((f) => supportedSet.has(f)).map((field) => (
          <TextField
            key={field}
            label={LINK_FIELDS[field].label}
            value={basics[field]}
            onChange={(v) => updateBasics({ [field]: v })}
            placeholder={LINK_FIELDS[field].placeholder}
          />
        ))}
      </div>
      {hidden.length > 0 && (
        <p className="text-[11.5px] text-muted-foreground">
          {`${hidden.map((f) => LINK_FIELDS[f].label).join(", ")} ${
            hidden.length === 1 ? "is" : "are"
          } hidden because this template doesn’t display ${
            hidden.length === 1 ? "it" : "them"
          }. Switch templates to add ${
            hidden.length === 1 ? "it" : "them"
          } back.`}
        </p>
      )}
    </div>
  );
}
