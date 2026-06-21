import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Clock3,
  FileText,
  Heart,
  Plus,
  Search,
  Trophy,
} from "lucide-react";

type FeedTab = "all" | "following" | "my-posts" | "saved";
type SortMode = "newest" | "most-liked";

type AttachedPaper = {
  id: string;
  title: string;
  authors: string;
  year: string;
  citations: string;
};

type SocialPost = {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  avatarColor: string;
  postedAt: string;
  title: string;
  excerpt: string;
  tags: string[];
  likes: number;
  attachedPapers: AttachedPaper[];
  category: Exclude<FeedTab, "all"> | "all";
};

type TopLikedPost = {
  rank: number;
  authorName: string;
  authorInitials: string;
  avatarColor: string;
  title: string;
  likes: number;
};

const heroStats = {
  posts: 128,
};

const tabs: { label: string; value: FeedTab }[] = [
  { label: "All Posts", value: "all" },
  { label: "Following", value: "following" },
  { label: "My Posts", value: "my-posts" },
  { label: "Saved", value: "saved" },
];

const featuredPost: SocialPost = {
  id: "featured-post",
  authorName: "Dr. Elena Vasquez",
  authorRole: "NLP Researcher - MIT",
  authorInitials: "EV",
  avatarColor: "bg-emerald-500",
  postedAt: "2h ago",
  title: "Why Chain-of-Thought still beats fine-tuning for low-resource reasoning",
  excerpt:
    "After running 40+ experiments across reasoning benchmarks, I found that structured prompting consistently outperforms parameter-efficient fine-tuning when labeled data is scarce. Here is the breakdown and the three papers that changed my mind.",
  tags: ["#AI", "#NLP", "#Reasoning"],
  likes: 342,
  category: "all",
  attachedPapers: [
    {
      id: "paper-1",
      title: "Chain-of-Thought Prompting Elicits Reasoning in LLMs",
      authors: "Wei et al.",
      year: "2022",
      citations: "8,421",
    },
    {
      id: "paper-2",
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      year: "2017",
      citations: "112,430",
    },
  ],
};

const topLikedPosts: TopLikedPost[] = [
  {
    rank: 1,
    authorName: "Dr. Elena Vasquez",
    authorInitials: "EV",
    avatarColor: "bg-emerald-500",
    title: "Chain-of-Thought beats fine-tuning",
    likes: 342,
  },
  {
    rank: 2,
    authorName: "Aisha Rahman",
    authorInitials: "AR",
    avatarColor: "bg-violet-500",
    title: "A taxonomy of LLM hallucinations",
    likes: 276,
  },
  {
    rank: 3,
    authorName: "Priya Nair",
    authorInitials: "PN",
    avatarColor: "bg-rose-500",
    title: "Revisiting ResNets vs ViTs",
    likes: 211,
  },
  {
    rank: 4,
    authorName: "Marcus Lindqvist",
    authorInitials: "ML",
    avatarColor: "bg-sky-500",
    title: "Hidden cost of scaling laws",
    likes: 198,
  },
  {
    rank: 5,
    authorName: "Daniel Osei",
    authorInitials: "DO",
    avatarColor: "bg-cyan-500",
    title: "RAG is not retrieval + a prompt",
    likes: 189,
  },
];

const communityPosts: SocialPost[] = [
  featuredPost,
  {
    id: "post-2",
    authorName: "Marcus Lindqvist",
    authorRole: "PhD Candidate - ETH Zurich",
    authorInitials: "ML",
    avatarColor: "bg-sky-500",
    postedAt: "5h ago",
    title: "Reading notes: The hidden cost of scaling laws in production systems",
    excerpt:
      "Scaling laws are elegant on paper, but deploying them is another story. I annotated Kaplan et al. with real latency numbers from our cluster - the inference economics shift dramatically past 70B params.",
    tags: ["#Machine Learning", "#Systems"],
    likes: 198,
    category: "following",
    attachedPapers: [
      {
        id: "paper-3",
        title: "Scaling Laws for Neural Language Models",
        authors: "Kaplan et al.",
        year: "2020",
        citations: "6,210",
      },
    ],
  },
  {
    id: "post-3",
    authorName: "Aisha Rahman",
    authorRole: "Research Scientist - DeepMind",
    authorInitials: "AR",
    avatarColor: "bg-violet-500",
    postedAt: "8h ago",
    title: "A practical taxonomy of LLM hallucinations (and how to measure them)",
    excerpt:
      "Hallucination is an overloaded term. I propose four concrete categories with measurable signals, grounded in recent survey work. Sharing the annotated paper and my evaluation rubric.",
    tags: ["#LLM", "#Evaluation", "#Reliability"],
    likes: 276,
    category: "all",
    attachedPapers: [
      {
        id: "paper-4",
        title: "A Survey of Hallucination in Natural Language Generation",
        authors: "Ji et al.",
        year: "2023",
        citations: "3,504",
      },
      {
        id: "paper-5",
        title: "TruthfulQA: Measuring How Models Mimic Human Falsehoods",
        authors: "Lin et al.",
        year: "2022",
        citations: "2,903",
      },
    ],
  },
  {
    id: "post-4",
    authorName: "Daniel Osei",
    authorRole: "Applied Research Engineer - Hugging Face",
    authorInitials: "DO",
    avatarColor: "bg-cyan-500",
    postedAt: "1d ago",
    title: "RAG is not retrieval plus a prompt: notes from three failed prototypes",
    excerpt:
      "Three different RAG setups failed for the same reason: weak corpus shaping. I shared the notes that helped us move from generic retrieval to domain-grounded answers.",
    tags: ["#RAG", "#Search", "#Knowledge"],
    likes: 189,
    category: "saved",
    attachedPapers: [
      {
        id: "paper-6",
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        authors: "Lewis et al.",
        year: "2020",
        citations: "9,115",
      },
    ],
  },
  {
    id: "post-5",
    authorName: "Priya Nair",
    authorRole: "Vision Engineer - FPT AI",
    authorInitials: "PN",
    avatarColor: "bg-rose-500",
    postedAt: "2d ago",
    title: "Revisiting ResNets vs Vision Transformers for small medical datasets",
    excerpt:
      "For compact medical imaging datasets, ViTs still need stronger regularization and augmentation than many teams expect. Here are my benchmark notes and failure cases.",
    tags: ["#Vision", "#Medical AI", "#Benchmarks"],
    likes: 211,
    category: "my-posts",
    attachedPapers: [
      {
        id: "paper-7",
        title: "An Image is Worth 16x16 Words",
        authors: "Dosovitskiy et al.",
        year: "2021",
        citations: "54,821",
      },
    ],
  },
];

function sortPosts(posts: SocialPost[], sortMode: SortMode) {
  const nextPosts = [...posts];

  if (sortMode === "most-liked") {
    nextPosts.sort((left, right) => right.likes - left.likes);
    return nextPosts;
  }

  nextPosts.sort((left, right) => right.postedAt.localeCompare(left.postedAt));
  return nextPosts;
}

function filterPosts(posts: SocialPost[], tab: FeedTab, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesTab = tab === "all" ? true : post.category === tab;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.authorName.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery) ||
      post.attachedPapers.some((paper) =>
        paper.title.toLowerCase().includes(normalizedQuery),
      );

    return matchesTab && matchesQuery;
  });
}

function AttachedPaperCard({ paper }: { paper: AttachedPaper }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-black/10 bg-white px-4 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF8EE] text-[#0B9D74]">
          <FileText className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="font-text truncate text-base font-semibold text-black">
            {paper.title}
          </p>
          <p className="font-subtext mt-1 text-sm text-slate-500">
            {paper.authors} - {paper.year} - cited {paper.citations}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-slate-500"
      >
        <Bookmark className="h-4 w-4" />
      </button>
    </div>
  );
}

function PostCard({ post }: { post: SocialPost }) {
  return (
    <article className="rounded-[1.85rem] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${post.avatarColor}`}
          >
            {post.authorInitials}
          </div>

          <div>
            <p className="font-text text-[1.08rem] font-semibold text-black">
              {post.authorName}
            </p>
            <p className="font-subtext text-sm text-slate-500">
              {post.authorRole}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 className="h-4 w-4" />
          <span>{post.postedAt}</span>
        </div>
      </div>

      <h3 className="font-search-title mt-6 text-[2.45rem] leading-[1.08] text-black">
        {post.title}
      </h3>

      <p className="font-subtext mt-4 text-[1.1rem] leading-9 text-slate-500">
        {post.excerpt}
      </p>

      <div className="mt-5 rounded-[1.4rem] border border-dashed border-[#AEEFD7] bg-[#FAFFFD] p-4">
        <p className="font-title text-xs font-semibold uppercase tracking-[0.18em] text-[#0AAA6E]">
          {post.attachedPapers.length} paper{post.attachedPapers.length > 1 ? "s" : ""} attached
        </p>

        <div className="mt-3 space-y-3">
          {post.attachedPapers.map((paper) => (
            <AttachedPaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1.5 font-subtext text-sm text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-black/8 pt-5">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-base text-slate-600"
        >
          <Heart className="h-4 w-4" />
          {post.likes}
        </button>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-500"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function SocialHubPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const feedPosts = useMemo(() => {
    const filteredPosts = filterPosts(communityPosts, activeTab, searchQuery);
    return sortPosts(filteredPosts, sortMode);
  }, [activeTab, searchQuery, sortMode]);

  return (
    <div className="min-h-screen bg-[#F8FBFA] px-6 py-8">
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10">
        <section className="rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top_right,_rgba(17,211,164,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(31,175,255,0.12),_transparent_28%),linear-gradient(180deg,#FFFFFF_0%,#FCFFFE_100%)] px-8 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-[640px]">
              <h1 className="font-search-title text-[4.5rem] leading-[0.95] text-black">
                Share Research. <span className="text-[#08B978]">Spark</span>
                <br />
                <span className="text-[#08B978]">Discussion.</span>
              </h1>

              <p className="font-subtext mt-6 max-w-[520px] text-[1.1rem] leading-9 text-slate-500">
                Turn bookmarked papers into public research notes and discover
                what others are reading.
              </p>

              <div className="mt-8 inline-flex items-center gap-4 rounded-[1.45rem] border border-black/10 bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8FBF4] text-[#0AAA6E]">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-search-title text-3xl leading-none text-black">
                    {heroStats.posts}
                  </p>
                  <p className="font-subtext mt-1 text-sm text-slate-500">
                    Posts
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-12 items-center gap-3 rounded-[1.05rem] border border-[#0AAA6E] bg-[#08C67B] px-6 text-base font-semibold text-black shadow-[0_16px_30px_rgba(8,198,123,0.24)]"
            >
              <Plus className="h-5 w-5" />
              Create Blog
            </button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E9FBF5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0AAA6E]">
              <Heart className="h-3.5 w-3.5" />
              Featured this week
            </div>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${featuredPost.avatarColor}`}
                >
                  {featuredPost.authorInitials}
                </div>

                <div>
                  <p className="font-text text-[1.1rem] font-semibold text-black">
                    {featuredPost.authorName}
                  </p>
                  <p className="font-subtext text-sm text-slate-500">
                    {featuredPost.authorRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock3 className="h-4 w-4" />
                <span>{featuredPost.postedAt}</span>
              </div>
            </div>

            <h2 className="font-search-title mt-7 max-w-4xl text-[3rem] leading-[1.02] text-black">
              {featuredPost.title}
            </h2>

            <p className="font-subtext mt-5 max-w-4xl text-[1.1rem] leading-9 text-slate-500">
              {featuredPost.excerpt}
            </p>

            <div className="mt-7">
              <p className="font-title text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Attached papers
              </p>

              <div className="mt-3 space-y-3">
                {featuredPost.attachedPapers.map((paper) => (
                  <AttachedPaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-base text-slate-600"
              >
                <Heart className="h-4 w-4" />
                {featuredPost.likes}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-[1rem] bg-black px-6 py-3 text-base font-semibold text-white"
              >
                Read post
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1D9] text-[#F59E0B]">
                <Trophy className="h-5 w-5" />
              </div>

              <h2 className="font-search-title text-[2rem] leading-none text-black">
                Top liked this week
              </h2>
            </div>

            <div className="mt-8 space-y-5">
              {topLikedPosts.map((entry) => (
                <div key={entry.rank} className="flex items-center gap-4">
                  <div className="font-title w-6 text-right text-xl text-[#F59E0B]">
                    {entry.rank}
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${entry.avatarColor}`}
                  >
                    {entry.authorInitials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-text truncate text-base font-semibold text-black">
                      {entry.title}
                    </p>
                    <p className="font-subtext text-sm text-slate-500">
                      {entry.authorName}
                    </p>
                  </div>

                  <div className="font-subtext flex items-center gap-1 text-sm text-rose-500">
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    {entry.likes}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section>
          <div>
            <h2 className="font-search-title text-[2.5rem] leading-none text-black">
              Community Sharing
            </h2>
            <p className="font-subtext mt-3 text-[1.05rem] text-slate-500">
              Insights from the Owlreka research community
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-[1.8rem] border border-black/10 bg-white px-4 py-3 shadow-[0_14px_45px_rgba(15,23,42,0.05)] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2 rounded-[1.15rem] bg-slate-50 p-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={[
                      "rounded-[0.95rem] px-4 py-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-white text-black shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex min-w-[320px] items-center gap-3 rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-slate-400">
                <Search className="h-4 w-4" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search posts, papers, or authors..."
                  className="w-full border-0 bg-transparent text-sm text-black outline-none"
                />
              </label>

              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="most-liked">Most liked</option>
              </select>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-[640px] flex-col gap-6">
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
