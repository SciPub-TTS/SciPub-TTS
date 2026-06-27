import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  fetchLandingSummary,
  LANDING_DEFAULT_FIELD_ID,
  LANDING_DEFAULT_FORMULA,
} from "@/features/landing/services/landing.api";
import { getLandingDateRange } from "@/features/landing/services/landingDates";

export function useLandingSummary() {
  const dateRange = useMemo(() => getLandingDateRange(), []);
  const params = useMemo(
    () => ({
      ...dateRange,
      fieldId: LANDING_DEFAULT_FIELD_ID,
      formula: LANDING_DEFAULT_FORMULA,
    }),
    [dateRange],
  );

  const query = useQuery({
    queryKey: ["landingSummary", params],
    queryFn: () => fetchLandingSummary(params),
  });

  return { ...query, dateRange };
}
