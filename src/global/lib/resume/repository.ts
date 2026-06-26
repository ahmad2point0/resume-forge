import type { Resume, ResumeSummary } from "@/global/@types";
import { storage, STORAGE_KEYS } from "@/global/lib/storage";
import { getCompleteness } from "@/global/lib/scoring";
import { createResume } from "@/global/constants";
import { nowIso } from "@/global/utils/date";

import { normalizeResume } from "./normalize";

/**
 * The single gateway for persisting resumes. Components and hooks never touch
 * `storage` directly - they go through this repository, which keeps a small
 * summary index in sync for fast dashboard listing.
 */

function toSummary(resume: Resume): ResumeSummary {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.settings.templateId,
    updatedAt: resume.updatedAt,
    createdAt: resume.createdAt,
    completeness: getCompleteness(resume.data),
  };
}

async function readIndex(): Promise<ResumeSummary[]> {
  return (await storage.get<ResumeSummary[]>(STORAGE_KEYS.resumeIndex)) ?? [];
}

async function writeIndex(index: ResumeSummary[]): Promise<void> {
  await storage.set(STORAGE_KEYS.resumeIndex, index);
}

async function upsertIndex(resume: Resume): Promise<void> {
  const index = await readIndex();
  const summary = toSummary(resume);
  const next = [summary, ...index.filter((r) => r.id !== resume.id)].sort(
    (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  );
  await writeIndex(next);
}

export const resumeRepository = {
  /** All resumes as lightweight summaries, most-recently-updated first. */
  async list(): Promise<ResumeSummary[]> {
    return readIndex();
  },

  async get(id: string): Promise<Resume | null> {
    return storage.get<Resume>(STORAGE_KEYS.resume(id));
  },

  /** Persist a resume document and refresh its summary in the index. */
  async save(resume: Resume): Promise<Resume> {
    const stamped: Resume = { ...resume, updatedAt: nowIso() };
    await storage.set(STORAGE_KEYS.resume(stamped.id), stamped);
    await upsertIndex(stamped);
    return stamped;
  },

  /** Create, persist, and return a brand-new empty resume. */
  async create(title?: string): Promise<Resume> {
    const resume = createResume(title ?? "Untitled resume");
    return this.save(resume);
  },

  /** Deep-copy an existing resume under a new id. */
  async duplicate(id: string): Promise<Resume | null> {
    const original = await this.get(id);
    if (!original) return null;
    const ts = nowIso();
    const copy: Resume = {
      ...structuredClone(original),
      id: createResume().id,
      title: `${original.title} (copy)`,
      createdAt: ts,
      updatedAt: ts,
    };
    return this.save(copy);
  },

  async rename(id: string, title: string): Promise<Resume | null> {
    const resume = await this.get(id);
    if (!resume) return null;
    return this.save({ ...resume, title });
  },

  async remove(id: string): Promise<void> {
    await storage.remove(STORAGE_KEYS.resume(id));
    const index = await readIndex();
    await writeIndex(index.filter((r) => r.id !== id));
  },

  /** Normalize arbitrary imported JSON into a valid resume and persist it. */
  async import(input: unknown): Promise<Resume> {
    return this.save(normalizeResume(input));
  },

  /** Serialize a resume to a pretty-printed `resume.json` string. */
  exportJson(resume: Resume): string {
    return JSON.stringify(
      { title: resume.title, data: resume.data, settings: resume.settings },
      null,
      2,
    );
  },

  /** Remember the last-opened resume so the builder can resume quickly. */
  async setLastOpened(id: string): Promise<void> {
    await storage.set(STORAGE_KEYS.lastOpened, id);
  },

  async getLastOpened(): Promise<string | null> {
    return storage.get<string>(STORAGE_KEYS.lastOpened);
  },
};

export type ResumeRepository = typeof resumeRepository;
