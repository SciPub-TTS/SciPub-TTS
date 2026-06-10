import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { setPaperTitle } from "../paperTitleStore";
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
    if (!normalizedPaperId) {
      return;
    }

    if (!paperDetailQuery.data) {
      return;
    }

    setPaperTitle(normalizedPaperId, paperDetailQuery.data.title);
  }, [normalizedPaperId, paperDetailQuery.data]);

  let errorMessage = "";
  if (!normalizedPaperId) {
    errorMessage = "Paper ID is missing.";
  } else if (paperDetailQuery.error instanceof Error) {
    errorMessage = paperDetailQuery.error.message;
  } else if (paperDetailQuery.error) {
    errorMessage = "Cannot load paper detail right now.";
  }

  return {
    errorMessage,
    isLoading: Boolean(normalizedPaperId) && paperDetailQuery.isPending,
    paperDetail: paperDetailQuery.data || null,
  };
}
