import type {
  PaperDetailAuthor,
  PaperDetailData,
  PaperDetailInstitution,
} from "../types";

export type PaperContributorsSectionData = {
  authors: PaperDetailAuthor[];
  institutions: PaperDetailInstitution[];
};

export function buildPaperContributorsSection(
  paperDetail: PaperDetailData,
): PaperContributorsSectionData {
  return {
    authors: paperDetail.authors,
    institutions: paperDetail.institutions,
  };
}
