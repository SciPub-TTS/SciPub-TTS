export type EntityType = "author" | "topic" | "institution" | "source";

export type OpenAlexEntityEntry = {
  id: string;
  type?: EntityType;
  label?: string;
};

export type OpenAlexEntity = Record<string, unknown>;

export type OpenAlexWorkListItem = Record<string, unknown>;
