"use client";

import type {
  Achievement,
  Certification,
  Education,
  Interest,
  Language,
  Project,
  Publication,
  Reference,
  SkillGroup,
  WorkExperience,
} from "@/global/@types";
import { ImproveButton } from "@/global/ai";

import {
  BulletsField,
  ChipsField,
  MonthField,
  SwitchField,
  TextField,
  TextareaField,
} from "../fields/Fields";

const row = "grid grid-cols-1 gap-3 sm:grid-cols-2";

export function WorkEntryEditor({
  entry,
  update,
}: {
  entry: WorkExperience;
  update: (patch: Partial<WorkExperience>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={row}>
        <TextField
          label="Job title"
          value={entry.position}
          onChange={(v) => update({ position: v })}
          placeholder="Senior Frontend Engineer"
        />
        <TextField
          label="Company"
          value={entry.company}
          onChange={(v) => update({ company: v })}
          placeholder="Stripe"
        />
      </div>
      <div className={row}>
        <TextField
          label="Location"
          value={entry.location}
          onChange={(v) => update({ location: v })}
          placeholder="San Francisco, CA"
        />
        <div className="grid grid-cols-2 gap-3">
          <MonthField
            label="Start"
            value={entry.startDate}
            onChange={(v) => update({ startDate: v })}
          />
          <MonthField
            label="End"
            value={entry.endDate}
            disabled={entry.current}
            onChange={(v) => update({ endDate: v })}
          />
        </div>
      </div>
      <SwitchField
        label="I currently work here"
        checked={entry.current}
        onChange={(c) => update({ current: c, endDate: c ? "" : entry.endDate })}
      />
      <BulletsField
        label="Highlights"
        value={entry.highlights}
        onChange={(v) => update({ highlights: v })}
        action={
          <ImproveButton
            kind="bullet"
            value={entry.highlights.join("\n")}
            onResult={(text) => update({ highlights: text.split("\n") })}
            label="Improve"
          />
        }
      />
    </div>
  );
}

export function EducationEntryEditor({
  entry,
  update,
}: {
  entry: Education;
  update: (patch: Partial<Education>) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Institution"
        value={entry.institution}
        onChange={(v) => update({ institution: v })}
        placeholder="University of California, Berkeley"
      />
      <div className={row}>
        <TextField
          label="Degree"
          value={entry.degree}
          onChange={(v) => update({ degree: v })}
          placeholder="B.S."
        />
        <TextField
          label="Field of study"
          value={entry.field}
          onChange={(v) => update({ field: v })}
          placeholder="Computer Science"
        />
      </div>
      <div className={row}>
        <div className="grid grid-cols-2 gap-3">
          <MonthField
            label="Start"
            value={entry.startDate}
            onChange={(v) => update({ startDate: v })}
          />
          <MonthField
            label="End"
            value={entry.endDate}
            disabled={entry.current}
            onChange={(v) => update({ endDate: v })}
          />
        </div>
        <TextField
          label="GPA (optional)"
          value={entry.gpa}
          onChange={(v) => update({ gpa: v })}
          placeholder="3.8"
        />
      </div>
      <SwitchField
        label="I currently study here"
        checked={entry.current}
        onChange={(c) => update({ current: c, endDate: c ? "" : entry.endDate })}
      />
      <BulletsField
        label="Notes (optional)"
        value={entry.highlights}
        onChange={(v) => update({ highlights: v })}
        hint="Coursework, honors, activities - one per line."
      />
    </div>
  );
}

export function ProjectEntryEditor({
  entry,
  update,
}: {
  entry: Project;
  update: (patch: Partial<Project>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={row}>
        <TextField
          label="Project name"
          value={entry.name}
          onChange={(v) => update({ name: v })}
          placeholder="openchart"
        />
        <TextField
          label="Link"
          value={entry.url}
          onChange={(v) => update({ url: v })}
          placeholder="github.com/you/project"
        />
      </div>
      <TextareaField
        label="Description"
        value={entry.description}
        rows={2}
        onChange={(v) => update({ description: v })}
        placeholder="A short description of the project and your role."
      />
      <BulletsField
        label="Highlights"
        value={entry.highlights}
        onChange={(v) => update({ highlights: v })}
        action={
          <ImproveButton
            kind="bullet"
            value={entry.highlights.join("\n")}
            onResult={(text) => update({ highlights: text.split("\n") })}
            label="Improve"
          />
        }
      />
      <ChipsField
        label="Tech / keywords"
        value={entry.keywords}
        onChange={(v) => update({ keywords: v })}
        placeholder="Type a technology and press Enter"
      />
    </div>
  );
}

export function SkillGroupEditor({
  entry,
  update,
}: {
  entry: SkillGroup;
  update: (patch: Partial<SkillGroup>) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Group name (optional)"
        value={entry.name}
        onChange={(v) => update({ name: v })}
        placeholder="Languages, Frameworks, Tools…"
      />
      <ChipsField
        label="Skills"
        value={entry.keywords}
        onChange={(v) => update({ keywords: v })}
        hint="These render as plain, parseable text."
      />
    </div>
  );
}

export function CertificationEditor({
  entry,
  update,
}: {
  entry: Certification;
  update: (patch: Partial<Certification>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={row}>
        <TextField
          label="Certification"
          value={entry.name}
          onChange={(v) => update({ name: v })}
          placeholder="AWS Certified Developer"
        />
        <TextField
          label="Issuer"
          value={entry.issuer}
          onChange={(v) => update({ issuer: v })}
          placeholder="Amazon Web Services"
        />
      </div>
      <div className={row}>
        <MonthField
          label="Date"
          value={entry.date}
          onChange={(v) => update({ date: v })}
        />
        <TextField
          label="Link (optional)"
          value={entry.url}
          onChange={(v) => update({ url: v })}
        />
      </div>
    </div>
  );
}

export function AchievementEditor({
  entry,
  update,
}: {
  entry: Achievement;
  update: (patch: Partial<Achievement>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={row}>
        <TextField
          label="Title"
          value={entry.title}
          onChange={(v) => update({ title: v })}
          placeholder="Hackathon Winner"
        />
        <MonthField
          label="Date"
          value={entry.date}
          onChange={(v) => update({ date: v })}
        />
      </div>
      <TextareaField
        label="Description"
        value={entry.description}
        rows={2}
        onChange={(v) => update({ description: v })}
      />
    </div>
  );
}

export function PublicationEditor({
  entry,
  update,
}: {
  entry: Publication;
  update: (patch: Partial<Publication>) => void;
}) {
  return (
    <div className="space-y-3">
      <TextField
        label="Title"
        value={entry.title}
        onChange={(v) => update({ title: v })}
      />
      <div className={row}>
        <TextField
          label="Publisher"
          value={entry.publisher}
          onChange={(v) => update({ publisher: v })}
        />
        <MonthField
          label="Date"
          value={entry.date}
          onChange={(v) => update({ date: v })}
        />
      </div>
      <TextField
        label="Link (optional)"
        value={entry.url}
        onChange={(v) => update({ url: v })}
      />
      <TextareaField
        label="Summary (optional)"
        value={entry.summary}
        rows={2}
        onChange={(v) => update({ summary: v })}
      />
    </div>
  );
}

export function LanguageEditor({
  entry,
  update,
}: {
  entry: Language;
  update: (patch: Partial<Language>) => void;
}) {
  return (
    <div className={row}>
      <TextField
        label="Language"
        value={entry.name}
        onChange={(v) => update({ name: v })}
        placeholder="Spanish"
      />
      <TextField
        label="Fluency"
        value={entry.fluency}
        onChange={(v) => update({ fluency: v })}
        placeholder="Professional"
      />
    </div>
  );
}

export function InterestEditor({
  entry,
  update,
}: {
  entry: Interest;
  update: (patch: Partial<Interest>) => void;
}) {
  return (
    <TextField
      label="Interest"
      value={entry.name}
      onChange={(v) => update({ name: v })}
      placeholder="Trail running"
    />
  );
}

export function ReferenceEditor({
  entry,
  update,
}: {
  entry: Reference;
  update: (patch: Partial<Reference>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className={row}>
        <TextField
          label="Name"
          value={entry.name}
          onChange={(v) => update({ name: v })}
        />
        <TextField
          label="Title / relationship"
          value={entry.title}
          onChange={(v) => update({ title: v })}
        />
      </div>
      <TextField
        label="Contact"
        value={entry.contact}
        onChange={(v) => update({ contact: v })}
        placeholder="email or phone"
      />
      <TextareaField
        label="Note (optional)"
        value={entry.reference}
        rows={2}
        onChange={(v) => update({ reference: v })}
      />
    </div>
  );
}
