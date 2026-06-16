import type { ResearchFeedData } from "../types";

const researchFeedData: ResearchFeedData = {
  articles: [
    {
      abstract:
        "We introduce a new class of selective state space models that match Transformer quality while scaling linearly with sequence length. Across language, audio, and genomics, Mamba achieves state-of-the-art performance and faster inference.",
      authors: [{ name: "Tri Dao" }, { name: "Albert Gu" }],
      badges: [
        { label: "Computer Science", tone: "topic" },
        { label: "Rising Topic", tone: "rising" },
        { label: "Matched topic & author", tone: "match" },
      ],
      citations: 286,
      doiLabel: "doi.org/10.48550/arXiv.2312.00752",
      doiUrl: "https://doi.org/10.48550/arXiv.2312.00752",
      extraAuthors: 1,
      id: "mamba-linear-time-sequence-modeling",
      relevance: 94,
      reason:
        "Shown because you follow both the topic 'Large Language Models' and the author 'Fei-Fei Li'.",
      tabMatches: [
        "matched-topic",
        "matched-author",
        "matched-both",
        "latest",
        "trending",
        "most-relevant",
      ],
      tags: [
        "Large Language Models",
        "Mechanistic Interpretability",
        "Scaling Laws",
      ],
      title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
      venue: "NeurIPS 2025",
      year: 2025,
    },
    {
      abstract:
        "A large-scale bibliometric analysis of Open Access prevalence over fifteen years reveals accelerating Gold OA growth, declining Bronze share, and significant disciplinary variation in licensing practices.",
      authors: [
        { following: true, name: "Heather Piwowar" },
        { following: true, name: "Juan Pablo Alperin" },
      ],
      badges: [
        { label: "Decision Sciences", tone: "topic" },
        { label: "Matched followed author", tone: "author" },
      ],
      citations: 142,
      doiLabel: "doi.org/10.7717/peerj.4375",
      doiUrl: "https://doi.org/10.7717/peerj.4375",
      id: "open-access-longitudinal-evidence",
      relevance: 91,
      reason: "Shown because you follow the author: Heather Piwowar.",
      tabMatches: ["matched-author", "latest", "most-relevant"],
      tags: ["Open Access", "Scholarly Communication", "Licensing"],
      title:
        "The shifting landscape of Open Access: longitudinal evidence from 2010-2025",
      venue: "PeerJ",
      year: 2025,
    },
    {
      abstract:
        "This study maps research data management practices across institutions and identifies collaboration patterns that improve dataset reuse, citation, and long-term repository health.",
      authors: [{ name: "Jason R. Priem" }, { name: "Vincent Lariviere" }],
      badges: [
        { label: "Research Data", tone: "topic" },
        { label: "Stable", tone: "stable" },
      ],
      citations: 97,
      doiLabel: "doi.org/10.1038/s41597-025-01000-1",
      doiUrl: "https://doi.org/10.1038/s41597-025-01000-1",
      id: "research-data-reuse-network",
      relevance: 87,
      reason:
        "Shown because it matches saved keywords around research data management.",
      tabMatches: ["matched-topic", "most-relevant"],
      tags: ["Research Data", "Repositories", "Data Reuse"],
      title:
        "Research data reuse networks and the institutional practices behind them",
      venue: "Scientific Data",
      year: 2025,
    },
  ],
  followedAuthors: [
    { field: "Scientometrics", name: "Jason R. Priem" },
    { field: "Open Access", name: "Heather Piwowar" },
    { field: "Computer Vision", name: "Fei-Fei Li" },
    { field: "Researcher", name: "Vincent Lariviere" },
    { field: "Researcher", name: "Juan Pablo Alperin" },
  ],
  followedTopics: [
    { name: "AI in Education", status: "Rising" },
    { name: "Open Access", status: "Stable" },
    { name: "Research Data Management", status: "Stable" },
    { name: "Scientometrics and Impact", status: "Stable" },
  ],
  suggestedTopics: [
    { name: "Academic Publishing and Open Access" },
    { name: "AI Policy in Higher Education" },
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

export function getMockResearchFeed() {
  return researchFeedData;
}
