import { getAuthorDetail, getTopicDetail } from "../services/api";
import type { EntityDetailData, EntityDetailType } from "../types";

type EntityDetailConfig = {
  label: "author" | "topic";
  queryFn: (entityId: string) => Promise<EntityDetailData>;
  routeParam: "authorId" | "topicId";
};

const entityDetailConfigMap: Record<EntityDetailType, EntityDetailConfig> = {
  authors: {
    label: "author",
    queryFn: getAuthorDetail,
    routeParam: "authorId",
  },
  topics: {
    label: "topic",
    queryFn: getTopicDetail,
    routeParam: "topicId",
  },
};

export function getEntityDetailConfig(entityType: EntityDetailType) {
  return entityDetailConfigMap[entityType];
}

