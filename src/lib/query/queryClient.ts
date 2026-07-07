import { QueryClient } from "@tanstack/react-query";

const DEFAULT_QUERY_GC_TIME = 5 * 60 * 1000;
const DEFAULT_QUERY_STALE_TIME = 30 * 1000;

const OPEN_ALEX_QUERY_DEFAULTS = {
  gcTime: 45 * 60 * 1000,
  staleTime: 10 * 60 * 1000,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DEFAULT_QUERY_GC_TIME,
      refetchOnWindowFocus: false,
      retry: 5,
      staleTime: DEFAULT_QUERY_STALE_TIME,
    },
  },
});

queryClient.setQueryDefaults(["searchSummary"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["searchResults"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["searchFilterOptions"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["searchTrendingTopics"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["searchTrendingKeywords"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["paperDetail"], OPEN_ALEX_QUERY_DEFAULTS);
queryClient.setQueryDefaults(["entityDetail"], OPEN_ALEX_QUERY_DEFAULTS);
