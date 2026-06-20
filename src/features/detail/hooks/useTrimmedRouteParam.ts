import { useParams } from "react-router-dom";

// Route params arrive as optional strings. Most detail pages only need the
// trimmed version, so this helper removes repeated null/trim boilerplate.
export function useTrimmedRouteParam(paramName: string) {
  const params = useParams();
  const rawValue = params[paramName];

  return typeof rawValue === "string" ? rawValue.trim() : "";
}

