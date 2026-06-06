import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import EntityCanvas from "@/features/entity-canvas/components/EntityCanvas";
import { EntityCanvasContext } from "@/features/entity-canvas/store/entityCanvasContext";
import type {
  EntityCanvasEntry,
  EntityCanvasContextValue,
} from "@/features/entity-canvas/types";
import { normalizeEntityEntry } from "@/features/entity-canvas/utils";

type EntityCanvasProviderProps = {
  children: ReactNode;
};

export default function EntityCanvasProvider({
  children,
}: EntityCanvasProviderProps) {
  const [stack, setStack] = useState<EntityCanvasEntry[]>([]);
  const [followedEntries, setFollowedEntries] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    if (stack.length === 0) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stack.length]);

  const contextValue = useMemo<EntityCanvasContextValue>(() => {
    function openEntity(
      entry: EntityCanvasEntry,
      options?: { replace?: boolean },
    ) {
      const normalizedEntry = normalizeEntityEntry(entry);

      if (!normalizedEntry) {
        return;
      }

      setStack((currentStack) => {
        if (options?.replace) {
          return [normalizedEntry];
        }

        const activeEntry = currentStack[currentStack.length - 1];
        if (
          activeEntry &&
          activeEntry.id === normalizedEntry.id &&
          activeEntry.type === normalizedEntry.type
        ) {
          return currentStack;
        }

        return [...currentStack, normalizedEntry];
      });
    }

    function closeCanvas() {
      setStack([]);
    }

    function goBack() {
      setStack((currentStack) =>
        currentStack.length > 1 ? currentStack.slice(0, -1) : [],
      );
    }

    function goToIndex(index: number) {
      setStack((currentStack) => {
        if (index < 0 || index >= currentStack.length) {
          return currentStack;
        }

        return currentStack.slice(0, index + 1);
      });
    }

    function buildFollowKey(entry: EntityCanvasEntry) {
      const normalizedEntry = normalizeEntityEntry(entry);

      if (!normalizedEntry?.type) {
        return "";
      }

      return `${normalizedEntry.type}:${normalizedEntry.id}`;
    }

    function isFollowed(entry: EntityCanvasEntry) {
      const followKey = buildFollowKey(entry);
      return followKey ? followedEntries.has(followKey) : false;
    }

    function toggleFollow(entry: EntityCanvasEntry) {
      const followKey = buildFollowKey(entry);

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
      closeCanvas,
      goBack,
      goToIndex,
      isFollowed,
      openEntity,
      stack,
      toggleFollow,
    };
  }, [followedEntries, stack]);

  return (
    <EntityCanvasContext.Provider value={contextValue}>
      {children}
      <EntityCanvas
        stack={stack}
        onClose={contextValue.closeCanvas}
        onBack={contextValue.goBack}
        onJumpTo={contextValue.goToIndex}
        isFollowed={contextValue.isFollowed}
        onToggleFollow={contextValue.toggleFollow}
      />
    </EntityCanvasContext.Provider>
  );
}
