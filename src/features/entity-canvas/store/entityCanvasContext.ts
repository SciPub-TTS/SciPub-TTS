import { createContext, useContext } from "react";

import type { EntityCanvasContextValue } from "../types";

export const EntityCanvasContext = createContext<EntityCanvasContextValue | null>(
  null,
);

export function useEntityCanvas() {
  const context = useContext(EntityCanvasContext);

  if (!context) {
    throw new Error("EntityCanvasProvider is missing.");
  }

  return context;
}
