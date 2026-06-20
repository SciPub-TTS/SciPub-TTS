import { useMemo, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  banAdminUser,
  getAdminApiUsageOverTime,
  getAdminTopApiConsumers,
  getAdminUserBanSummary,
  getAdminUsers,
  unbanAdminUser,
} from "../services";
import type {
  AdminUserApi,
  AdminUsersPageData,
} from "../types";

const ADMIN_USERS_PAGE_SIZE = 10;
const ADMIN_USERS_SORT = "RECENT";

type AccountStatusAction = "ban" | "unban";
type AccountStatusMutationPayload = {
  action: AccountStatusAction;
  userId: string;
};

export function useAdminDashboardData() {
  const banSummaryQuery = useQuery({
    queryKey: ["admin-user-ban-summary"],
    queryFn: getAdminUserBanSummary,
  });
  const topApiConsumersQuery = useQuery({
    queryKey: ["admin-top-api-consumers"],
    queryFn: getAdminTopApiConsumers,
  });
  const apiUsageOverTimeQuery = useQuery({
    queryKey: ["admin-api-usage-over-time"],
    queryFn: getAdminApiUsageOverTime,
  });

  return {
    apiUsageOverTime: apiUsageOverTimeQuery.data ?? [],
    banSummary: banSummaryQuery.data,
    isApiUsageOverTimeError: apiUsageOverTimeQuery.isError,
    isApiUsageOverTimeLoading: apiUsageOverTimeQuery.isLoading,
    isBanSummaryError: banSummaryQuery.isError,
    isBanSummaryLoading: banSummaryQuery.isLoading,
    isTopApiConsumersError: topApiConsumersQuery.isError,
    isTopApiConsumersLoading: topApiConsumersQuery.isLoading,
    topApiConsumers: topApiConsumersQuery.data ?? [],
  };
}

export function useAdminUsersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const adminUsersQueryKey = [
    "admin-users",
    currentPage,
    ADMIN_USERS_PAGE_SIZE,
    ADMIN_USERS_SORT,
  ] as const;
  const adminUsersQuery = useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: () =>
      getAdminUsers({
        page: currentPage - 1,
        size: ADMIN_USERS_PAGE_SIZE,
        sort: ADMIN_USERS_SORT,
      }),
    placeholderData: keepPreviousData,
  });
  const accountStatusMutation = useMutation({
    mutationFn: ({ action, userId }: AccountStatusMutationPayload) =>
      action === "ban" ? banAdminUser(userId) : unbanAdminUser(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AdminUsersPageData>(
        adminUsersQueryKey,
        (currentData) => {
          if (!currentData) {
            return currentData;
          }

          return {
            ...currentData,
            items: currentData.items.map((user) =>
              user.id === updatedUser.id ? updatedUser : user,
            ),
          };
        },
      );
    },
  });
  const users = adminUsersQuery.data?.items ?? [];
  const totalUsers = adminUsersQuery.data?.totalElements ?? 0;
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return users;

    return users.filter((user) =>
      [getAdminUserFullName(user), user.email]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);
  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? null;
  const isLoadingUsers =
    adminUsersQuery.isLoading ||
    (adminUsersQuery.isFetching && !adminUsersQuery.data);
  const listErrorMessage = adminUsersQuery.isError
    ? getErrorMessage(
        adminUsersQuery.error,
        "Cannot load admin users right now.",
      )
    : "";
  const accountStatusErrorMessage = accountStatusMutation.isError
    ? getErrorMessage(
        accountStatusMutation.error,
        getAccountStatusErrorFallback(accountStatusMutation.variables?.action),
      )
    : "";
  const isSelectedUserChangingStatus = Boolean(
    selectedUser &&
      accountStatusMutation.isPending &&
      accountStatusMutation.variables?.userId === selectedUser.id,
  );

  function handleSearchQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setCurrentPage(1);
  }

  function handleSelectUser(userId: string) {
    accountStatusMutation.reset();
    setSelectedUserId(userId);
  }

  function handleCloseUserDialog() {
    accountStatusMutation.reset();
    setSelectedUserId(null);
  }

  function handleChangeSelectedAccountStatus() {
    if (
      !selectedUser ||
      selectedUser.role === "ADMIN" ||
      accountStatusMutation.isPending
    ) {
      return;
    }

    accountStatusMutation.mutate({
      action: selectedUser.banned ? "unban" : "ban",
      userId: selectedUser.id,
    });
  }

  return {
    accountStatusErrorMessage,
    currentPage,
    filteredUsers,
    handleChangeSelectedAccountStatus,
    handleCloseUserDialog,
    handlePageChange: setCurrentPage,
    handleSearchQueryChange,
    handleSelectUser,
    isLoadingUsers,
    isSelectedUserChangingStatus,
    listErrorMessage,
    pageSize: ADMIN_USERS_PAGE_SIZE,
    query,
    selectedUser,
    totalUsers,
  };
}

export function getAdminUserFullName(user: AdminUserApi) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return fullName || user.email;
}

type ApiErrorLike = {
  message?: unknown;
  response?: {
    data?: {
      message?: unknown;
    };
  };
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const apiError = error as ApiErrorLike;
    const responseMessage = apiError.response?.data?.message;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof apiError.message === "string" && apiError.message.trim()) {
      return apiError.message;
    }
  }

  return fallback;
}

function getAccountStatusErrorFallback(action?: AccountStatusAction) {
  return action === "unban"
    ? "Cannot unban this account right now."
    : "Cannot ban this account right now.";
}
