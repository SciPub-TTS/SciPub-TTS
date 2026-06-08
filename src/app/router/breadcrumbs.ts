import type { MouseEventHandler } from "react";
import type { Location, UIMatch } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type BreadcrumbResolverContext = {
  location: Location;
  match: UIMatch<unknown, AppRouteHandle>;
  matches: UIMatch<unknown, AppRouteHandle>[];
};

type BreadcrumbResolver =
  | BreadcrumbItem
  | BreadcrumbItem[]
  | string
  | null
  | undefined
  | ((context: BreadcrumbResolverContext) => BreadcrumbItem | BreadcrumbItem[] | string | null | undefined);

export type AppRouteHandle = {
  breadcrumb?: BreadcrumbResolver;
};

function normalizeBreadcrumbItem(
  item: BreadcrumbItem,
  fallbackTo: string,
): BreadcrumbItem | null {
  const label = item.label.trim();

  if (!label) {
    return null;
  }

  return {
    ...item,
    label,
    to: item.to ?? fallbackTo,
  };
}

function normalizeBreadcrumbs(
  breadcrumb: BreadcrumbItem | BreadcrumbItem[] | string,
  fallbackTo: string,
) {
  if (typeof breadcrumb === "string") {
    const label = breadcrumb.trim();

    return label ? [{ label, to: fallbackTo }] : [];
  }

  if (Array.isArray(breadcrumb)) {
    return breadcrumb
      .map((item) => normalizeBreadcrumbItem(item, fallbackTo))
      .filter((item): item is BreadcrumbItem => item !== null);
  }

  const normalizedItem = normalizeBreadcrumbItem(breadcrumb, fallbackTo);

  return normalizedItem ? [normalizedItem] : [];
}

export function resolveBreadcrumbItems(
  matches: UIMatch<unknown, AppRouteHandle>[],
  location: Location,
) {
  return matches.flatMap((match) => {
    const breadcrumb = match.handle?.breadcrumb;

    if (!breadcrumb) {
      return [];
    }

    const resolvedBreadcrumb =
      typeof breadcrumb === "function"
        ? breadcrumb({ location, match, matches })
        : breadcrumb;

    if (!resolvedBreadcrumb) {
      return [];
    }

    return normalizeBreadcrumbs(resolvedBreadcrumb, match.pathname);
  });
}
