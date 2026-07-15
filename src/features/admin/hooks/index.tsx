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
  getAdminDashboardStatistics,
  getAdminSyncCronConfigs,
  getAdminTopApiConsumers,
  getAdminUserDetail,
  getAdminUsers,
  getAdminUserSearchHistory,
  unbanAdminUser,
  updateAdminSyncCronConfig,
} from "../services";
import type {
  AdminCronConfigUpdateInput,
  AdminUserApi,
  AdminUserDetail,
  AdminUsersPageData,
  AdminUsersSort,
} from "../types";

const ADMIN_USERS_PAGE_SIZE = 10;
const ADMIN_USER_SEARCH_HISTORY_PAGE_SIZE = 10;
const DEFAULT_ADMIN_USERS_SORT: AdminUsersSort = "RECENT";

type AccountStatusAction = "ban" | "unban";
type AccountStatusMutationPayload = {
  action: AccountStatusAction;
  userId: string;
};

export const adminUsersSortOptions: Array<{
  label: string;
  value: AdminUsersSort;
}> = [
  { label: "Newest first", value: "RECENT" },
  { label: "Oldest first", value: "OLDEST" },
  { label: "Email A-Z", value: "EMAIL_ASC" },
  { label: "Email Z-A", value: "EMAIL_DESC" },
];

export function useAdminDashboardData() {
  const dashboardStatisticsQuery = useQuery({
    queryKey: ["admin-dashboard-statistics"],
    queryFn: getAdminDashboardStatistics,
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
    dashboardStatistics: dashboardStatisticsQuery.data,
    isApiUsageOverTimeError: apiUsageOverTimeQuery.isError,
    isApiUsageOverTimeLoading: apiUsageOverTimeQuery.isLoading,
    isDashboardStatisticsError: dashboardStatisticsQuery.isError,
    isDashboardStatisticsLoading: dashboardStatisticsQuery.isLoading,
    isTopApiConsumersError: topApiConsumersQuery.isError,
    isTopApiConsumersLoading: topApiConsumersQuery.isLoading,
    topApiConsumers: topApiConsumersQuery.data ?? [],
  };
}

export function useAdminUsersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<AdminUsersSort>(DEFAULT_ADMIN_USERS_SORT);
  const adminUsersQueryKey = [
    "admin-users",
    currentPage,
    ADMIN_USERS_PAGE_SIZE,
    sort,
  ] as const;
  const adminUsersQuery = useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: () =>
      getAdminUsers({
        page: currentPage - 1,
        size: ADMIN_USERS_PAGE_SIZE,
        sort,
      }),
    placeholderData: keepPreviousData,
  });
  const accountStatusMutation = useAccountStatusMutation();
  const users = useMemo(
    () => adminUsersQuery.data?.items ?? [],
    [adminUsersQuery.data?.items],
  );
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

  function handleSearchQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setCurrentPage(1);
  }

  function handleSortChange(nextSort: AdminUsersSort) {
    setSort(nextSort);
    setCurrentPage(1);
  }

  function handleChangeAccountStatus(user: AdminUserApi) {
    if (user.role === "ADMIN" || accountStatusMutation.isPending) {
      return;
    }

    if (!window.confirm(getAccountStatusConfirmationMessage(user))) {
      return;
    }

    accountStatusMutation.mutate(
      {
        action: user.banned ? "unban" : "ban",
        userId: user.id,
      },
      {
        onSuccess: (updatedUser) => {
          queryClient.setQueryData<AdminUsersPageData>(
            adminUsersQueryKey,
            (currentData) => {
              if (!currentData) {
                return currentData;
              }

              return {
                ...currentData,
                items: currentData.items.map((item) =>
                  item.id === updatedUser.id ? updatedUser : item,
                ),
              };
            },
          );
        },
      },
    );
  }

  return {
    accountStatusErrorMessage,
    changingUserId: accountStatusMutation.variables?.userId ?? null,
    currentPage,
    filteredUsers,
    handleChangeAccountStatus,
    handlePageChange: setCurrentPage,
    handleSearchQueryChange,
    handleSortChange,
    isChangingAccountStatus: accountStatusMutation.isPending,
    isLoadingUsers,
    listErrorMessage,
    pageSize: ADMIN_USERS_PAGE_SIZE,
    query,
    sort,
    totalUsers,
  };
}

export function useAdminUserDetailPage(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [searchHistoryPage, setSearchHistoryPage] = useState(1);
  const userDetailQuery = useQuery({
    enabled: Boolean(userId),
    queryKey: ["admin-user-detail", userId],
    queryFn: () => getAdminUserDetail(userId ?? ""),
  });
  const searchHistoryQuery = useQuery({
    enabled: Boolean(userId),
    queryKey: [
      "admin-user-search-history",
      userId,
      searchHistoryPage,
      ADMIN_USER_SEARCH_HISTORY_PAGE_SIZE,
    ],
    queryFn: () =>
      getAdminUserSearchHistory({
        page: searchHistoryPage - 1,
        size: ADMIN_USER_SEARCH_HISTORY_PAGE_SIZE,
        userId: userId ?? "",
      }),
    placeholderData: keepPreviousData,
  });
  const accountStatusMutation = useAccountStatusMutation();
  const detail = userDetailQuery.data;
  const detailUser = detail?.user ?? null;
  const detailErrorMessage = userDetailQuery.isError
    ? getErrorMessage(userDetailQuery.error, "Cannot load this user right now.")
    : "";
  const searchHistoryErrorMessage = searchHistoryQuery.isError
    ? getErrorMessage(
        searchHistoryQuery.error,
        "Cannot load search history right now.",
      )
    : "";
  const isUserNotFound =
    userDetailQuery.isError && isNotFoundError(userDetailQuery.error);

  function handleChangeAccountStatus() {
    if (!detailUser || detailUser.role === "ADMIN" || accountStatusMutation.isPending) {
      return;
    }

    accountStatusMutation.mutate(
      {
        action: detailUser.banned ? "unban" : "ban",
        userId: detailUser.id,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: ["admin-user-detail", userId],
          });
          void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
      },
    );
  }

  return {
    accountStatusErrorMessage: accountStatusMutation.isError
      ? getErrorMessage(
          accountStatusMutation.error,
          getAccountStatusErrorFallback(accountStatusMutation.variables?.action),
        )
      : "",
    detail,
    detailErrorMessage,
    handleChangeAccountStatus,
    handleSearchHistoryPageChange: setSearchHistoryPage,
    isChangingAccountStatus: accountStatusMutation.isPending,
    isLoadingDetail: userDetailQuery.isLoading,
    isLoadingSearchHistory:
      searchHistoryQuery.isLoading ||
      (searchHistoryQuery.isFetching && !searchHistoryQuery.data),
    isUserNotFound,
    searchHistory: searchHistoryQuery.data,
    searchHistoryErrorMessage,
    searchHistoryPage,
    searchHistoryPageSize: ADMIN_USER_SEARCH_HISTORY_PAGE_SIZE,
  };
}

export function useAdminSystemSettingsPage() {
  const queryClient = useQueryClient();
  const syncCronConfigsQuery = useQuery({
    queryKey: ["admin-sync-cron-configs"],
    queryFn: getAdminSyncCronConfigs,
  });
  const updateCronConfigMutation = useMutation({
    mutationFn: updateAdminSyncCronConfig,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin-sync-cron-configs"],
      });
    },
  });

  async function handleUpdateCronConfig(
    configKey: string,
    payload: AdminCronConfigUpdateInput,
  ) {
    await updateCronConfigMutation.mutateAsync({ configKey, payload });
  }

  return {
    cronConfigErrorMessage: syncCronConfigsQuery.isError
      ? getErrorMessage(
          syncCronConfigsQuery.error,
          "Cannot load sync schedules right now.",
        )
      : "",
    cronConfigs: syncCronConfigsQuery.data ?? [],
    handleUpdateCronConfig,
    isLoadingCronConfigs: syncCronConfigsQuery.isLoading,
    isUpdatingCronConfig: updateCronConfigMutation.isPending,
    updateCronConfigErrorMessage: updateCronConfigMutation.isError
      ? getErrorMessage(
          updateCronConfigMutation.error,
          "Cannot update sync schedule right now.",
        )
      : "",
    updatingCronConfigKey: updateCronConfigMutation.variables?.configKey ?? null,
  };
}

export function getAdminUserFullName(user: AdminUserApi | AdminUserDetail["user"]) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const username = "username" in user ? user.username : null;

  return fullName || username || user.email;
}

function useAccountStatusMutation() {
  return useMutation({
    mutationFn: ({ action, userId }: AccountStatusMutationPayload) =>
      action === "ban" ? banAdminUser(userId) : unbanAdminUser(userId),
  });
}

type ApiErrorLike = {
  message?: unknown;
  response?: {
    data?: {
      code?: unknown;
      message?: unknown;
    };
    status?: number;
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

function isNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const apiError = error as ApiErrorLike;
  const code = apiError.response?.data?.code;

  return apiError.response?.status === 404 || code === "USER_NOT_FOUND";
}

function getAccountStatusErrorFallback(action?: AccountStatusAction) {
  return action === "unban"
    ? "Cannot unban this account right now."
    : "Cannot ban this account right now.";
}

function getAccountStatusConfirmationMessage(
  user: AdminUserApi | AdminUserDetail["user"],
) {
  const fullName = getAdminUserFullName(user);

  return user.banned
    ? `Are you sure you want to unban ${fullName}?`
    : `Are you sure you want to ban ${fullName}?`;
}


