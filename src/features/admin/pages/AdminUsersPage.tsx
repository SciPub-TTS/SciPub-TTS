import { Ban, CheckCircle2, RefreshCw, Search, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { adminUsersApi } from "@/features/admin/services";
import type {
  AdminUserPageResponse,
  AdminUserResponse,
} from "@/features/admin/types";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";
import Pagination from "@/layout/components/Pagination";

type AdminUserStatus = "Active" | "Banned";

type AdminUserView = {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  googleLinked: boolean;
  id: string;
  role: string;
  status: AdminUserStatus;
};

type AdminUsersQueryKey = readonly ["adminUsers", number, number, string];

type ToggleBanVariables = {
  action: "ban" | "unban";
  user: AdminUserView;
};

type ToggleBanContext = {
  previousPage?: AdminUserPageResponse;
};

const USERS_PAGE_SIZE = 4;
const DEFAULT_SORT = "RECENT";

const roleClassMap: Record<string, string> = {
  ADMIN: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  LECTURER: "bg-amber-50 text-amber-700 ring-amber-100",
  RESEARCHER: "bg-slate-100 text-slate-600 ring-slate-200",
  STUDENT: "bg-blue-50 text-blue-700 ring-blue-100",
};

const statusClassMap: Record<AdminUserStatus, string> = {
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
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<ToggleBanVariables | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const apiPage = currentPage - 1;
  const adminUsersQueryKey = getAdminUsersQueryKey(apiPage, USERS_PAGE_SIZE);

  const adminUsersQuery = useQuery({
    queryFn: () =>
      adminUsersApi
        .getUsers({
          page: apiPage,
          size: USERS_PAGE_SIZE,
          sort: DEFAULT_SORT,
        })
        .then((response) => response.data),
    queryKey: adminUsersQueryKey,
  });

  const users = useMemo(
    () => (adminUsersQuery.data?.items || []).map(mapUserToView),
    [adminUsersQuery.data],
  );
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [user.id, user.fullName, user.email, user.status, user.role]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);
  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? null;
  const totalItems = query.trim()
    ? filteredUsers.length
    : adminUsersQuery.data?.totalElements ?? 0;
  const isInitialLoading = adminUsersQuery.isPending;

  const toggleBanMutation = useMutation<
    AdminUserResponse,
    Error,
    ToggleBanVariables,
    ToggleBanContext
  >({
    mutationFn: ({ action, user }) =>
      (action === "ban"
        ? adminUsersApi.banUser(user.id)
        : adminUsersApi.unbanUser(user.id)
      ).then((response) => response.data),
    onError: (error, _variables, context) => {
      if (context?.previousPage) {
        queryClient.setQueryData(adminUsersQueryKey, context.previousPage);
      }

      setFeedbackMessage(
        getApiErrorMessage(error, "Could not update this account."),
      );
    },
    onMutate: async ({ action, user }) => {
      setFeedbackMessage(null);
      await queryClient.cancelQueries({ queryKey: adminUsersQueryKey });

      const previousPage =
        queryClient.getQueryData<AdminUserPageResponse>(adminUsersQueryKey);

      queryClient.setQueryData<AdminUserPageResponse | undefined>(
        adminUsersQueryKey,
        (currentPageData) =>
          patchUserInPage(currentPageData, user.id, (currentUser) => ({
            ...currentUser,
            banned: action === "ban",
          })),
      );

      return { previousPage };
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AdminUserPageResponse | undefined>(
        adminUsersQueryKey,
        (currentPageData) =>
          patchUserInPage(currentPageData, updatedUser.id, () => updatedUser),
      );
      setFeedbackMessage(
        updatedUser.banned
          ? "Account banned successfully."
          : "Account unbanned successfully.",
      );
    },
  });

  function handleToggleBan(user: AdminUserView) {
    if (user.role === "ADMIN" || toggleBanMutation.isPending) {
      return;
    }

    setPendingConfirmation({
      action: user.status === "Banned" ? "unban" : "ban",
      user,
    });
  }

  function handleConfirmToggleBan() {
    if (!pendingConfirmation || toggleBanMutation.isPending) {
      return;
    }

    const confirmedAction = pendingConfirmation;
    setPendingConfirmation(null);

    void toggleBanMutation.mutateAsync({
      action: confirmedAction.action,
      user: confirmedAction.user,
    });
  }

  function reloadUsers() {
    setFeedbackMessage(null);
    void adminUsersQuery.refetch();
  }

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
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="Search users on this page..."
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
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="cursor-pointer text-sm font-medium text-slate-700 transition hover:bg-blue-50/60 focus-within:bg-blue-50/60"
                  onClick={() => setSelectedUserId(user.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedUserId(user.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {apiPage * USERS_PAGE_SIZE + index + 1}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                    {user.fullName}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-semibold text-blue-500">
                      {user.email}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge className={statusClassMap[user.status]}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge
                      className={
                        user.emailVerified
                          ? booleanClassMap.yes
                          : booleanClassMap.no
                      }
                    >
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {user.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isInitialLoading && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
              Loading users...
            </div>
          )}

          {adminUsersQuery.isError && !isInitialLoading && (
            <div className="flex flex-col items-center gap-3 border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
              <p>{getApiErrorMessage(adminUsersQuery.error, "Cannot load users.")}</p>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                onClick={reloadUsers}
                type="button"
              >
                <RefreshCw className="h-4 w-4" />
                Reload
              </button>
            </div>
          )}

          {!isInitialLoading
            && !adminUsersQuery.isError
            && filteredUsers.length === 0 && (
              <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
                No users found.
              </div>
            )}
        </div>

        {!query.trim() && !adminUsersQuery.isError && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={USERS_PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {selectedUser && (
        <UserDetailDialog
          isUpdating={toggleBanMutation.isPending}
          onClose={() => setSelectedUserId(null)}
          onToggleBan={() => handleToggleBan(selectedUser)}
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
  isUpdating,
  onClose,
  onToggleBan,
  user,
}: {
  isUpdating: boolean;
  onClose: () => void;
  onToggleBan: () => void;
  user: AdminUserView;
}) {
  const canBan = user.role !== "ADMIN";
  const actionLabel = user.status === "Banned" ? "Unban account" : "Ban account";

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
              {user.fullName}
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
              <Badge className={roleClassMap[user.role] || roleClassMap.STUDENT}>
                {user.role}
              </Badge>
            }
          />
          <DetailItem
            label="Status"
            value={
              <Badge className={statusClassMap[user.status]}>
                {user.status}
              </Badge>
            }
          />
          <DetailItem label="Created At" value={user.createdAt} />
          <DetailItem
            label="Email Verified"
            value={
              <Badge
                className={
                  user.emailVerified ? booleanClassMap.yes : booleanClassMap.no
                }
              >
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            }
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            Admin accounts cannot be banned from this table.
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            {canBan && (
              <button
                className={[
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
                  user.status === "Banned"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                ].join(" ")}
                disabled={isUpdating}
                onClick={onToggleBan}
                type="button"
              >
                {user.status === "Banned" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {isUpdating ? "Updating..." : actionLabel}
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
  children: string;
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
