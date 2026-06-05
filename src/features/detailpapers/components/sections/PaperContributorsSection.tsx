import { Users } from "lucide-react";

import EntityCanvasLink from "@/features/entity-canvas/components/EntityCanvasLink";

import type { PaperDetailAuthor, PaperDetailInstitution } from "../../types";
import type { PaperContributorsSectionData } from "../../view-models/contributorsSection";
import DetailSectionCard from "./DetailSectionCard";

export default function PaperContributorsSection({
  section,
}: {
  section: PaperContributorsSectionData;
}) {
  return (
    <DetailSectionCard
      icon={<Users className="h-5 w-5" />}
      title="Authors & Institutions"
    >
      <AuthorList authors={section.authors} />
      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          Institutions
        </h3>
        <InstitutionList institutions={section.institutions} />
      </div>
    </DetailSectionCard>
  );
}

function AuthorList({ authors }: { authors: PaperDetailAuthor[] }) {
  if (authors.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Author information is not available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {authors.map((author) => (
        <div
          key={author.id}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-700"
        >
          {author.entityId ? (
            <EntityCanvasLink
              entityId={author.entityId}
              entityType="author"
              label={author.name}
              className="cursor-pointer text-[1.02rem] font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-900 hover:decoration-blue-700"
            >
              {author.name}
            </EntityCanvasLink>
          ) : (
            <span className="text-[1.02rem] font-semibold text-slate-900">
              {author.name}
            </span>
          )}
          {author.position ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {formatAuthorPosition(author.position)}
            </span>
          ) : null}
          {author.isCorresponding ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Corresponding
            </span>
          ) : null}
          {author.isFollowed ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Following
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InstitutionList({
  institutions,
}: {
  institutions: PaperDetailInstitution[];
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {institutions.map((institution) => (
        <EntityCanvasLink
          key={institution.id}
          entityId={institution.id}
          entityType="institution"
          label={institution.name}
          className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 transition hover:border-slate-300 hover:bg-slate-100 hover:text-blue-900 hover:decoration-blue-700"
        >
          {institution.name}
          {institution.countryCode ? ` (${institution.countryCode})` : ""}
        </EntityCanvasLink>
      ))}
    </div>
  );
}

function formatAuthorPosition(position: string) {
  const normalizedPosition = position.trim().toLowerCase();

  if (normalizedPosition === "first") {
    return "First author";
  }

  if (normalizedPosition === "last") {
    return "Last author";
  }

  if (normalizedPosition === "middle") {
    return "Author";
  }

  return position;
}
