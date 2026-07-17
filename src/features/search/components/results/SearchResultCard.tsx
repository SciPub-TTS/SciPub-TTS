import {
  BookOpen,
  Building2,
  Eye,
  FileText,
  Globe2,
  Layers3,
  Tags,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  buildDetailTrailUrl,
  persistRootDetailNavigation,
} from "@/features/detail/detailTrail";
import { useEntityFollow } from "@/features/follows/hooks/useEntityFollow";
import type { FollowTargetType } from "@/features/follows/types/follow.types";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import type { SearchResultItem } from "@/features/search/types";
import { formatFullNumber } from "@/features/search/utils";

import { PaperResultCard } from "./PaperResultCard";

type SearchResultCardProps = {
  item: SearchResultItem;
};

export function SearchResultCard({
  item,
}: SearchResultCardProps) {
  switch (item.entityType) {
    case "works":
      return (
        <PaperResultCard
          paper={item}
        />
      );
    case "authors":
      return (
        <EntityCardLayout
          detailHref={buildDetailTrailUrl("authors", item.id, [], "search")}
          onDetailClick={() => {
            persistRootDetailNavigation("authors", item.id, "search");
          }}
          followTargetId={item.id}
          followTargetType="AUTHOR"
          heroIcon={<User className="h-5 w-5" />}
          metadataItems={[
            {
              icon: <Building2 className="h-3 w-3" />,
              text: `Institution: ${item.primaryInstitutionName || "No institution available"}`,
            },
            {
              icon: <Tags className="h-3 w-3" />,
              text: `Topic: ${item.primaryTopicName || "No topic available"}`,
            },
          ]}
          showFollowButton
          title={item.displayName}
          worksCount={item.worksCount}
        />
      );
    case "topics":
      return (
        <EntityCardLayout
          detailHref={buildDetailTrailUrl("topics", item.id, [], "search")}
          onDetailClick={() => {
            persistRootDetailNavigation("topics", item.id, "search");
          }}
          followTargetId={item.id}
          followTargetType="TOPIC"
          heroIcon={<Layers3 className="h-5 w-5" />}
          metadataItems={[
            {
              icon: <Tags className="h-3 w-3" />,
              text: `Subfield: ${item.subfieldName || "No subfield available"}`,
            },
            {
              icon: <BookOpen className="h-3 w-3" />,
              text: `Field: ${item.fieldName || "No field available"}`,
            },
            {
              icon: <Globe2 className="h-3 w-3" />,
              text: `Domain: ${item.domainName || "No domain available"}`,
            },
          ]}
          showFollowButton
          title={item.displayName}
          worksCount={item.worksCount}
        />
      );
  }
}

type EntityCardLayoutProps = {
  detailHref: string;
  onDetailClick?: () => void;
  followTargetId?: string;
  followTargetType?: FollowTargetType;
  heroIcon: ReactNode;
  metadataItems: {
    icon: ReactNode;
    text: string;
  }[];
  showFollowButton?: boolean;
  title: string;
  worksCount: number;
};

function EntityCardLayout({
  detailHref,
  onDetailClick,
  followTargetId,
  followTargetType,
  heroIcon,
  metadataItems,
  showFollowButton = false,
  title,
  worksCount,
}: EntityCardLayoutProps) {
  const {
    buttonLabel: followButtonLabel,
    handleFollowClick,
    isFollowActionPending,
    isFollowed,
  } = useEntityFollow({
    displayName: title,
    targetOpenAlexId: followTargetId || "",
    targetType: followTargetType || "AUTHOR",
  });
  const followButtonClassName = isFollowed
    ? "border border-[#14532D] bg-[#14532D] text-white hover:border-[#0f3d22] hover:bg-[#0f3d22] hover:text-white"
    : "border border-black bg-white text-black hover:border-[#14532D] hover:bg-[#14532D] hover:text-white";

  return (
    <article className="rounded-[28px] border border-black bg-white px-5 py-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-5">
        <div className="min-w-0 flex items-center gap-3 lg:col-start-1 lg:row-start-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-black bg-[#FFF4EC] text-[#F37021]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white text-[#F37021]">
              {heroIcon}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-[24px] font-semibold leading-tight text-black">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex justify-start lg:col-start-2 lg:row-start-1 lg:justify-end">
          <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-black bg-[#EFFBFF] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.24em] text-[#1D9BF0]">
            <FileText className="h-4 w-4 tracking-normal text-[#1D9BF0]" />
            {formatFullNumber(worksCount)} works
          </span>
        </div>

        <div className="rounded-2xl border border-black bg-[#FFFCF7] px-4 py-3 lg:col-start-1 lg:row-start-2">
          <p className="flex flex-wrap items-center text-sm font-semibold leading-6 text-black">
            {metadataItems.map((item, index) => (
              <MetadataItem
                key={`${item.text}-${index}`}
                icon={item.icon}
                isFirst={index === 0}
                value={item.text}
              />
            ))}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:col-start-2 lg:row-start-2 lg:justify-end lg:self-end">
          {showFollowButton && followTargetId && followTargetType ? (
            <button
              type="button"
              disabled={isFollowActionPending}
              onClick={() => {
                void handleFollowClick();
              }}
              title={isFollowed ? "Unfollow this entity" : "Follow this entity"}
              className={[
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-70",
                followButtonClassName,
              ].join(" ")}
            >
              {followButtonLabel}
            </button>
          ) : null}

          <Link
            to={detailHref}
            onClick={() => {
              onDetailClick?.();
              markSearchPageRestorePending();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-black bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

type MetadataItemProps = {
  icon: ReactNode;
  isFirst: boolean;
  value: string;
};

function MetadataItem({ icon, isFirst, value }: MetadataItemProps) {
  return (
    <>
      {isFirst ? null : (
        <span className="mx-2 text-black/35" aria-hidden="true">
          &bull;
        </span>
      )}
      <span className="inline-flex min-w-0 items-center gap-2 align-middle">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black bg-white text-[#7AC143]">
          {icon}
        </span>
        <span className="break-words">{value}</span>
      </span>
    </>
  );
}
