import type { PaperResult, SavedSearch, SearchSummaryStats } from "../types";

export const mockSavedSearches: SavedSearch[] = [
  {
    id: "search-1",
    query: "diffusion 2024",
    savedAt: "2026-05-27T08:30:00.000Z",
  },
  {
    id: "search-2",
    query: "large language models",
    savedAt: "2026-05-27T08:00:00.000Z",
  },
  {
    id: "search-3",
    query: "open access citation trends",
    savedAt: "2026-05-26T15:20:00.000Z",
  },
  {
    id: "search-4",
    query: "fpt university research",
    savedAt: "2026-05-26T10:45:00.000Z",
  },
  {
    id: "search-5",
    query: "machine learning healthcare",
    savedAt: "2026-05-25T18:10:00.000Z",
  },
  {
    id: "search-6",
    query: "orcid indexed publications",
    savedAt: "2026-05-25T11:05:00.000Z",
  },
  {
    id: "search-7",
    query: "conference paper ranking",
    savedAt: "2026-05-24T09:15:00.000Z",
  },
];

export const mockPaperResults: PaperResult[] = [
  {
    id: "paper-1",
    title: "Scaling Laws for Mechanistic Features in Large Language Models",
    authors: "Catherine Olah, Tom Henighan + 1 more",
    venue: "Nature Machine Intelligence",
    citations: 411,
    year: 2025,
    abstract:
      "We characterize how the count, sparsity, and monosemanticity of internal features scale with model size in transformers from 7B to 405B parameters.",
    fullText:
      "Large language models reveal mechanistic features, scaling laws, sparse autoencoders, and transformer interpretability signals across model families.",
    doi: "doi.org/10.1038/s42256-025-00911-y",
    tags: ["Mechanistic Interpretability", "Large Language Models", "Scaling Laws"],
    field: "Computer Science",
    topic: "Large Language Models",
    subField: "Mechanistic Interpretability",
    growthPercent: 38,
    isTrendTopic: true,
    saved: true,
    trend: true,
  },
  {
    id: "paper-2",
    title: "Attention Sinks Reveal Hidden Working Memory in Transformer Decoders",
    authors: "Tri Dao, Albert Gu + 1 more",
    venue: "NeurIPS 2025 - Oral",
    citations: 286,
    year: 2025,
    abstract:
      "Attention sinks turn out to encode short-horizon working memory. Ablating them drops long-context recall by 31 points on Needle-in-a-Haystack.",
    fullText:
      "Transformer decoder attention sinks, long context recall, hidden memory, high citation impact, and mechanistic interpretability experiments.",
    doi: "doi.org/10.48550/arXiv.2509.04102",
    tags: ["Attention Sinks", "Long-Context", "Mechanistic Interpretability"],
    field: "Computer Science",
    topic: "Attention Sinks",
    subField: "Mechanistic Interpretability",
    growthPercent: 29,
    isTrendTopic: true,
    trend: true,
  },
  {
    id: "paper-3",
    title: "From Sparse Autoencoders to Causal Circuits: A Unified Methodology",
    authors: "Neel Nanda, Lawrence Chan + 1 more",
    venue: "ICML 2025",
    citations: 173,
    year: 2025,
    abstract:
      "We unify sparse autoencoder feature dictionaries with activation-patching causal circuits via a shared loss objective validated across model families.",
    fullText:
      "Sparse autoencoders, causal circuits, activation patching, Python and Gemma model families, shared loss objective, circuit discovery.",
    doi: "doi.org/10.48550/arXiv.2502.07882",
    tags: ["Sparse Autoencoders", "Mechanistic Interpretability", "Causal Analysis"],
    field: "Computer Science",
    topic: "Sparse Autoencoders",
    subField: "Causal Analysis",
    growthPercent: 17,
  },
  {
    id: "paper-4",
    title: "Diffusion Models for Scientific Literature Graph Expansion",
    authors: "Mai Nguyen, Duy Tran + 2 more",
    venue: "ACL Findings 2025",
    citations: 94,
    year: 2025,
    abstract:
      "A diffusion-based graph expansion method improves citation recommendation and subfield discovery for publication trend analysis platforms.",
    fullText:
      "Diffusion 2024 literature graph expansion, citation recommendation, subfield discovery, research trend analysis, topic movement.",
    doi: "doi.org/10.48550/arXiv.2503.11210",
    tags: ["Diffusion Models", "Citation Graph", "Research Discovery"],
    field: "Computer Science",
    topic: "Diffusion Models",
    subField: "Research Discovery",
    growthPercent: 24,
    isTrendTopic: true,
  },
  {
    id: "paper-5",
    title: "OpenAlex Signals for Early Topic Momentum Detection",
    authors: "Hannah Lee, Pham Quang + 3 more",
    venue: "JCDL 2025",
    citations: 61,
    year: 2025,
    abstract:
      "We combine venue, citation velocity, and author movement features to detect research topics before they appear in major review papers.",
    fullText:
      "OpenAlex signals, early topic momentum, publication trend detection, venue growth, citation velocity, author movement.",
    doi: "doi.org/10.1145/early-topic-momentum",
    tags: ["OpenAlex", "Trend Detection", "Topic Momentum"],
    field: "Library Science",
    topic: "Topic Momentum",
    subField: "Trend Detection",
    growthPercent: 31,
    isTrendTopic: true,
  },
  {
    id: "paper-6",
    title: "ORCID-Indexed Authorship Networks in Emerging AI Subfields",
    authors: "Kaito Mori, Linh Hoang + 1 more",
    venue: "Scientometrics 2025",
    citations: 48,
    year: 2025,
    abstract:
      "ORCID-indexed author graphs reduce ambiguity in author-level trend analytics and reveal fast-forming collaboration clusters.",
    fullText:
      "ORCID indexed publications, authorship networks, emerging AI subfields, collaboration clusters, author disambiguation.",
    doi: "doi.org/10.1007/orcid-ai-subfields",
    tags: ["ORCID", "Authorship Network", "SubField Analysis"],
    field: "Scientometrics",
    topic: "Authorship Networks",
    subField: "SubField Analysis",
    growthPercent: 12,
  },
];

// TODO: Replace this mock summary with the search API response.
export const searchSummaryStats: SearchSummaryStats = {
  totalIndexedPapers: 500_000_000,
  matchedPapers: 12_481,
  latestUpdatedMinutesAgo: 4,
  resultCount: 12_481,
  responseTimeSeconds: 0.42,
};
