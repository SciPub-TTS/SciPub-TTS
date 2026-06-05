export type EntityType = "author" | "topic" | "institution" | "source";

export type EntityCanvasEntry = {
  id: string;
  type?: EntityType;
  label?: string;
};

export type EntityCanvasContextValue = {
  stack: EntityCanvasEntry[];
  openEntity: (entry: EntityCanvasEntry, options?: { replace?: boolean }) => void;
  closeCanvas: () => void;
  goBack: () => void;
  goToIndex: (index: number) => void;
  isFollowed: (entry: EntityCanvasEntry) => boolean;
  toggleFollow: (entry: EntityCanvasEntry) => void;
};

export type OpenAlexEntity = Record<string, unknown>;

export type OpenAlexWorkListItem = Record<string, unknown>;
