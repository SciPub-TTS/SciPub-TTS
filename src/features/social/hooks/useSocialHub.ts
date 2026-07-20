import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import { INITIAL_BLOG_FORM, SOCIAL_NEWEST_QUERY_KEY, SOCIAL_TOP_QUERY_KEY } from "@/features/social/constants/socialHub.constants";
import { socialApi } from "@/features/social/services/social.api";
import type { BlogFormState, BlogModalMode, CreateSocialPostRequest, FeedTab, LikeToggleResponse, SocialPostDetail, SocialPostPageResponse, SocialPostSummary, SortMode, UpdateSocialPostRequest } from "@/features/social/types/social.types";
import { decodeJwtSubject, findSocialPostInPage, normalizeIdentityValue, updateSocialPostPageLikeState } from "@/features/social/utils/socialQueryUtils";
import { normalizeSocialOpenAlexId } from "@/features/social/utils/socialFormatters";
import { buildTopicLabelsFromBookmarks, buildTopicTagValue, fetchSocialBookmarkOptions, filterPosts, normalizeSocialPost } from "@/features/social/utils/socialPostUtils";

type ToggleLikeMutationVariables = {
  fallbackLikeCount: number;
  fallbackLiked: boolean;
  postId: string;
};

type ToggleLikeMutationContext = {
  previousNewestPosts?: SocialPostPageResponse;
  previousTopPosts?: SocialPostPageResponse;
};

export function useSocialHub() {
  
    const queryClient = useQueryClient();
    const { accessToken, currentUser } = useAuthSession();
  
    const [activeTab, setActiveTab] = useState<FeedTab>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("newest");
  
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    const [blogModalMode, setBlogModalMode] = useState<BlogModalMode>("create");
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [blogForm, setBlogForm] = useState<BlogFormState>(INITIAL_BLOG_FORM);
    const [blogError, setBlogError] = useState<string | null>(null);
    const [deleteDialogPostId, setDeleteDialogPostId] = useState<string | null>(null);
    const [pendingLikePostIds, setPendingLikePostIds] = useState<string[]>([]);
    const [pendingDeletePostId, setPendingDeletePostId] = useState<string | null>(null);
    const pendingLikePostIdsRef = useRef<Set<string>>(new Set());
  
    const {
      data: newestPostsPage,
      error: newestPostsError,
      isError: hasNewestPostsError,
      isPending: isLoadingNewestPosts,
    } = useQuery({
      queryFn: () => socialApi.getNewest(0, 20),
      queryKey: SOCIAL_NEWEST_QUERY_KEY,
      retry: false,
    });
  
    const {
      data: topPostsPage,
      error: topPostsError,
      isError: hasTopPostsError,
      isPending: isLoadingTopPosts,
    } = useQuery({
      queryFn: () => socialApi.getTop(0, 5),
      queryKey: SOCIAL_TOP_QUERY_KEY,
      retry: false,
    });
  
    const {
      data: bookmarkList = [],
      isPending: isLoadingBookmarks,
    } = useQuery({
      enabled: isBlogModalOpen,
      queryFn: fetchSocialBookmarkOptions,
      queryKey: ["social", "bookmark-options"],
      retry: false,
    });
  
    const openEditPostMutation = useMutation({
      mutationFn: (postId: string) => socialApi.getPostDetail(postId),
      onError: (error) => {
        setBlogError(
          getApiErrorMessage(
            error,
            "Cannot open this post for editing right now. Please try again.",
          ),
        );
      },
      onSuccess: (postDetail: SocialPostDetail) => {
        setBlogModalMode("edit");
        setEditingPostId(postDetail.id);
        setBlogForm({
          title: postDetail.title,
          body: postDetail.body ?? "",
          selectedOpenAlexIds: postDetail.references.map(
            (reference) => normalizeSocialOpenAlexId(reference.openalexId),
          ),
        });
        setBlogError(null);
        setIsBlogModalOpen(true);
      },
    });
  
    const createPostMutation = useMutation({
      mutationFn: (payload: CreateSocialPostRequest) => socialApi.createPost(payload),
      onSuccess: () => {
        resetBlogModal();
        void queryClient.invalidateQueries({ queryKey: ["social"] });
      },
      onError: (error) => {
        setBlogError(
          getApiErrorMessage(
            error,
            "Cannot publish this research blog right now. Please try again.",
          ),
        );
      },
    });
  
    const updatePostMutation = useMutation({
      mutationFn: ({
        payload,
        postId,
      }: {
        payload: UpdateSocialPostRequest;
        postId: string;
      }) => socialApi.updatePost(postId, payload),
      onSuccess: () => {
        resetBlogModal();
        void queryClient.invalidateQueries({ queryKey: ["social"] });
      },
      onError: (error) => {
        setBlogError(
          getApiErrorMessage(
            error,
            "Cannot save blog changes right now. Please try again.",
          ),
        );
      },
    });
  
    const deletePostMutation = useMutation({
      mutationFn: (postId: string) => socialApi.deletePost(postId),
      onMutate: (postId: string) => {
        setPendingDeletePostId(postId);
      },
      onSuccess: (_response, postId) => {
        if (editingPostId === postId) {
          resetBlogModal();
        }
  
        void queryClient.invalidateQueries({ queryKey: ["social"] });
      },
      onError: (error) => {
        setBlogError(
          getApiErrorMessage(
            error,
            "Cannot delete this post right now. Please try again.",
          ),
        );
      },
      onSettled: () => {
        setDeleteDialogPostId(null);
        setPendingDeletePostId(null);
      },
    });
  
    const feedSourcePosts = (newestPostsPage?.content ?? []).map(
      normalizeSocialPost,
    );
    const topSourcePosts = (topPostsPage?.content ?? []).map(
      normalizeSocialPost,
    );
    const bookmarks = bookmarkList;
  
    const toggleLikeMutation = useMutation<
      LikeToggleResponse,
      Error,
      ToggleLikeMutationVariables,
      ToggleLikeMutationContext
    >({
      mutationFn: ({ postId }) => socialApi.toggleLike(postId),
      onMutate: async ({ fallbackLikeCount, fallbackLiked, postId }) => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: SOCIAL_NEWEST_QUERY_KEY }),
          queryClient.cancelQueries({ queryKey: SOCIAL_TOP_QUERY_KEY }),
        ]);
  
        const previousNewestPosts = queryClient.getQueryData<SocialPostPageResponse>(
          SOCIAL_NEWEST_QUERY_KEY,
        );
        const previousTopPosts = queryClient.getQueryData<SocialPostPageResponse>(
          SOCIAL_TOP_QUERY_KEY,
        );
  
        const currentPost =
          findSocialPostInPage(previousNewestPosts, postId)
          ?? findSocialPostInPage(previousTopPosts, postId);
        const currentLikeCount = currentPost?.likeCount ?? fallbackLikeCount;
        const currentLiked = currentPost?.liked ?? fallbackLiked;
        const optimisticState: LikeToggleResponse = {
          liked: !currentLiked,
          likeCount: Math.max(0, currentLikeCount + (currentLiked ? -1 : 1)),
        };
  
        queryClient.setQueryData<SocialPostPageResponse | undefined>(
          SOCIAL_NEWEST_QUERY_KEY,
          (current) => updateSocialPostPageLikeState(current, postId, optimisticState),
        );
        queryClient.setQueryData<SocialPostPageResponse | undefined>(
          SOCIAL_TOP_QUERY_KEY,
          (current) => updateSocialPostPageLikeState(current, postId, optimisticState),
        );
        return {
          previousNewestPosts,
          previousTopPosts,
        };
      },
      onError: (_error, _variables, context) => {
        if (context?.previousNewestPosts) {
          queryClient.setQueryData(SOCIAL_NEWEST_QUERY_KEY, context.previousNewestPosts);
        }
  
        if (context?.previousTopPosts) {
          queryClient.setQueryData(SOCIAL_TOP_QUERY_KEY, context.previousTopPosts);
        }
  
      },
      onSuccess: (response, { postId }) => {
        queryClient.setQueryData<SocialPostPageResponse | undefined>(
          SOCIAL_NEWEST_QUERY_KEY,
          (current) => updateSocialPostPageLikeState(current, postId, response),
        );
        queryClient.setQueryData<SocialPostPageResponse | undefined>(
          SOCIAL_TOP_QUERY_KEY,
          (current) => updateSocialPostPageLikeState(current, postId, response),
        );
      },
      onSettled: (_response, _error, variables) => {
        if (!variables) {
          return;
        }
  
        pendingLikePostIdsRef.current.delete(variables.postId);
        setPendingLikePostIds((previous) =>
          previous.filter((currentPostId) => currentPostId !== variables.postId),
        );
        void queryClient.invalidateQueries({ queryKey: SOCIAL_NEWEST_QUERY_KEY });
        void queryClient.invalidateQueries({ queryKey: SOCIAL_TOP_QUERY_KEY });
      },
    });
  
    const featuredPost = topSourcePosts[0] ?? feedSourcePosts[0] ?? null;
  
    const currentUserId = (
      normalizeIdentityValue(currentUser?.id)
      ?? decodeJwtSubject(accessToken)
      ?? undefined
    );
  
    const selectedBookmarks = bookmarks.filter((bookmark) =>
      blogForm.selectedOpenAlexIds.includes(
        normalizeSocialOpenAlexId(bookmark.openAlexId),
      ),
    );
    const selectedTopics = buildTopicLabelsFromBookmarks(selectedBookmarks);
    const filteredPosts = filterPosts(
      feedSourcePosts,
      activeTab,
      searchQuery,
      currentUserId,
    );
    const feedPosts = sortMode === "most-liked"
      ? [...filteredPosts].sort((left, right) => right.likeCount - left.likeCount)
      : filteredPosts;
    const topLikedPosts = topSourcePosts.slice(0, 5);
    const postPendingDelete = deleteDialogPostId
      ? (
          feedPosts.find((post) => post.id === deleteDialogPostId)
          ?? topSourcePosts.find((post) => post.id === deleteDialogPostId)
          ?? (featuredPost?.id === deleteDialogPostId ? featuredPost : null)
        )
      : null;
  
    function resetBlogModal() {
      setIsBlogModalOpen(false);
      setBlogModalMode("create");
      setEditingPostId(null);
      setBlogForm(INITIAL_BLOG_FORM);
      setBlogError(null);
    }
  
    function openCreateBlogModal() {
      setBlogModalMode("create");
      setEditingPostId(null);
      setBlogForm(INITIAL_BLOG_FORM);
      setBlogError(null);
      setIsBlogModalOpen(true);
    }
  
    function openEditBlogModal(postId: string) {
      if (openEditPostMutation.isPending) {
        return;
      }
  
      setBlogError(null);
      openEditPostMutation.mutate(postId);
    }
  
    function closeBlogModal() {
      if (createPostMutation.isPending || updatePostMutation.isPending) {
        return;
      }
  
      resetBlogModal();
    }
  
    function updateBlogField(field: "title" | "body") {
      return (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
      ) => {
        const nextValue = event.target.value;
  
        setBlogForm((previous) => ({
          ...previous,
          [field]: nextValue,
        }));
      };
    }
  
    function toggleBookmarkSelection(openAlexId: string) {
      const normalizedOpenAlexId = normalizeSocialOpenAlexId(openAlexId);
  
      if (!normalizedOpenAlexId) {
        return;
      }
  
      setBlogForm((previous) => {
        const isSelected = previous.selectedOpenAlexIds.includes(normalizedOpenAlexId);
  
        if (isSelected) {
          return {
            ...previous,
            selectedOpenAlexIds: previous.selectedOpenAlexIds.filter(
              (id) => id !== normalizedOpenAlexId,
            ),
          };
        }
  
        if (previous.selectedOpenAlexIds.length >= 3) {
          setBlogError("You can add up to 3 bookmarked papers to one blog post.");
          return previous;
        }
  
        return {
          ...previous,
          selectedOpenAlexIds: [
            ...previous.selectedOpenAlexIds,
            normalizedOpenAlexId,
          ],
        };
      });
    }
  
    function handleBlogSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
  
      const normalizedTitle = blogForm.title.trim();
      const normalizedBody = blogForm.body.trim();
      const topicTag = buildTopicTagValue(selectedTopics);
  
      if (!normalizedTitle) {
        setBlogError("Please enter a title before saving.");
        return;
      }
  
      if (normalizedTitle.length < 10 || normalizedTitle.length > 300) {
        setBlogError("Title must be between 10 and 300 characters.");
        return;
      }
  
      if (blogForm.selectedOpenAlexIds.length > 3) {
        setBlogError("You can add up to 3 bookmarked papers to one blog post.");
        return;
      }
  
      if (topicTag && topicTag.length > 500) {
        setBlogError(
          "Selected topics are too long for one post. Please choose fewer papers.",
        );
        return;
      }
  
      const selectedOpenAlexIds = Array.from(
        new Set(blogForm.selectedOpenAlexIds.map(normalizeSocialOpenAlexId)),
      ).filter(Boolean);
  
      const payload = {
        title: normalizedTitle,
        body: normalizedBody,
        topicTag,
        references: selectedOpenAlexIds,
      };
  
      setBlogError(null);
  
      if (blogModalMode === "edit" && editingPostId) {
        updatePostMutation.mutate({
          payload,
          postId: editingPostId,
        });
        return;
      }
  
      createPostMutation.mutate(payload);
    }
  
    function handleToggleLike(post: SocialPostSummary) {
      if (pendingLikePostIdsRef.current.has(post.id)) {
        return;
      }
  
      pendingLikePostIdsRef.current.add(post.id);
      setPendingLikePostIds((previous) =>
        previous.includes(post.id) ? previous : [...previous, post.id],
      );
  
      toggleLikeMutation.mutate({
        fallbackLikeCount: post.likeCount,
        fallbackLiked: post.liked,
        postId: post.id,
      });
    }
  
    function handleDeletePost(postId: string) {
      if (deletePostMutation.isPending) {
        return;
      }
  
      setDeleteDialogPostId(postId);
    }
  
    function closeDeletePostDialog() {
      if (deletePostMutation.isPending) {
        return;
      }
  
      setDeleteDialogPostId(null);
    }
  
    async function handleConfirmDeletePost() {
      if (!deleteDialogPostId || deletePostMutation.isPending) {
        return;
      }
  
      setBlogError(null);
      await deletePostMutation.mutateAsync(deleteDialogPostId);
    }
  
    function handleBlogModalKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    }
  
    const isLoading = isLoadingNewestPosts || isLoadingTopPosts;
    const isSubmittingBlog =
      createPostMutation.isPending || updatePostMutation.isPending;
  
    const hasError = hasNewestPostsError || hasTopPostsError;
    const errorMessage = newestPostsError
      ? getApiErrorMessage(
          newestPostsError,
          "Cannot load community posts right now.",
        )
      : topPostsError
        ? getApiErrorMessage(
            topPostsError,
            "Cannot load top liked posts right now.",
          )
        : null;

  return {
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
    isLoading,
    isLoadingBookmarks,
    isDeletingPost: deletePostMutation.isPending,
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
  };
}
