import {
  Clock3,
  FileText,
  Heart,
  Pencil,
  Plus,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";

import { SafeActionDialog } from "@/layout/global/SafeActionDialog";
import { BlogEditorModal } from "@/features/social/components/BlogEditorModal";
import { PostCard } from "@/features/social/components/PostCard";
import { SocialAvatar } from "@/features/social/components/SocialAvatar";
import { SocialReferenceList } from "@/features/social/components/SocialReferenceList";
import {
  HERO_GRADIENT,
  SECONDARY_BUTTON_CLASS,
  SOCIAL_TABS,
  SURFACE_CARD_CLASS,
} from "@/features/social/constants/socialHub.constants";
import { useSocialHub } from "@/features/social/hooks/useSocialHub";
import type { SortMode } from "@/features/social/types/social.types";
import { normalizeIdentityValue } from "@/features/social/utils/socialQueryUtils";
import PostDetailDialog from "@/features/social/components/PostDetailDialog.tsx";

export default function SocialHubPage() {
  const {
    activeTab,
    blogError,
    blogForm,
    blogModalMode,
    bookmarks,
    closeBlogModal,
    closeDeletePostDialog,
    currentUserId,
    deleteDialogPostId,
    errorMessage,
    featuredPost,
    feedPosts,
    handleBlogModalKeyDown,
    handleBlogSubmit,
    handleConfirmDeletePost,
    handleDeletePost,
    handleToggleLike,
    hasError,
    isBlogModalOpen,
    isDeletingPost,
    isLoading,
    isLoadingBookmarks,
    isSubmittingBlog,
    newestPostsPage,
    openCreateBlogModal,
    openEditBlogModal,
    openEditPostMutation,
    pendingDeletePostId,
    pendingLikePostIds,
    postPendingDelete,
    searchQuery,
    selectedTopics,
    setActiveTab,
    setSearchQuery,
    setSortMode,
    sortMode,
    toggleBookmarkSelection,
    topLikedPosts,
    updateBlogField,
      closeViewPostDialog,
      hasPostDetailError,
      isLoadingPostDetail,
      openViewPostDialog,
      viewingPostDetail,
      viewingPostId,
  } = useSocialHub();

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10">
          <section
            className={`rounded-[2rem] border border-black px-8 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] ${HERO_GRADIENT}`}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[900px]">
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Explore - Community Research Notes
                </p>

                <h1 className="font-title-page mt-3 text-[3.8rem] leading-[0.95] text-[#14532D] xl:whitespace-nowrap 2xl:text-[4.3rem]">
                  Collect Papers. <span>Share</span> <span>Insight.</span>
                </h1>

                <p className="font-subtext mt-6 max-w-[520px] text-[1.1rem] leading-9 text-slate-500">
                  Turn bookmarked papers into public research notes and discover
                  what others are reading.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateBlogModal}
                className="inline-flex h-12 items-center gap-3 rounded-lg bg-[#14532D] px-6 text-base font-semibold text-white transition hover:bg-[#15803D]"
              >
                <Plus className="h-5 w-5" />
                Create Blog
              </button>
            </div>
          </section>

          {hasError ? (
            <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
              {errorMessage}
            </section>
          ) : null}

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
            <div className={`${SURFACE_CARD_CLASS} p-7`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#A3E635]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#14532D] ring-1 ring-[#059669]/40">
                <Heart className="h-3.5 w-3.5 fill-current text-[#F33E58]" />
                Most liked this week
              </div>

              {featuredPost ? (
                <>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <SocialAvatar
                        avatarUrl={featuredPost.author.avatarUrl}
                        fullName={featuredPost.author.fullName}
                        seed={featuredPost.author.id}
                        sizeClassName="h-12 w-12"
                      />

                      <div>
                        <p className="text-[1.1rem] font-semibold text-black">
                          {featuredPost.author.fullName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-black">
                      <Clock3 className="h-4 w-4" />

                      <span>
                        {featuredPost.updatedAt ?? featuredPost.createdAt}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-brand mt-7 max-w-4xl text-[3rem] font-normal leading-[1.02] text-[#14532D]">
                    {featuredPost.title}
                  </h2>

                  <p className="font-subtext mt-5 max-w-4xl text-[1.1rem] leading-9 text-slate-500">
                    {featuredPost.bodyPreview}
                  </p>

                  <SocialReferenceList
                    references={featuredPost.references}
                    titleClassName="text-base font-semibold text-black"
                    wrapperClassName="mt-6 rounded-[1.4rem] border border-black bg-slate-50/60 px-5 py-5"
                  />

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(featuredPost)}
                        disabled={pendingLikePostIds.includes(featuredPost.id)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                          featuredPost.liked
                            ? "border-[#F33E58] bg-[#FDECEF] text-[#F33E58]"
                            : "border-black bg-white text-black hover:border-[#F33E58] hover:bg-[#F33E58] hover:text-white"
                        } ${
                          pendingLikePostIds.includes(featuredPost.id)
                            ? "cursor-not-allowed opacity-60"
                            : ""
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${featuredPost.liked ? "fill-current" : ""}`}
                        />

                        {featuredPost.likeCount}
                      </button>
                    </div>

                    {normalizeIdentityValue(currentUserId) ===
                    normalizeIdentityValue(featuredPost.author.id) ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditBlogModal(featuredPost.id)}
                          disabled={
                            openEditPostMutation.isPending ||
                            pendingDeletePostId === featuredPost.id
                          }
                          className={`${SECONDARY_BUTTON_CLASS} ${
                            openEditPostMutation.isPending ||
                            pendingDeletePostId === featuredPost.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePost(featuredPost.id)}
                          disabled={pendingDeletePostId === featuredPost.id}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#DC2626] bg-white px-4 py-3 text-sm font-semibold text-[#DC2626] transition hover:bg-[#DC2626] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                            pendingDeletePostId === featuredPost.id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-black/10 bg-slate-50 px-6 py-10 text-center text-slate-500">
                  {isLoading
                    ? "Loading featured post..."
                    : "No featured posts yet."}
                </div>
              )}
            </div>

            <aside className={`${SURFACE_CARD_CLASS} p-7`}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7E8] text-[#D4A017]">
                  <Trophy className="h-5 w-5" />
                </div>

                <h2 className="font-title-page text-[2rem] leading-none text-[#059669]">
                  Top liked this week
                </h2>
              </div>

              <div className="mt-8 space-y-5">
                {topLikedPosts.length > 0 ? (
                  topLikedPosts.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-4">
                      <div className="font-title w-6 text-right text-xl text-[#14532D]">
                        {index + 1}
                      </div>

                      <SocialAvatar
                        avatarUrl={entry.author.avatarUrl}
                        fullName={entry.author.fullName}
                        seed={entry.author.id}
                        sizeClassName="h-11 w-11 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-brand truncate text-base font-normal text-black">
                          {entry.title}
                        </p>

                        <p className="font-subtext text-sm text-slate-500">
                          {entry.author.fullName}
                        </p>
                      </div>

                      <div className="font-subtext flex items-center gap-1 text-sm text-[#F33E58]">
                        <Heart className="h-3.5 w-3.5 fill-current text-[#F33E58]" />

                        {entry.likeCount}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-black bg-slate-50/60 px-5 py-8 text-center text-slate-500">
                    {isLoading
                      ? "Loading top liked posts..."
                      : "No liked posts yet."}
                  </div>
                )}
              </div>
            </aside>
          </section>

          <section>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                  Community feed
                </p>

                <h2 className="font-title-page mt-3 text-[2.5rem] leading-none text-[#059669]">
                  Community Sharing
                </h2>
              </div>

              <div className="inline-flex items-center gap-4 self-start rounded-[1.45rem] border border-black bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:self-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7E8] text-[#D4A017]">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-title-page text-3xl leading-none text-black">
                    {newestPostsPage?.totalElements ?? 0}
                  </p>
                  <p className="font-subtext mt-1 text-sm text-slate-500">
                    Posts
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-[1.8rem] border border-black bg-white px-4 py-3 shadow-[0_14px_45px_rgba(15,23,42,0.05)] lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {SOCIAL_TABS.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={[
                        "rounded-[0.95rem] border border-black px-4 py-2 text-sm font-semibold transition",

                        isActive
                          ? "bg-[#14532D] text-white"
                          : "bg-slate-200 text-black hover:bg-slate-300",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <label className="flex h-14 min-w-[320px] items-center gap-3 rounded-xl border border-black bg-white px-4 text-slate-400 shadow-sm transition focus-within:border-[#14532D]">
                  <Search className="h-4 w-4" />

                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={handleBlogModalKeyDown}
                    placeholder="Search posts, tags, or authors..."
                    className="w-full border-0 bg-transparent text-sm font-medium text-black outline-none placeholder:text-black"
                  />
                </label>

                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(event.target.value as SortMode)
                  }
                  className="h-14 rounded-xl border border-black bg-white px-4 text-sm font-semibold text-black shadow-sm outline-none transition focus:border-[#14532D]"
                >
                  <option value="newest">Newest first</option>

                  <option value="most-liked">Most liked</option>
                </select>
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-[640px] flex-col gap-6">
              {feedPosts.length > 0 ? (
                feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    currentUserId={currentUserId}
                    isDeleteLoading={pendingDeletePostId === post.id}
                    isLikeLoading={pendingLikePostIds.includes(post.id)}
                    isOpeningEdit={openEditPostMutation.isPending}
                    onDelete={handleDeletePost}
                    onEdit={openEditBlogModal}
                    onToggleLike={handleToggleLike}
                    onViewMore={openViewPostDialog}
                    post={post}
                  />
                ))
              ) : (
                <div className="rounded-[1.7rem] border border-dashed border-black bg-slate-50/60 px-6 py-12 text-center text-slate-500 shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
                  {isLoading
                    ? "Loading community posts..."
                    : "No posts match this filter yet."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {isBlogModalOpen ? (
        <BlogEditorModal
          bookmarks={bookmarks}
          errorMessage={blogError}
          form={blogForm}
          isLoadingBookmarks={isLoadingBookmarks}
          isSubmitting={isSubmittingBlog}
          mode={blogModalMode}
          selectedTopics={selectedTopics}
          onChangeBody={updateBlogField("body")}
          onChangeTitle={updateBlogField("title")}
          onClose={closeBlogModal}
          onSubmit={handleBlogSubmit}
          onToggleBookmark={toggleBookmarkSelection}
        />
      ) : null}

      <SafeActionDialog
        confirmLabel="Delete post"
        description={
          postPendingDelete
            ? `Delete "${postPendingDelete.title}" from Social Hub? This action cannot be undone.`
            : "Delete this post from Social Hub? This action cannot be undone."
        }
        eyebrow="Safe delete"
        isPending={isDeletingPost}
        onClose={closeDeletePostDialog}
        onConfirm={handleConfirmDeletePost}
        open={deleteDialogPostId !== null}
        pendingLabel="Deleting post..."
        title="Delete this post?"
        variant="danger"
      />

        <PostDetailDialog
            hasError={hasPostDetailError}
            isLoading={isLoadingPostDetail}
            isOpen={viewingPostId !== null}
            onClose={closeViewPostDialog}
            postDetail={viewingPostDetail}
        />
    </div>
  );
}
