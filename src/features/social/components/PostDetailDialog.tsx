import { Clock3, Heart, Loader2, X } from "lucide-react";

import { SocialAvatar } from "@/features/social/components/SocialAvatar";
import { SocialReferenceList } from "@/features/social/components/SocialReferenceList";
import type { SocialPostDetail } from "@/features/social/types/social.types";

export default function PostDetailDialog({
                                             hasError,
                                             isLoading,
                                             isOpen,
                                             onClose,
                                             postDetail,
                                         }: {
    hasError: boolean;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
    postDetail?: SocialPostDetail;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={onClose}
        >
            <div
                className="max-h-[85vh] w-full max-w-[680px] overflow-y-auto rounded-[1.85rem] border border-black bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.15)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-[#14532D]">
                        Post Details
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-full border border-black p-1.5 text-black transition hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                    </div>
                ) : hasError || !postDetail ? (
                    <div className="py-16 text-center text-rose-600">
                        Failed to load post content. Please try again.
                    </div>
                ) : (
                    <>
                        <div className="mt-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <SocialAvatar
                                    avatarUrl={postDetail.author.avatarUrl}
                                    fullName={postDetail.author.fullName}
                                    seed={postDetail.author.id}
                                    sizeClassName="h-12 w-12"
                                />
                                <p className="text-[1.08rem] font-semibold text-black">
                                    {postDetail.author.fullName}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-black">
                                <Clock3 className="h-4 w-4" />
                                <span>{postDetail.updatedAt ?? postDetail.createdAt}</span>
                            </div>
                        </div>

                        <h3 className="font-brand mt-6 text-[2.1rem] font-normal leading-[1.08] text-[#14532D]">
                            {postDetail.title}
                        </h3>

                        <p className="font-subtext mt-4 whitespace-pre-wrap break-words text-[1.05rem] leading-9 text-slate-600">
                            {postDetail.body}
                        </p>

                        <SocialReferenceList
                            references={postDetail.references ?? []}
                            titleClassName="text-sm font-semibold text-black"
                            wrapperClassName="mt-5 rounded-[1.25rem] border border-black bg-slate-50/60 px-4 py-4"
                        />

                        <div className="mt-6 flex items-center gap-2 border-t border-black/8 pt-5 text-sm font-semibold text-[#F33E58]">
                            <Heart className="h-4 w-4 fill-current" />
                            {postDetail.likeCount} {postDetail.likeCount === 1 ? 'like' : 'likes'}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}