import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { setPaperTitle } from "../paperTitleStore";
import { getPaperDetail } from "../services";
import type { PaperDetailData } from "../types";

export function usePaperDetailPageState() {
  const { paperId = "" } = useParams();
  const normalizedPaperId = paperId.trim();
  const [paperDetail, setPaperDetail] = useState<PaperDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadPageState() {
      if (!normalizedPaperId) {
        if (isActive) {
          setErrorMessage("Paper ID is missing.");
          setPaperDetail(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setPaperDetail(null);

      try {
        const detail = await getPaperDetail(normalizedPaperId);

        if (!isActive) {
          return;
        }

        setPaperDetail(detail);
        setPaperTitle(normalizedPaperId, detail.title);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setPaperDetail(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Cannot load paper detail right now.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPageState();

    return () => {
      isActive = false;
    };
  }, [normalizedPaperId]);

  return {
    errorMessage,
    isLoading,
    paperDetail,
  };
}
