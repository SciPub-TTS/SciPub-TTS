import { Ban, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Pagination from "@/layout/components/Pagination";

type AdminUser = {
  authors: number;
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  role: "Admin" | "Lecturer" | "Researcher" | "Student";
  status: "Active" | "Banned";
  topics: number;
};

const adminUsers: AdminUser[] = [
  {
    id: "U-001",
    fullName: "Nguyen An Khang",
    email: "student01@email.com",
    role: "Student",
    status: "Active",
    topics: 6,
    authors: 3,
    createdAt: "Today, 10:12 AM",
  },
  {
    id: "U-002",
    fullName: "Tran Thi Minh",
    email: "researcher02@email.com",
    role: "Researcher",
    status: "Active",
    topics: 12,
    authors: 9,
    createdAt: "Today, 08:45 AM",
  },
  {
    id: "U-003",
    fullName: "Le Van Phong",
    email: "lecturer03@email.com",
    role: "Lecturer",
    status: "Active",
    topics: 8,
    authors: 5,
    createdAt: "Yesterday, 06:20 PM",
  },
  {
    id: "U-004",
    fullName: "Pham Hoang Vy",
    email: "student04@email.com",
    role: "Student",
    status: "Banned",
    topics: 2,
    authors: 1,
    createdAt: "Apr 14, 2026",
  },
  {
    id: "U-005",
    fullName: "Heather Piwowar",
    email: "researcher05@email.com",
    role: "Researcher",
    status: "Active",
    topics: 5,
    authors: 3,
    createdAt: "May 22, 2026",
  },
  {
    id: "U-006",
    fullName: "Do Quang Huy",
    email: "admin@scholartrack.io",
    role: "Admin",
    status: "Active",
    topics: 0,
    authors: 0,
    createdAt: "Today, 11:00 AM",
  },
];

const USERS_PAGE_SIZE = 4;

const roleClassMap: Record<AdminUser["role"], string> = {
  Admin: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Lecturer: "bg-amber-50 text-amber-700 ring-amber-100",
  Researcher: "bg-slate-100 text-slate-600 ring-slate-200",
  Student: "bg-blue-50 text-blue-700 ring-blue-100",
};

const statusClassMap: Record<AdminUser["status"], string> = {
  Active: "bg-green-50 text-green-700 ring-green-100",
  Banned: "bg-red-50 text-red-700 ring-red-100",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [user.id, user.fullName, user.email, user.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? null;
  const totalFilteredUsers = filteredUsers.length;
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PAGE_SIZE;

    return filteredUsers.slice(startIndex, startIndex + USERS_PAGE_SIZE);
  }, [currentPage, filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  function toggleUserBan(userId: string) {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== userId || user.role === "Admin") return user;

        return {
          ...user,
          status: user.status === "Banned" ? "Active" : "Banned",
        };
      }),
    );
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users by name, email, or status..."
              type="search"
              value={query}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500">
                <th className="px-5 py-4">STT</th>
                <th className="px-5 py-4">Full Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Topics</th>
                <th className="px-5 py-4">Authors</th>
                <th className="px-5 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user, index) => (
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
                    {(currentPage - 1) * USERS_PAGE_SIZE + index + 1}
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
                  <td className="whitespace-nowrap px-5 py-4">{user.topics}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {user.authors}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {user.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="border-t border-slate-100 px-5 py-10 text-center text-sm font-medium text-slate-500">
              No users found.
            </div>
          )}
        </div>

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={USERS_PAGE_SIZE}
            totalItems={totalFilteredUsers}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {selectedUser && (
        <UserDetailDialog
          onClose={() => setSelectedUserId(null)}
          onToggleBan={() => toggleUserBan(selectedUser.id)}
          user={selectedUser}
        />
      )}
    </>
  );
}

function UserDetailDialog({
  onClose,
  onToggleBan,
  user,
}: {
  onClose: () => void;
  onToggleBan: () => void;
  user: AdminUser;
}) {
  const canBan = user.role !== "Admin";
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
          <DetailItem label="User ID" value={user.id} />
          <DetailItem
            label="Role"
            value={
              <Badge className={roleClassMap[user.role]}>{user.role}</Badge>
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
          <DetailItem label="Followed Topics" value={user.topics.toString()} />
          <DetailItem label="Followed Authors" value={user.authors.toString()} />
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
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition",
                  user.status === "Banned"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                ].join(" ")}
                onClick={onToggleBan}
                type="button"
              >
                <Ban className="h-4 w-4" />
                {actionLabel}
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
