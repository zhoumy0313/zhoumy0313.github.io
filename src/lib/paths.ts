export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";

  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(path)) {
    return path;
  }

  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!normalizedBase) {
    return normalizedPath;
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function projectHref(slug: string): string {
  return withBase(`/projects/${slug}/`);
}

export type Locale = "zh" | "en";

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return withBase(`/${locale}${normalized}`);
}

export function localizedProjectHref(locale: Locale, slug: string): string {
  return localizedPath(locale, `/projects/${slug}/`);
}

export function getLocaleRoute(locale: Locale, path: string): string {
  return localizedPath(locale, path);
}
