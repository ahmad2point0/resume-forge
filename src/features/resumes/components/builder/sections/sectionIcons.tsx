import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Languages,
  type LucideIcon,
  Sparkles,
  Trophy,
  User,
  Users,
} from "lucide-react";

/** Resolve a section's registry icon name to a lucide component. */
const ICONS: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Sparkles,
  BadgeCheck,
  Trophy,
  BookOpen,
  Languages,
  Heart,
  Users,
  User,
};

export function sectionIcon(name: string): LucideIcon {
  return ICONS[name] ?? FileText;
}
