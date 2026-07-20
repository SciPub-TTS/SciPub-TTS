import { Clock3, Heart, Pencil, Trash2 } from "lucide-react";

import { SECONDARY_BUTTON_CLASS } from "@/features/social/constants/socialHub.constants";
import { SocialAvatar } from "@/features/social/components/SocialAvatar";
import { SocialReferenceList } from "@/features/social/components/SocialReferenceList";
import type { SocialPostSummary } from "@/features/social/types/social.types";
import { normalizeIdentityValue } from "@/features/social/utils/socialQueryUtils";

export function PostCard({

  currentUserId,

  isDeleteLoading,

  isLikeLoading,

  isOpeningEdit,

  onDelete,

  onEdit,

  onToggleLike,

  post,

}: {

  currentUserId?: string;

  isDeleteLoading: boolean;

  isLikeLoading: boolean;

  isOpeningEdit: boolean;

  onDelete: (postId: string) => void;

  onEdit: (postId: string) => void;

  onToggleLike: (post: SocialPostSummary) => void;

  post: SocialPostSummary;

}) {

  const canManagePost =
    normalizeIdentityValue(currentUserId) === normalizeIdentityValue(post.author.id);
  const references = post.references ?? [];



  return (

    <article className="overflow-hidden rounded-[1.85rem] border border-black bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <SocialAvatar

            avatarUrl={post.author.avatarUrl}

            fullName={post.author.fullName}

            seed={post.author.id}

            sizeClassName="h-12 w-12"

          />



          <div className="min-w-0">

            <p className="wrap-anywhere text-[1.08rem] font-semibold text-black">

              {post.author.fullName}

            </p>

          </div>

        </div>



        <div className="flex items-center gap-2 text-sm text-black">

          <Clock3 className="h-4 w-4" />

          <span>{post.updatedAt ?? post.createdAt}</span>

        </div>

      </div>



      <h3 className="font-brand mt-6 wrap-anywhere text-[2.35rem] font-normal leading-[1.08] text-[#14532D]">

        {post.title}

      </h3>



      <p className="font-subtext mt-4 break-words [overflow-wrap:anywhere] whitespace-pre-wrap text-[1.1rem] leading-9 text-slate-500">

        {post.bodyPreview}

      </p>



      <SocialReferenceList
        references={references}
        titleClassName="text-sm font-semibold text-black"
        wrapperClassName="mt-5 rounded-[1.25rem] border border-black bg-slate-50/60 px-4 py-4"

      />



      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">

        <div className="flex items-center gap-3">

          <button

            type="button"

            onClick={() => onToggleLike(post)}

            disabled={isLikeLoading}

            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${

              post.liked

                ? "border-[#F33E58] bg-[#FDECEF] text-[#F33E58]"

                : "border-black bg-white text-black hover:border-[#F33E58] hover:bg-[#F33E58] hover:text-white"

            } ${isLikeLoading ? "cursor-not-allowed opacity-60" : ""}`}

          >

            <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />

            {post.likeCount}

          </button>

        </div>



        {canManagePost ? (

          <div className="flex flex-wrap items-center gap-2">

            <button

              type="button"

              onClick={() => onEdit(post.id)}

              disabled={isOpeningEdit || isDeleteLoading}

              className={`${SECONDARY_BUTTON_CLASS} ${

                isOpeningEdit || isDeleteLoading

                  ? "cursor-not-allowed opacity-60"

                  : ""

              }`}

            >

              <Pencil className="h-4 w-4" />

              Edit

            </button>



            <button

              type="button"

              onClick={() => onDelete(post.id)}

              disabled={isDeleteLoading}

              className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#DC2626] bg-white px-4 py-3 text-sm font-semibold text-[#DC2626] transition hover:bg-[#DC2626] hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${

                isDeleteLoading ? "cursor-not-allowed opacity-60" : ""

              }`}

            >

              <Trash2 className="h-4 w-4" />

              Delete

            </button>

          </div>

        ) : null}

      </div>

    </article>

  );

}
