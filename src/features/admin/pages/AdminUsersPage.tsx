import { Ban, CheckCircle2, RefreshCw, Search, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  getAdminUserFullName,
  useAdminUsersPage,
} from "@/features/admin/hooks";
import type {
  AdminUserApi,
  AdminUserRole,
} from "@/features/admin/types";
import Pagination from "@/layout/components/Pagination";

type UserStatus = "Active" | "Banned";

const statusClassMap: Record<UserStatus, string> = {
  Active: "bg-green-50 text-green-700 ring-green-100",
  Banned: "bg-red-50 text-red-700 ring-red-100",
};

const booleanClassMap = {
  no: "bg-slate-100 text-slate-600 ring-slate-200",
  yes: "bg-green-50 text-green-700 ring-green-100",
};

function getAdminUsersQueryKey(
  page: number,
  size: number,
): AdminUsersQueryKey {
  return ["adminUsers", page, size, DEFAULT_SORT] as const;
}

function buildFullName(user: AdminUserResponse) {
  const fullName = [user.firstName, user.lastName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ");

  return fullName || user.email;
}

function formatRole(role: string) {
  return role.trim().toUpperCase() || "USER";
}

function formatCreatedAt(value: string) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function mapUserToView(user: AdminUserResponse): AdminUserView {
  return {
    createdAt: formatCreatedAt(user.createdAt),
    email: user.email,
    emailVerified: user.emailVerified,
    fullName: buildFullName(user),
    googleLinked: user.googleLinked,
    id: user.id,
    role: formatRole(user.role),
    status: user.banned ? "Banned" : "Active",
  };
}

function patchUserInPage(
  page: AdminUserPageResponse | undefined,
  userId: string,
  updater: (user: AdminUserResponse) => AdminUserResponse,
) {
  if (!page) return page;

  return {
    ...page,
    items: page.items.map((user) => (user.id === userId ? updater(user) : user)),
  };
}

export default function AdminUsersPage() {
  const {
    accountStatusErrorMessage,
    currentPage,
    filteredUsers,
    handleChangeSelectedAccountStatus,
    handleCloseUserDialog,
    handlePageChange,
    handleSearchQueryChange,
    handleSelectUser,
    isLoadingUsers,
    isSelectedUserChangingStatus,
    listErrorMessage,
    pageSize,
    query,
    selectedUser,
    totalUsers,
  } = useAdminUsersPage();

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              User Account Management
            </h2>
          </div>

          <label className="relative block w-full max-w-sm">
            <span className="sr-only">Search users</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                handleSearchQueryChange(event.target.value)
              }
              placeholder="Search users by name or email..."
              type="search"
              value={query}
            />
          </label>
        </div>

        {feedbackMessage && (
          <div className="border-b border-slate-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700">
            {feedbackMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500">
                <th className="px-5 py-4">STT</th>
                <th className="px-5 py-4">Full Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Email Verified</th>
                <th className="px-5 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoadingUsers &&
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="cursor-pointer text-sm font-medium text-slate-700 transition hover:bg-blue-50/60 focus-within:bg-blue-50/60"
                    onClick={() => handleSelectUser(user.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelectUser(user.id);
                      }
                    }}
                    tabIndex={0}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                      {getAdminUserFullName(user)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="font-semibold text-blue-500">
                        {user.email}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge className={statusClassMap[getUserStatus(user)]}>
                        {getUserStatus(user)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">-</td>
                    <td className="whitespace-nowrap px-5 py-4">-</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {isLoadingUsers && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
              Loading users...
            </div>
          )}

          {!isLoadingUsers && listErrorMessage && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-red-600">
              {listErrorMessage}
            </div>
          )}

          {!isLoadingUsers &&
            !listErrorMessage &&
            filteredUsers.length === 0 && (
              <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
                No users found.
              </div>
            )}
        </div>

        {!isLoadingUsers && !listErrorMessage && totalUsers > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalUsers}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      {selectedUser && (
        <UserDetailDialog
          accountStatusErrorMessage={accountStatusErrorMessage}
          isChangingStatus={isSelectedUserChangingStatus}
          onChangeAccountStatus={handleChangeSelectedAccountStatus}
          onClose={handleCloseUserDialog}
          user={selectedUser}
        />
      )}

      {pendingConfirmation && (
        <ConfirmAccountStatusDialog
          action={pendingConfirmation.action}
          isUpdating={toggleBanMutation.isPending}
          onCancel={() => setPendingConfirmation(null)}
          onConfirm={handleConfirmToggleBan}
          user={pendingConfirmation.user}
        />
      )}
    </>
  );
}

function ConfirmAccountStatusDialog({
  action,
  isUpdating,
  onCancel,
  onConfirm,
  user,
}: {
  action: ToggleBanVariables["action"];
  isUpdating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  user: AdminUserView;
}) {
  const isBanAction = action === "ban";
  const title = isBanAction ? "Confirm account ban" : "Confirm account unban";
  const message = isBanAction
    ? "This account will lose access immediately and active sessions may be revoked."
    : "This account will be allowed to access the system again.";
  const confirmLabel = isBanAction ? "Yes, ban account" : "Yes, unban account";
  const nextStatus = isBanAction ? "Banned" : "Active";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Confirmation
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              {message}
            </p>
          </div>

          <button
            aria-label="Close confirmation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isUpdating}
            onClick={onCancel}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid min-h-[222px] gap-3 p-5 sm:grid-cols-2">
          <DetailItem label="Full Name" value={user.fullName} />
          <DetailItem
            label="Role"
            value={
              <Badge className={roleClassMap[user.role] || roleClassMap.STUDENT}>
                {user.role}
              </Badge>
            }
          />
          <DetailItem
            label="Current Status"
            value={
              <Badge className={statusClassMap[user.status]}>
                {user.status}
              </Badge>
            }
          />
          <DetailItem label="Email" value={user.email} />
          <DetailItem
            label="New Status"
            value={
              <Badge className={statusClassMap[nextStatus]}>
                {nextStatus}
              </Badge>
            }
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            This action will be applied immediately after confirmation.
          </p>

          <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isUpdating}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isBanAction
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700",
            ].join(" ")}
            disabled={isUpdating}
            onClick={onConfirm}
            type="button"
          >
            {isBanAction ? (
              <Ban className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {isUpdating ? "Updating..." : confirmLabel}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDetailDialog({
  accountStatusErrorMessage,
  isChangingStatus,
  onChangeAccountStatus,
  onClose,
  user,
}: {
  accountStatusErrorMessage: string;
  isChangingStatus: boolean;
  onChangeAccountStatus: () => void;
  onClose: () => void;
  user: AdminUserApi;
}) {
  const status = getUserStatus(user);
  const canChangeStatus = user.role !== "ADMIN";
  const actionLabel = user.banned ? "Unban account" : "Ban account";
  const pendingLabel = user.banned ? "Unbanning..." : "Banning...";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              User Details
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-950">
              {getAdminUserFullName(user)}
            </h3>
            <p className="mt-1 text-sm font-medium text-blue-500">
              {user.email}
            </p>
          </div>

          <button
            aria-label="Close user details"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <DetailItem
            label="Role"
            value={
              <Badge className={getRoleClassName(user.role)}>
                {formatRole(user.role)}
              </Badge>
            }
          />
          <DetailItem
            label="Status"
            value={
              <Badge className={statusClassMap[status]}>
                {status}
              </Badge>
            }
          />
          <DetailItem label="Created At" value={formatDateTime(user.createdAt)} />
          <DetailItem label="Followed Topics" value="-" />
          <DetailItem label="Followed Authors" value="-" />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">
              Admin accounts cannot be changed from this table.
            </p>
            {accountStatusErrorMessage && (
              <p className="text-xs font-semibold text-red-600">
                {accountStatusErrorMessage}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            {canChangeStatus && (
              <button
                className={[
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
                  user.banned
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                ].join(" ")}
                disabled={isChangingStatus}
                onClick={onChangeAccountStatus}
                type="button"
              >
                <Ban className="h-4 w-4" />
                {isChangingStatus ? pendingLabel : actionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
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

function getUserStatus(user: AdminUserApi): UserStatus {
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
