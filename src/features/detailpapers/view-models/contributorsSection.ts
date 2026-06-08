import type {
  PaperDetailAuthor,
  PaperDetailCountry,
  PaperDetailData,
  PaperDetailInstitution,
} from "../types";

export type PaperContributorsSectionData = {
  authors: PaperDetailAuthor[];
  countries: PaperDetailCountry[];
  institutions: PaperDetailInstitution[];
};

export function buildPaperContributorsSection(
  paperDetail: PaperDetailData,
): PaperContributorsSectionData {
  return {
    authors: paperDetail.authors,
    countries: paperDetail.countries,
    institutions: paperDetail.institutions,
  };
}
