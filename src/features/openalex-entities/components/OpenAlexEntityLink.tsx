import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  appendEntityTrailEntry,
  buildPaperEntityTrailUrl,
  parseEntityTrailFromSearch,
  replaceEntityTrail,
} from "../navigation";
import type { OpenAlexEntityEntry, EntityType } from "../types";

type OpenAlexEntityLinkProps = {
  entityId: string;
  entityType?: EntityType;
  children: ReactNode;
  className?: string;
  label?: string;
  replaceStack?: boolean;
};

export default function OpenAlexEntityLink({
  children,
  className,
  entityId,
  entityType,
  label,
  replaceStack = false,
}: OpenAlexEntityLinkProps) {
  const location = useLocation();
  const { paperId } = useParams();

  const entry: OpenAlexEntityEntry = {
    id: entityId,
    label,
    type: entityType,
  };

  const currentTrail = parseEntityTrailFromSearch(location.search);
  const nextTrail = replaceStack
    ? replaceEntityTrail(entry)
    : appendEntityTrailEntry(currentTrail, entry);
  const targetPath = paperId
    ? buildPaperEntityTrailUrl(paperId, nextTrail)
    : "";

  if (!targetPath) {
    return (
      <span
        className={[
          "inline-flex min-w-0 items-center text-left align-top",
          className || "",
        ].join(" ")}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={targetPath}
      className={[
        "inline-flex min-w-0 items-center text-left align-top",
        className || "",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
