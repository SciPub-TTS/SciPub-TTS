import { http } from "@/services/http";
import type { ApiResponse } from "@/types/common.types";
import type {
  FeedArticle,
  FollowedAuthor,
  FollowedTopic,
  SuggestedTopic,
  ResearchFeedData,
} from "../types";

// Helper to strip any full OpenAlex URL prefixes to keep route navigation clean
function extractRawId(id: string): string {
  if (!id) return "";
  return id.split("/").pop() || id;
}

export const fallbackResearchFeedData: ResearchFeedData = {
  articles: [
    {
      abstract:
        "Despite growing interest in Open Access (OA) to scholarly literature, there is an unmet need for large-scale, up-to-date, and reproducible studies assessing the prevalence and characteristics of OA. We address this using oaDOI, an open online service that determines OA status for 67 million articles.",
      authors: [
        { following: true, name: "Heather Piwowar" },
        { following: true, name: "Jason R. Priem" },
        { name: "Vincent Larivière" },
        { following: true, name: "Juan Pablo Alperin" },
      ],
      badges: [
        { label: "Scientometrics", tone: "topic" },
        { label: "Matched followed author", tone: "author" },
        { label: "Matched topic & author", tone: "match" },
      ],
      citations: 1217,
      doiLabel: "doi.org/10.7717/peerj.4375",
      doiUrl: "https://doi.org/10.7717/peerj.4375",
      extraAuthors: 5,
      id: "W2741809807",
      relevance: 99,
      reason:
        "Shown because you follow both the topic 'Academic Publishing and Open Access' and the author 'Heather Piwowar'.",
      tabMatches: [
        "matched-topic",
        "matched-author",
        "matched-both",
        "latest",
        "trending",
        "most-relevant",
      ],
      tags: ["Open Access", "Scholarly Communication", "Bibliometrics"],
      title:
        "The state of OA: a large-scale analysis of the prevalence and impact of Open Access articles",
      venue: "PeerJ",
      year: 2018,
    },
    {
      abstract:
        "This paper explores Advanced MIMO systems optimization, multi-antenna beamforming, and millimeter-wave propagation modeling. Testing results over ten years indicate highly stable signal-to-noise ratios and low-latency metrics.",
      authors: [{ following: true, name: "Stefan Pratschner" }],
      badges: [
        { label: "Electrical Engineering", tone: "topic" },
        { label: "Matched followed author", tone: "author" },
      ],
      citations: 435,
      doiLabel: "doi.org/10.1109/mimo.2023.123",
      doiUrl: "https://doi.org/10.1109/mimo.2023.123",
      id: "W5083417991", // Derived from Stefan's Author ID A5083417991
      relevance: 94,
      reason: "Shown because you follow the author: Stefan Pratschner.",
      tabMatches: ["matched-author", "latest", "trending"],
      tags: ["MIMO Systems", "Wireless Propagation", "Antenna Design"],
      title:
        "Advanced MIMO Systems Optimization and Millimeter-Wave Channel Propagation Modeling",
      venue: "TU Wien Publications",
      year: 2023,
    },
    {
      abstract:
        "This study focuses on the use of microwave imaging techniques, including ultrawideband and confocal methods, for the detection and localization of breast cancer tumors.",
      authors: [{ name: "Manoel Sant'Ana Filho" }],
      badges: [
        { label: "Biomedical Engineering", tone: "topic" },
        { label: "Stable", tone: "stable" },
      ],
      citations: 23133,
      doiLabel: "doi.org/10.1016/j.bme.2024.01",
      doiUrl: "https://doi.org/10.1016/j.bme.2024.01",
      id: "W11739", // Derived from Topic ID T11739
      relevance: 87,
      reason:
        "Shown because it matches your followed topic: Microwave Imaging.",
      tabMatches: ["matched-topic", "most-relevant"],
      tags: ["Microwave Imaging", "Breast Cancer Detection", "Ultrawideband"],
      title:
        "Microwave Breast Imaging and Dielectric Tissue Scattering Localization",
      venue: "Biomedical Engineering Journal",
      year: 2024,
    },
  ],
  followedAuthors: [
    {
      id: "A5083417991",
      field: "Electrical Engineering",
      name: "Stefan Pratschner",
    },
    { id: "A5048491430", field: "Open Access", name: "Heather Piwowar" },
    { id: "A5023888391", field: "Scientometrics", name: "Jason R. Priem" },
    {
      id: "A5085171399",
      field: "Scholarly Publishing",
      name: "Juan Pablo Alperin",
    },
    { id: "A5109613364", field: "Civil Engineering", name: "Abdul Hamid" },
  ],
  followedTopics: [
    {
      id: "T11739",
      name: "Microwave Imaging and Scattering Analysis",
      status: "Rising",
    },
    { id: "T11999", name: "Empathy and Medical Education", status: "Stable" },
    { id: "T11246", name: "Sports injuries and prevention", status: "Stable" },
    {
      id: "T13607",
      name: "Academic Publishing and Open Access",
      status: "Stable",
    },
  ],
  suggestedTopics: [
    { id: "T10194", name: "Nonlinear Partial Differential Equations" },
    { id: "T13897", name: "Historical Economic and Legal Thought" },
  ],
  tabs: [
    { key: "all", label: "All" },
    { key: "matched-topic", label: "Matched Topic" },
    { key: "matched-author", label: "Matched Author" },
    { key: "matched-both", label: "Matched Both" },
    { key: "latest", label: "Latest" },
    { key: "trending", label: "Trending" },
    { key: "most-relevant", label: "Most Relevant" },
  ],
};

export const apiService = {
  async getFollowedTopics(): Promise<FollowedTopic[]> {
    try {
      const response = await http.get<ApiResponse<FollowedTopic[]>>(
        "/api/feed/followed-topics",
      );
      const data = response.data.data || [];
      return data.map((topic) => ({
        ...topic,
        id: extractRawId(topic.id),
      }));
    } catch (e) {
      console.warn(
        "Unable to resolve live followed topics; utilizing local cache fallback.",
        e,
      );
      return fallbackResearchFeedData.followedTopics;
    }
  },

  async getFollowedAuthors(): Promise<FollowedAuthor[]> {
    try {
      const response = await http.get<ApiResponse<FollowedAuthor[]>>(
        "/api/feed/followed-authors",
      );
      const data = response.data.data || [];
      return data.map((author) => ({
        ...author,
        id: extractRawId(author.id),
      }));
    } catch (e) {
      console.warn(
        "Unable to resolve live followed authors; utilizing local cache fallback.",
        e,
      );
      return fallbackResearchFeedData.followedAuthors;
    }
  },

  async getSuggestedTopics(): Promise<SuggestedTopic[]> {
    try {
      const response = await http.get<ApiResponse<SuggestedTopic[]>>(
        "/api/feed/suggested-topics",
      );
      const data = response.data.data || [];
      return data.map((topic) => ({
        ...topic,
        id: extractRawId(topic.id),
      }));
    } catch (e) {
      console.warn(
        "Unable to resolve live suggested topics; utilizing local cache fallback.",
        e,
      );
      return fallbackResearchFeedData.suggestedTopics;
    }
  },

  async getFeed(tabKey: string): Promise<FeedArticle[]> {
    const backendEnumTab = tabKey.toUpperCase().replace("-", "_");
    try {
      const response = await http.get<
        ApiResponse<{
          items: FeedArticle[];
          totalItems: number;
        }>
      >("/api/feed", {
        params: {
          feedTab: backendEnumTab,
          page: 0,
          pageSize: 10,
        },
      });

      const data = response.data.data;

      if (!data || !data.items || data.items.length === 0) {
        return fallbackResearchFeedData.articles;
      }

      return data.items.map((item) => ({
        ...item,
        id: extractRawId(item.id),
      }));
    } catch (e) {
      console.warn(
        "Unable to fetch live feed articles; utilizing mock articles.",
        e,
      );
      return fallbackResearchFeedData.articles;
    }
  },
};

export function getMockResearchFeed() {
  return fallbackResearchFeedData;
}
