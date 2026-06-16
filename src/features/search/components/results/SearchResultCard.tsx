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

import { routePaths } from "@/app/router";
import { markSearchPageRestorePending } from "@/features/search/utils/navigationState";
import type { SearchResultItem } from "@/features/search/types";
import { formatFullNumber } from "@/features/search/utils";

import { PaperResultCard } from "./PaperResultCard";

type SearchResultCardProps = {
  item: SearchResultItem;
};

export function SearchResultCard({ item }: SearchResultCardProps) {
  // Chọn đúng card theo entity để phần render bên ngoài không phải if/else nhiều nơi.
  switch (item.entityType) {
    case "works":
      return <PaperResultCard paper={item} />;
    case "authors":
      return (
        <EntityCardLayout
          heroIcon={<User className="h-5 w-5" />}
          showFollowButton
          detailHref={routePaths.authorDetail(item.id)}
          title={item.displayName}
          worksCount={item.worksCount}
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
        />
      );
    case "topics":
      return (
        <EntityCardLayout
          heroIcon={<Layers3 className="h-5 w-5" />}
          showFollowButton
          followButtonTitle="Topic follow is coming soon."
          detailHref={routePaths.topicDetail(item.id)}
          title={item.displayName}
          worksCount={item.worksCount}
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
        />
      );
  }
}

type EntityCardLayoutProps = {
  detailHref: string;
  followButtonTitle?: string;
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
  followButtonTitle = "Follow is coming soon.",
  heroIcon,
  metadataItems,
  showFollowButton = false,
  title,
  worksCount,
}: EntityCardLayoutProps) {
  // Layout dùng chung cho 4 entity mới để style và vị trí action luôn nhất quán.
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50/60">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-5">
        <div className="min-w-0 flex items-start gap-3 lg:col-start-1 lg:row-start-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#EEF6FF] text-[#005CB9]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-white">
              {heroIcon}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-[24px] font-semibold leading-tight text-slate-950">
              {title}
            </h3>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#005CB9]">
              Research entity snapshot
            </p>
          </div>
        </div>

        <div className="flex justify-start lg:col-start-2 lg:row-start-1 lg:justify-end">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#005CB9] bg-[#EEF6FF] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#005CB9]">
            <FileText className="h-3.5 w-3.5 tracking-normal" />
            {formatFullNumber(worksCount)} works
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:col-start-1 lg:row-start-2">
          <p className="flex flex-wrap items-center text-sm font-semibold leading-6 text-slate-800">
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
          {showFollowButton ? (
            <button
              type="button"
              title={followButtonTitle}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00A859] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#007A41]"
            >
              + Follow
            </button>
          ) : null}

          <Link
            to={detailHref}
            onClick={markSearchPageRestorePending}
            className="inline-flex items-center gap-2 rounded-xl border border-[#14532D] bg-white px-3.5 py-2 text-xs font-semibold text-[#14532D] transition hover:border-[#14532D] hover:bg-[#14532D] hover:text-white"
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
        <span className="mx-2 text-slate-400" aria-hidden="true">
          &bull;
        </span>
      )}
      <span className="inline-flex min-w-0 items-center gap-2 align-middle">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
          {icon}
        </span>
        <span className="break-words">{value}</span>
      </span>
    </>
  );
}
