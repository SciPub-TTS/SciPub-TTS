import type { ReactNode } from "react";

import { useEntityCanvas } from "../store/entityCanvasContext";
import type { EntityCanvasEntry, EntityType } from "../types";

type EntityCanvasLinkProps = {
  entityId: string;
  entityType?: EntityType;
  children: ReactNode;
  className?: string;
  label?: string;
  replaceStack?: boolean;
};

export default function EntityCanvasLink({
  children,
  className,
  entityId,
  entityType,
  label,
  replaceStack = false,
}: EntityCanvasLinkProps) {
  const { openEntity } = useEntityCanvas();

  function handleClick() {
    const entry: EntityCanvasEntry = {
      id: entityId,
      label,
      type: entityType,
    };

    openEntity(entry, replaceStack ? { replace: true } : undefined);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "inline-flex min-w-0 items-center text-left align-top",
        className || "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
