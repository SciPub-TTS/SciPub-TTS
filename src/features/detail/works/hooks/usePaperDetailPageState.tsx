import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { setDetailTitle } from "@/features/detail/store/detailTitleStore";

import { getPaperDetail } from "../services";

export function usePaperDetailPageState() {
  const { paperId = "" } = useParams();
  const normalizedPaperId = paperId.trim();
  const paperDetailQuery = useQuery({
    enabled: Boolean(normalizedPaperId),
    queryFn: () => getPaperDetail(normalizedPaperId),
    queryKey: ["paperDetail", normalizedPaperId],
  });

  useEffect(() => {
    if (!normalizedPaperId || !paperDetailQuery.data?.title) {
      return;
    }

    setDetailTitle("works", normalizedPaperId, paperDetailQuery.data.title);
  }, [normalizedPaperId, paperDetailQuery.data]);

  let errorMessage = "";

  if (paperDetailQuery.error instanceof Error) {
    errorMessage = paperDetailQuery.error.message;
  } else if (paperDetailQuery.error) {
    errorMessage = "Cannot load paper detail right now.";
  }

  return {
    errorMessage: normalizedPaperId ? errorMessage : "Paper ID is missing.",
    isLoading: Boolean(normalizedPaperId) && paperDetailQuery.isPending,
    paperDetail: paperDetailQuery.data || null,
  };
}
