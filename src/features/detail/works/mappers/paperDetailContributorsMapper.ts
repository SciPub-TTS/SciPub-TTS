import type {
  OpenAlexAuthorship,
  OpenAlexNamedEntity,
  PaperDetailCountry,
  OpenAlexWorkDetailApi,
  PaperDetailAuthor,
  PaperDetailEntityRef,
  PaperDetailInstitution,
} from "../types";
import {
  extractLastSegment,
  formatCountryLabel,
} from "./paperDetailShared";

export function mapAuthors(authorships: OpenAlexAuthorship[]) {
  const authors: PaperDetailAuthor[] = [];

  for (let index = 0; index < authorships.length; index += 1) {
    const authorship = authorships[index];
    const authorName =
      authorship.author?.display_name?.trim() ||
      authorship.raw_author_name?.trim() ||
      "";

    if (!authorName) {
      continue;
    }

    const authorIdentifier =
      authorship.author?.id?.trim() || `author-${index + 1}-${authorName}`;

    authors.push({
      entityId: authorship.author?.id?.trim()
        ? extractLastSegment(authorship.author.id)
        : null,
      id: extractLastSegment(authorIdentifier),
      isCorresponding: Boolean(authorship.is_corresponding),
      isFollowed: false,
      name: authorName,
      orcid: authorship.author?.orcid || null,
      position: authorship.author_position,
    });
  }

  return authors;
}

export function mapInstitutions(authorships: OpenAlexAuthorship[]) {
  const uniqueInstitutionMap = new Map<string, PaperDetailInstitution>();

  for (const authorship of authorships) {
    for (const institution of authorship.institutions || []) {
      if (!institution.id || !institution.display_name?.trim()) {
        continue;
      }

      if (!uniqueInstitutionMap.has(institution.id)) {
        uniqueInstitutionMap.set(institution.id, {
          countryName: formatCountryLabel(institution.country_code) || null,
          countryCode: institution.country_code,
          id: extractLastSegment(institution.id),
          name: institution.display_name.trim(),
          type: institution.type,
        });
      }
    }
  }

  return [...uniqueInstitutionMap.values()];
}

export function mapCountries(authorships: OpenAlexAuthorship[]) {
  const uniqueCountryMap = new Map<string, PaperDetailCountry>();

  for (const authorship of authorships) {
    for (const countryCode of authorship.countries || []) {
      addCountry(uniqueCountryMap, countryCode);
    }

    for (const institution of authorship.institutions || []) {
      addCountry(uniqueCountryMap, institution.country_code);
    }
  }

  return [...uniqueCountryMap.values()];
}

export function mapTopics(work: OpenAlexWorkDetailApi) {
  const uniqueTopicMap = new Map<string, PaperDetailEntityRef>();

  const topicCandidates = [
    work.primary_topic,
    ...(Array.isArray(work.topics) ? work.topics : []),
  ];

  for (const topic of topicCandidates) {
    const topicRef = mapNamedEntityToDetailRef(topic, "topic");

    if (!topicRef || uniqueTopicMap.has(topicRef.id)) {
      continue;
    }

    uniqueTopicMap.set(topicRef.id, topicRef);
  }

  return [...uniqueTopicMap.values()].slice(0, 8);
}

export function mapNamedEntityToDetailRef(
  entity: OpenAlexNamedEntity | null | undefined,
  type: PaperDetailEntityRef["type"],
): PaperDetailEntityRef | null {
  if (!entity?.id?.trim() || !entity.display_name?.trim()) {
    return null;
  }

  return {
    id: extractLastSegment(entity.id),
    name: entity.display_name.trim(),
    type,
  };
}

function addCountry(
  uniqueCountryMap: Map<string, PaperDetailCountry>,
  countryCode: string | null | undefined,
) {
  const normalizedCountryCode = countryCode?.trim().toUpperCase();

  if (!normalizedCountryCode || uniqueCountryMap.has(normalizedCountryCode)) {
    return;
  }

  const countryName = formatCountryLabel(normalizedCountryCode);
  if (!countryName) {
    return;
  }

  uniqueCountryMap.set(normalizedCountryCode, {
    code: normalizedCountryCode,
    name: countryName,
  });
}
