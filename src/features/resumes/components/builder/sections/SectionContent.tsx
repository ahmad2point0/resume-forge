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
  SectionKey,
  SkillGroup,
  WorkExperience,
} from "@/global/@types";

import type { ListSectionKey } from "../../../store/editor.store";
import { useEditorStore } from "../../../store/editor.store";
import { ListSection } from "./ListSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SummarySection } from "./SummarySection";
import {
  AchievementEditor,
  CertificationEditor,
  EducationEntryEditor,
  InterestEditor,
  LanguageEditor,
  ProjectEntryEditor,
  PublicationEditor,
  ReferenceEditor,
  SkillGroupEditor,
  WorkEntryEditor,
} from "./EntryEditors";

/** Stable empty fallback so selectors don't allocate a new array each render. */
const EMPTY: never[] = [];

function useEntries<T>(key: ListSectionKey): T[] {
  return useEditorStore((s) =>
    s.resume ? (s.resume.data[key] as unknown as T[]) : EMPTY,
  );
}

/** Renders the editor body for a given section key (no card chrome). */
export function SectionContent({ sectionKey }: { sectionKey: SectionKey }) {
  // Hooks must run unconditionally - read every list section up front.
  const work = useEntries<WorkExperience>("work");
  const education = useEntries<Education>("education");
  const projects = useEntries<Project>("projects");
  const skills = useEntries<SkillGroup>("skills");
  const certifications = useEntries<Certification>("certifications");
  const achievements = useEntries<Achievement>("achievements");
  const publications = useEntries<Publication>("publications");
  const languages = useEntries<Language>("languages");
  const interests = useEntries<Interest>("interests");
  const references = useEntries<Reference>("references");

  switch (sectionKey) {
    case "summary":
      return <SummarySection />;
    case "work":
      return (
        <ListSection
          sectionKey="work"
          entries={work}
          singular="Experience"
          renderEntry={(e, update) => <WorkEntryEditor entry={e} update={update} />}
          entryLabel={(e, i) =>
            [e.position, e.company].filter(Boolean).join(" · ") ||
            `Experience ${i + 1}`
          }
        />
      );
    case "education":
      return (
        <ListSection
          sectionKey="education"
          entries={education}
          singular="Education"
          renderEntry={(e, update) => (
            <EducationEntryEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.institution || `Education ${i + 1}`}
        />
      );
    case "projects":
      return (
        <ListSection
          sectionKey="projects"
          entries={projects}
          singular="Project"
          renderEntry={(e, update) => (
            <ProjectEntryEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.name || `Project ${i + 1}`}
        />
      );
    case "skills":
      return (
        <ListSection
          sectionKey="skills"
          entries={skills}
          singular="Skill group"
          renderEntry={(e, update) => (
            <SkillGroupEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.name || `Skill group ${i + 1}`}
        />
      );
    case "certifications":
      return (
        <ListSection
          sectionKey="certifications"
          entries={certifications}
          singular="Certification"
          renderEntry={(e, update) => (
            <CertificationEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.name || `Certification ${i + 1}`}
        />
      );
    case "achievements":
      return (
        <ListSection
          sectionKey="achievements"
          entries={achievements}
          singular="Achievement"
          renderEntry={(e, update) => (
            <AchievementEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.title || `Achievement ${i + 1}`}
        />
      );
    case "publications":
      return (
        <ListSection
          sectionKey="publications"
          entries={publications}
          singular="Publication"
          renderEntry={(e, update) => (
            <PublicationEditor entry={e} update={update} />
          )}
          entryLabel={(e, i) => e.title || `Publication ${i + 1}`}
        />
      );
    case "languages":
      return (
        <ListSection
          sectionKey="languages"
          entries={languages}
          singular="Language"
          renderEntry={(e, update) => <LanguageEditor entry={e} update={update} />}
          entryLabel={(e, i) => e.name || `Language ${i + 1}`}
        />
      );
    case "interests":
      return (
        <ListSection
          sectionKey="interests"
          entries={interests}
          singular="Interest"
          renderEntry={(e, update) => <InterestEditor entry={e} update={update} />}
          entryLabel={(e, i) => e.name || `Interest ${i + 1}`}
        />
      );
    case "references":
      return (
        <ListSection
          sectionKey="references"
          entries={references}
          singular="Reference"
          renderEntry={(e, update) => <ReferenceEditor entry={e} update={update} />}
          entryLabel={(e, i) => e.name || `Reference ${i + 1}`}
        />
      );
    default:
      return null;
  }
}

/** PersonalInfo is exported separately - it is fixed and not in section order. */
export { PersonalInfoSection };
