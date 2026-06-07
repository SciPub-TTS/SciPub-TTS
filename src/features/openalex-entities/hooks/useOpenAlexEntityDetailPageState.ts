import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { getEntityLabel, parseEntityTrailFromSearch } from "../navigation";
import {
  getOpenAlexEntityDetail,
  getOpenAlexEntityTopWorks,
} from "../services";
import type { OpenAlexEntity } from "../types";
import { formatEntityTypeLabel } from "../utils";
import {
  buildOpenAlexEntityDetailState,
  mapWorks,
  type OpenAlexEntityDetailState,
  type WorkItem,
} from "../view-model";

export function useOpenAlexEntityDetailPageState() {
  const location = useLocation();
  const trail = useMemo(
    () => parseEntityTrailFromSearch(location.search),
    [location.search],
  );
  const activeEntry = trail[trail.length - 1];
  const [entity, setEntity] = useState<OpenAlexEntity | null>(null);
  const [topWorks, setTopWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [followedEntries, setFollowedEntries] = useState<Set<string>>(
    () => new Set(),
  );
  const activeEntityId = activeEntry?.id ?? "";
  const activeEntityType = activeEntry?.type;

  useEffect(() => {
    let isActive = true;

    async function loadEntityDetail() {
      if (!activeEntityId || !activeEntityType) {
        if (isActive) {
          setEntity(null);
          setErrorMessage("Entity trail is missing.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setEntity(null);

      try {
        const data = await getOpenAlexEntityDetail(
          activeEntityType,
          activeEntityId,
        );

        if (!isActive) {
          return;
        }

        setEntity(data);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setEntity(null);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Cannot load entity details right now.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadEntityDetail();

    return () => {
      isActive = false;
    };
  }, [activeEntityId, activeEntityType]);

  useEffect(() => {
    let isActive = true;

    async function loadTopWorks() {
      if (!activeEntityId || !activeEntityType) {
        setTopWorks([]);
        return;
      }

      try {
        const results = await getOpenAlexEntityTopWorks({
          entityId: activeEntityId,
          entityType: activeEntityType,
          perPage: 3,
          sort: "cited_by_count:desc",
        });

        if (!isActive) {
          return;
        }

        setTopWorks(mapWorks(results));
      } catch {
        if (!isActive) {
          return;
        }

        setTopWorks([]);
      }
    }

    void loadTopWorks();

    return () => {
      isActive = false;
    };
  }, [activeEntityId, activeEntityType]);

  const resolvedType = activeEntry?.type || "author";
  const typeLabel = formatEntityTypeLabel(resolvedType);
  const allowFollow = resolvedType === "author" || resolvedType === "topic";
  const followKey =
    activeEntry?.type && activeEntry.id
      ? `${activeEntry.type}:${activeEntry.id}`
      : "";
  const isFollowed = followKey ? followedEntries.has(followKey) : false;

  const entityDetailState = useMemo<OpenAlexEntityDetailState | null>(() => {
    if (!entity || !activeEntry) {
      return null;
    }

    return buildOpenAlexEntityDetailState(
      entity,
      resolvedType,
      topWorks,
      getEntityLabel(activeEntry),
    );
  }, [activeEntry, entity, resolvedType, topWorks]);

  function toggleFollow() {
    if (!followKey) {
      return;
    }

    setFollowedEntries((currentEntries) => {
      const nextEntries = new Set(currentEntries);

      if (nextEntries.has(followKey)) {
        nextEntries.delete(followKey);
      } else {
        nextEntries.add(followKey);
      }

      return nextEntries;
    });
  }

  return {
    allowFollow,
    entityDetailState,
    errorMessage,
    isFollowed,
    isLoading,
    toggleFollow,
    typeLabel,
  };
}
