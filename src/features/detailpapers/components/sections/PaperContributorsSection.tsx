import { Users } from "lucide-react";

import EntityCanvasLink from "@/features/entity-canvas/components/EntityCanvasLink";

import type { PaperDetailAuthor, PaperDetailInstitution } from "../../types";
import type { PaperContributorsSectionData } from "../../view-models/contributorsSection";
import DetailSectionCard from "./DetailSectionCard";

type PaperContributorsSectionProps = {
  section: PaperContributorsSectionData;
};

type AuthorListProps = {
  authors: PaperDetailAuthor[];
};

type InstitutionListProps = {
  institutions: PaperDetailInstitution[];
};

export default function PaperContributorsSection(
  props: PaperContributorsSectionProps,
) {
  const { section } = props;
  const hasCorrespondingAuthor = section.authors.some(
    (author) => author.isCorresponding,
  );

  return (
    <DetailSectionCard
      icon={<Users className="h-5 w-5" />}
      title="Authors & Institutions"
    >
      <div>
        <h3 className="text-base font-semibold uppercase tracking-[0.18em] text-black">
          Authors
        </h3>
        {hasCorrespondingAuthor ? (
          <p className="mt-2 text-sm text-black">
            <span className="font-semibold">Corresponding author</span>
            {" - "}
            main contact for the paper and editorial communication.
          </p>
        ) : null}
        <div className="mt-3">
          <AuthorList authors={section.authors} />
        </div>
      </div>

      <div className="border-t border-black pt-4">
        <h3 className="text-base font-semibold uppercase tracking-[0.18em] text-black">
          Institutions
        </h3>
        <InstitutionList institutions={section.institutions} />
      </div>
    </DetailSectionCard>
  );
}

function AuthorList(props: AuthorListProps) {
  const { authors } = props;

  if (authors.length === 0) {
    return (
      <p className="text-lg text-black">Author information is not available.</p>
    );
  }

  return (
    <div className="space-y-3">
      {authors.map((author) => (
        <div
          key={author.id}
          className="flex flex-wrap items-center gap-x-2 gap-y-2 text-base text-black"
        >
          {author.entityId ? (
            <EntityCanvasLink
              entityId={author.entityId}
              entityType="author"
              label={author.name}
              className="cursor-pointer text-sm font-semibold text-black transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
            >
              {author.name}
            </EntityCanvasLink>
          ) : (
            <span className="text-sm font-semibold text-black">
              {author.name}
            </span>
          )}

          {author.position || author.isCorresponding || author.isFollowed ? (
            <span className="text-black">-</span>
          ) : null}

          {author.position ? (
            <span className="text-sm font-medium text-black">
              {formatAuthorPosition(author.position)}
            </span>
          ) : null}

          {author.position && (author.isCorresponding || author.isFollowed) ? (
            <span className="text-black">-</span>
          ) : null}

          {author.isCorresponding ? (
            <span
              className="inline-flex items-center rounded-full border border-[#3c8534] bg-[#ECFFF5] px-3 py-1 text-sm font-semibold text-[#1f5f1b]"
              title="Main contact for the paper and editorial communication"
            >
              Corresponding
            </span>
          ) : null}

          {author.isCorresponding && author.isFollowed ? (
            <span className="text-black">-</span>
          ) : null}

          {author.isFollowed ? (
            <span className="text-sm font-medium text-black">Following</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function InstitutionList(props: InstitutionListProps) {
  const { institutions } = props;

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {institutions.map((institution) => (
        <EntityCanvasLink
          key={institution.id}
          entityId={institution.id}
          entityType="institution"
          label={institution.name}
          className="cursor-pointer rounded-full border border-black bg-gradient-to-r from-[#EEF6FF] via-[#F6FAFF] to-[#DCEEFF] px-4 py-2 text-sm font-semibold text-black transition hover:text-blue-700 hover:underline hover:decoration-blue-700 hover:underline-offset-4"
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
