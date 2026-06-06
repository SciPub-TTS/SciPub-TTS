import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPaperDetail } from "../services";
import type { PaperDetailData } from "../types";

export function usePaperDetailPageState() {
  const { paperId = "" } = useParams();
  const [paperDetail, setPaperDetail] = useState<PaperDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPaperDetail() {
      if (!paperId.trim()) {
        if (mounted) {
          setErrorMessage("Paper ID is missing.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const detail = await getPaperDetail(paperId);

        if (!mounted) {
          return;
        }

        setPaperDetail(detail);
      } catch (error) {
        if (!mounted) {
          return;
        }

        setPaperDetail(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Cannot load paper detail right now.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPaperDetail();

    return () => {
      mounted = false;
    };
  }, [paperId]);

  return {
    errorMessage,
    isLoading,
    paperDetail,
  };
}
