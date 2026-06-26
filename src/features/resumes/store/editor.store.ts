"use client";

import { create } from "zustand";

import type {
  Basics,
  Resume,
  ResumeData,
  ResumeSettings,
  SectionKey,
} from "@/global/@types";
import {
  createAchievementEntry,
  createCertificationEntry,
  createEducationEntry,
  createInterestEntry,
  createLanguageEntry,
  createProjectEntry,
  createPublicationEntry,
  createReferenceEntry,
  createSkillGroup,
  createWorkEntry,
} from "@/global/constants";
import { createShortId } from "@/global/utils/id";
import { resumeRepository } from "@/global/lib/resume";

/** List-backed section keys (everything except the single-block summary). */
export type ListSectionKey = Exclude<SectionKey, "summary">;

/** Minimal shape shared by every list entry - all we need to mutate generically. */
type Entry = { id: string };

/** Read a section's entry list with a single, contained cast. */
const getList = (d: ResumeData, section: ListSectionKey): Entry[] =>
  d[section] as unknown as Entry[];

/** Write a section's entry list back, preserving the rest of the data. */
const withList = (
  d: ResumeData,
  section: ListSectionKey,
  list: Entry[],
): ResumeData => ({ ...d, [section]: list }) as ResumeData;

/** Per-section factory for new blank entries. */
const ENTRY_FACTORIES: Record<ListSectionKey, () => Entry> = {
  work: createWorkEntry,
  education: createEducationEntry,
  projects: createProjectEntry,
  skills: createSkillGroup,
  certifications: createCertificationEntry,
  achievements: createAchievementEntry,
  publications: createPublicationEntry,
  languages: createLanguageEntry,
  interests: createInterestEntry,
  references: createReferenceEntry,
};

export type EditorStatus = "idle" | "loading" | "ready" | "saving" | "saved";

interface EditorState {
  resume: Resume | null;
  status: EditorStatus;
  dirty: boolean;
  lastSavedAt: string | null;
  /** Undo/redo snapshots of the whole resume document. */
  past: Resume[];
  future: Resume[];
  /** Timestamp of the last recorded history entry, for edit coalescing. */
  _lastHistoryAt: number;

  /* lifecycle */
  load: (id: string) => Promise<Resume | null>;
  setResume: (resume: Resume) => void;
  clear: () => void;
  markSaved: () => void;
  save: () => Promise<void>;

  /* content mutations */
  setTitle: (title: string) => void;
  updateBasics: (patch: Partial<Basics>) => void;
  addEntry: (section: ListSectionKey) => string;
  updateEntry: (section: ListSectionKey, id: string, patch: Record<string, unknown>) => void;
  removeEntry: (section: ListSectionKey, id: string) => void;
  duplicateEntry: (section: ListSectionKey, id: string) => void;
  reorderEntries: (section: ListSectionKey, fromIndex: number, toIndex: number) => void;

  /* settings mutations */
  updateSettings: (patch: Partial<ResumeSettings>) => void;
  reorderSections: (order: SectionKey[]) => void;
  toggleSectionVisibility: (section: SectionKey) => void;

  /* history */
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const HISTORY_LIMIT = 80;
const COALESCE_MS = 600;

function move<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const useEditorStore = create<EditorState>((set, get) => {
  /**
   * Apply a pure update to the current resume, recording history (with
   * time-based coalescing so a burst of keystrokes collapses to one undo step)
   * and flagging the document dirty for autosave.
   */
  function mutate(
    updater: (resume: Resume) => Resume,
    options: { commit?: boolean } = {},
  ) {
    const { resume, past, _lastHistoryAt } = get();
    if (!resume) return;

    const now = Date.now();
    const shouldRecord =
      options.commit || now - _lastHistoryAt > COALESCE_MS;

    const next = updater(resume);
    if (next === resume) return;

    set({
      resume: next,
      dirty: true,
      status: "ready",
      future: [],
      past: shouldRecord
        ? [...past, resume].slice(-HISTORY_LIMIT)
        : past,
      _lastHistoryAt: now,
    });
  }

  function mutateData(updater: (data: ResumeData) => ResumeData, commit = false) {
    mutate((resume) => ({ ...resume, data: updater(resume.data) }), { commit });
  }

  return {
    resume: null,
    status: "idle",
    dirty: false,
    lastSavedAt: null,
    past: [],
    future: [],
    _lastHistoryAt: 0,

    async load(id) {
      set({ status: "loading" });
      const resume = await resumeRepository.get(id);
      if (!resume) {
        set({ status: "idle" });
        return null;
      }
      void resumeRepository.setLastOpened(id);
      set({
        resume,
        status: "ready",
        dirty: false,
        past: [],
        future: [],
        lastSavedAt: resume.updatedAt,
      });
      return resume;
    },

    setResume(resume) {
      set({
        resume,
        status: "ready",
        dirty: false,
        past: [],
        future: [],
        lastSavedAt: resume.updatedAt,
      });
    },

    clear() {
      set({
        resume: null,
        status: "idle",
        dirty: false,
        past: [],
        future: [],
        lastSavedAt: null,
      });
    },

    markSaved() {
      set({ dirty: false, status: "saved", lastSavedAt: new Date().toISOString() });
    },

    async save() {
      const { resume } = get();
      if (!resume) return;
      set({ status: "saving" });
      const saved = await resumeRepository.save(resume);
      set({
        resume: saved,
        dirty: false,
        status: "saved",
        lastSavedAt: saved.updatedAt,
      });
    },

    setTitle(title) {
      mutate((r) => ({ ...r, title }), { commit: true });
    },

    updateBasics(patch) {
      mutateData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));
    },

    addEntry(section) {
      const entry = ENTRY_FACTORIES[section]();
      mutateData((d) => withList(d, section, [...getList(d, section), entry]), true);
      return entry.id;
    },

    updateEntry(section, id, patch) {
      mutateData((d) =>
        withList(
          d,
          section,
          getList(d, section).map((e) =>
            e.id === id ? { ...e, ...patch } : e,
          ),
        ),
      );
    },

    removeEntry(section, id) {
      mutateData(
        (d) => withList(d, section, getList(d, section).filter((e) => e.id !== id)),
        true,
      );
    },

    duplicateEntry(section, id) {
      mutateData((d) => {
        const list = getList(d, section);
        const idx = list.findIndex((e) => e.id === id);
        if (idx === -1) return d;
        const copy = { ...structuredClone(list[idx]), id: createShortId() };
        const next = list.slice();
        next.splice(idx + 1, 0, copy);
        return withList(d, section, next);
      }, true);
    },

    reorderEntries(section, from, to) {
      if (from === to) return;
      mutateData(
        (d) => withList(d, section, move(getList(d, section), from, to)),
        true,
      );
    },

    updateSettings(patch) {
      mutate(
        (r) => ({ ...r, settings: { ...r.settings, ...patch } }),
        { commit: true },
      );
    },

    reorderSections(order) {
      mutate(
        (r) => ({ ...r, settings: { ...r.settings, sectionOrder: order } }),
        { commit: true },
      );
    },

    toggleSectionVisibility(section) {
      mutate((r) => {
        const hidden = r.settings.hiddenSections;
        const next = hidden.includes(section)
          ? hidden.filter((s) => s !== section)
          : [...hidden, section];
        return { ...r, settings: { ...r.settings, hiddenSections: next } };
      }, { commit: true });
    },

    undo() {
      const { past, future, resume } = get();
      if (past.length === 0 || !resume) return;
      const previous = past[past.length - 1];
      set({
        resume: previous,
        past: past.slice(0, -1),
        future: [resume, ...future].slice(0, HISTORY_LIMIT),
        dirty: true,
        status: "ready",
      });
    },

    redo() {
      const { past, future, resume } = get();
      if (future.length === 0 || !resume) return;
      const next = future[0];
      set({
        resume: next,
        future: future.slice(1),
        past: [...past, resume].slice(-HISTORY_LIMIT),
        dirty: true,
        status: "ready",
      });
    },

    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,
  };
});
