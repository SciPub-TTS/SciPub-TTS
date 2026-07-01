import {
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  Globe2,
  Landmark,
  Tag,
  Trophy,
  UserRound,
  Waypoints,
  Workflow,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { SearchFilterWidgetKey } from "@/features/search/types";

export type SearchFilterWidgetDefinition = {
  description: string;
  icon: LucideIcon;
  key: SearchFilterWidgetKey;
  label: string;
};

export const searchFilterWidgetDefinitions: SearchFilterWidgetDefinition[] = [
  {
    key: "year",
    label: "Year",
    description: "Publication year range or exact year",
    icon: CalendarDays,
  },
  {
    key: "type",
    label: "Type",
    description: "Work type such as article or preprint",
    icon: Workflow,
  },
  {
    key: "openAccess",
    label: "Open Access",
    description: "Only include open-access works",
    icon: Globe2,
  },
  {
    key: "subField",
    label: "SubField",
    description: "Narrow results by subfield",
    icon: Waypoints,
  },
  {
    key: "author",
    label: "Author",
    description: "Find works by selected authors",
    icon: UserRound,
  },
  {
    key: "institution",
    label: "Institution",
    description: "Filter by affiliated institutions",
    icon: Building2,
  },
  {
    key: "pdf",
    label: "PDF",
    description: "Only include works with PDFs",
    icon: FileText,
  },
  {
    key: "country",
    label: "Country",
    description: "Limit results by country",
    icon: Landmark,
  },
  {
    key: "citation",
    label: "Citation Count",
    description: "Set a citation range or exact value",
    icon: BookOpen,
  },
  {
    key: "source",
    label: "Source",
    description: "Filter by journal or source",
    icon: Tag,
  },
  {
    key: "award",
    label: "Award",
    description: "Limit results by awards metadata",
    icon: Trophy,
  },
  {
    key: "indexedByOrcid",
    label: "Indexed by ORCID",
    description: "Require ORCID indexing condition",
    icon: BadgeCheck,
  },
];
