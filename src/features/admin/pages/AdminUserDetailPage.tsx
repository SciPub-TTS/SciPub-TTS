import {
  ArrowLeft,
  Ban,
  Bookmark,
  Search,
  ShieldCheck,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ROUTES } from "@/app/router";
import {
  getAdminUserFullName,
  useAdminUserDetailPage,
} from "@/features/admin/hooks";
import type { AdminUserDetail, AdminUserRole } from "@/features/admin/types";
import Pagination from "@/layout/components/Pagination";

type UserStatus = "Active" | "Banned";

const statusClassMap: Record<UserStatus, string> = {
  Active: "bg-green-50 text-green-700 ring-green-100",
  Banned: "bg-red-50 text-red-700 ring-red-100",
};

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [isAccountStatusDialogOpen, setIsAccountStatusDialogOpen] =
    useState(false);
  const {
    accountStatusErrorMessage,
    detail,
    detailErrorMessage,
    handleChangeAccountStatus,
    handleSearchHistoryPageChange,
    isChangingAccountStatus,
    isLoadingDetail,
    isLoadingSearchHistory,
    isUserNotFound,
    searchHistory,
    searchHistoryErrorMessage,
    searchHistoryPage,
    searchHistoryPageSize,
  } = useAdminUserDetailPage(userId);

  if (isLoadingDetail) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500 shadow-sm">
        Loading user details...
      </div>
    );
  }

  if (isUserNotFound || !detail) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">User not found</h2>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {detailErrorMessage || "This account does not exist or was removed."}
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
          to={ROUTES.ADMIN_USERS}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
      </section>
    );
  }

  const { activity, profile, user } = detail;
  const status = getUserStatus(user);
  const canChangeStatus = user.role !== "ADMIN";
  const accountStatusActionLabel = user.banned ? "Unban account" : "Ban account";

  function handleConfirmAccountStatusChange() {
    handleChangeAccountStatus();
    setIsAccountStatusDialogOpen(false);
  }

  return (
    <>
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
              to={ROUTES.ADMIN_USERS}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to users
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-950">
                {getAdminUserFullName(user)}
              </h2>
              <Badge className={statusClassMap[status]}>{status}</Badge>
            </div>
            <p className="mt-2 text-sm font-semibold text-blue-500">
              {user.email}
            </p>
          </div>

          {canChangeStatus && (
            <button
              className={[
                "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
                user.banned
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700",
              ].join(" ")}
              disabled={isChangingAccountStatus}
              onClick={() => setIsAccountStatusDialogOpen(true)}
              type="button"
            >
              {user.banned ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              {isChangingAccountStatus
                ? user.banned
                  ? "Unbanning..."
                  : "Banning..."
                : user.banned
                  ? "Unban account"
                  : "Ban account"}
            </button>
          )}
        </div>

        {accountStatusErrorMessage && (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {accountStatusErrorMessage}
          </p>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Panel title="User Overview">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-2xl font-bold text-slate-500">
              {user.avatarUrl ? (
                <img
                  alt={getAdminUserFullName(user)}
                  className="h-full w-full object-cover"
                  src={user.avatarUrl}
                />
              ) : (
                getInitials(getAdminUserFullName(user))
              )}
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Full Name" value={getAdminUserFullName(user)} />
              <DetailItem label="Username" value={user.username || "Unknown"} />
              <DetailItem label="Email" value={user.email} />
              <DetailItem
                label="Role"
                value={
                  <Badge className={getRoleClassName(user.role)}>
                    {formatRole(user.role)}
                  </Badge>
                }
              />
              <DetailItem
                label="Email Verified"
                value={<BooleanBadge value={user.emailVerified} />}
              />
              <DetailItem
                label="Created At"
                value={formatNullableDateTime(user.createdAt)}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Profile">
          <div className="grid gap-3">
            <DetailItem
              label="Institution"
              value={profile.institution || "Not provided"}
            />
            <DetailItem
              label="Department"
              value={profile.department || "Not provided"}
            />
            <DetailItem label="Country" value={profile.country || "Not provided"} />
            <DetailItem
              label="Updated At"
              value={formatNullableDateTime(profile.updatedAt)}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ActivityCard
          icon={Tags}
          label="Topics followed"
          value={activity.topicCount}
          tone="blue"
        />
        <ActivityCard
          icon={Users}
          label="Authors followed"
          value={activity.authorCount}
          tone="emerald"
        />
        <ActivityCard
          icon={Bookmark}
          label="Bookmarks"
          value={activity.bookmarkCount}
          tone="amber"
        />
        <ActivityCard
          icon={Search}
          label="Search history"
          value={activity.searchCount}
          tone="indigo"
        />
      </div>

      <Panel title="Recent Search History">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <th className="px-4 py-3">Keyword</th>
                <th className="px-4 py-3">Searched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoadingSearchHistory &&
                !searchHistoryErrorMessage &&
                searchHistory?.items.map((item) => (
                  <tr key={`${item.keyword}-${item.searchedAt}`}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      {item.keyword}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-500">
                      {formatNullableDateTime(item.searchedAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {isLoadingSearchHistory && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
              Loading search history...
            </div>
          )}

          {!isLoadingSearchHistory && searchHistoryErrorMessage && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-red-600">
              {searchHistoryErrorMessage}
            </div>
          )}

          {!isLoadingSearchHistory &&
            !searchHistoryErrorMessage &&
            searchHistory?.items.length === 0 && (
              <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
                This user has no recent search history.
              </div>
            )}
        </div>

        {searchHistory && searchHistory.totalElements > 0 && (
          <Pagination
            currentPage={searchHistoryPage}
            pageSize={searchHistoryPageSize}
            totalItems={searchHistory.totalElements}
            onPageChange={handleSearchHistoryPageChange}
          />
        )}
      </Panel>
    </section>
    {isAccountStatusDialogOpen && (
      <ConfirmAccountStatusDialog
        actionLabel={accountStatusActionLabel}
        isBanned={user.banned}
        isSubmitting={isChangingAccountStatus}
        userName={getAdminUserFullName(user)}
        onCancel={() => setIsAccountStatusDialogOpen(false)}
        onConfirm={handleConfirmAccountStatusChange}
      />
    )}
    </>
  );
}

function ConfirmAccountStatusDialog({
  actionLabel,
  isBanned,
  isSubmitting,
  onCancel,
  onConfirm,
  userName,
}: {
  actionLabel: string;
  isBanned: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userName: string;
}) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-xl",
            isBanned ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
          ].join(" ")}
        >
          {isBanned ? (
            <ShieldCheck className="h-6 w-6" />
          ) : (
            <Ban className="h-6 w-6" />
          )}
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-950">
          {actionLabel}
        </h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Are you sure you want to {isBanned ? "unban" : "ban"}{" "}
          <span className="font-bold text-slate-800">{userName}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={[
              "rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isBanned
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700",
            ].join(" ")}
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? "Processing..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function ActivityCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: LucideIcon;
  label: string;
  tone: "amber" | "blue" | "emerald" | "indigo";
  value: number;
}) {
  const toneClasses = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-950">
            {formatCount(value)}
          </p>
        </div>
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-lg",
            toneClasses[tone],
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

function BooleanBadge({ value }: { value: boolean }) {
  return (
    <Badge
      className={
        value
          ? "bg-green-50 text-green-700 ring-green-100"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }
    >
      {value ? "Yes" : "No"}
    </Badge>
  );
}

function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={[
        "inline-flex min-w-16 justify-center rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function getUserStatus(user: AdminUserDetail["user"]): UserStatus {
  return user.banned ? "Banned" : "Active";
}

function formatRole(role: AdminUserRole) {
  return role
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getRoleClassName(role: AdminUserRole) {
  switch (role) {
    case "ADMIN":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    case "LECTURER":
      return "bg-amber-50 text-amber-700 ring-amber-100";
    case "RESEARCHER":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    case "STUDENT":
      return "bg-blue-50 text-blue-700 ring-blue-100";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
}

function formatNullableDateTime(value: string | null) {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCount(value: number | null | undefined) {
  return new Intl.NumberFormat("en").format(value ?? 0);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
