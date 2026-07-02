import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { routePaths } from "@/app/router";
import {
  adminUsersSortOptions,
  getAdminUserFullName,
  useAdminUsersPage,
} from "@/features/admin/hooks";
import type {
  AdminUserApi,
  AdminUsersSort,
} from "@/features/admin/types";
import Pagination from "@/layout/global/Pagination";

type UserStatus = "Active" | "Banned";

const statusClassMap: Record<UserStatus, string> = {
  Active: "bg-green-50 text-green-700 ring-green-100",
  Banned: "bg-red-50 text-red-700 ring-red-100",
};

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const {
    accountStatusErrorMessage,
    currentPage,
    filteredUsers,
    handlePageChange,
    handleSearchQueryChange,
    handleSortChange,
    isLoadingUsers,
    listErrorMessage,
    pageSize,
    query,
    sort,
    totalUsers,
  } = useAdminUsersPage();

  return (
    <section className="rounded-xl border border-black bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-black p-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="font-title text-lg font-bold text-slate-950">
            User Account Management
          </h2>
          {accountStatusErrorMessage && (
            <p className="font-subtext mt-2 text-sm font-semibold text-red-600">
              {accountStatusErrorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">Search users</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="font-subtext h-11 w-full rounded-xl border border-black bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                handleSearchQueryChange(event.target.value)
              }
              placeholder="Search users by name or email..."
              type="search"
              value={query}
            />
          </label>

          <label className="block">
            <span className="sr-only">Sort users</span>
            <select
              className="font-subtext h-11 rounded-xl border border-black bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-black focus:ring-4 focus:ring-blue-50"
              onChange={(event) =>
                handleSortChange(event.target.value as AdminUsersSort)
              }
              value={sort}
            >
              {adminUsersSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-left">
          <thead>
            <tr className="font-subtext bg-slate-50 text-xs font-bold text-slate-500">
              <th className="px-5 py-4">STT</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Topics</th>
              <th className="px-5 py-4">Authors</th>
              <th className="px-5 py-4">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoadingUsers &&
              filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="font-subtext cursor-pointer text-sm font-medium text-slate-700 transition hover:bg-blue-50/60 focus-within:bg-blue-50/60"
                    onClick={() => navigate(routePaths.adminUserDetail(user.id))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(routePaths.adminUserDetail(user.id));
                      }
                    }}
                    tabIndex={0}
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                      <Link
                        className="transition hover:text-blue-600"
                        to={routePaths.adminUserDetail(user.id)}
                      >
                        {getAdminUserFullName(user)}
                      </Link>
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
                    <td className="whitespace-nowrap px-5 py-4">
                      {formatCount(user.topicCount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {formatCount(user.authorCount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDateTime(user.createdAt)}
                    </td>
                  </tr>
              ))}
          </tbody>
        </table>

        {isLoadingUsers && (
          <div className="font-subtext border-t border-black px-5 py-10 text-center text-sm font-medium text-slate-500">
            Loading users...
          </div>
        )}

        {!isLoadingUsers && listErrorMessage && (
          <div className="font-subtext border-t border-black px-5 py-10 text-center text-sm font-medium text-red-600">
            {listErrorMessage}
          </div>
        )}

        {!isLoadingUsers &&
          !listErrorMessage &&
          filteredUsers.length === 0 && (
            <div className="font-subtext border-t border-black px-5 py-10 text-center text-sm font-medium text-slate-500">
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

function formatCount(value: number | null | undefined) {
  return new Intl.NumberFormat("en").format(value ?? 0);
}
