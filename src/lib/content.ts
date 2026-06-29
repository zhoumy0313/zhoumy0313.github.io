import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { rejectMdxModuleSyntax } from "@lib/validators";
import type { Locale } from "@lib/paths";

export type SiteEntryId =
  | "profile"
  | "navigation"
  | "homepage"
  | "social"
  | "publications"
  | "awards"
  | "education"
  | "notes";

export async function getSiteEntry(id: SiteEntryId, locale: Locale = "zh"): Promise<CollectionEntry<"site">> {
  const entry = await getEntry("site", `${locale}/${id}`);

  if (!entry) {
    throw new Error(`Missing required site content: content/site/${locale}/${id}.md`);
  }

  return entry;
}

export async function getProjects(locale: Locale = "zh", options: { featured?: boolean; limit?: number } = {}) {
  const projects = await getCollection("projects");
  const scoped = projects.filter((project) => project.id.startsWith(`${locale}/`));

  scoped.forEach((project) => rejectMdxModuleSyntax(project.body, project.filePath));

  const filtered =
    options.featured === undefined
      ? scoped
      : scoped.filter((project) => project.data.featured === options.featured);

  const sorted = [...filtered].sort((a, b) => {
    if (b.data.order !== a.data.order) {
      return b.data.order - a.data.order;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });

  return typeof options.limit === "number" ? sorted.slice(0, options.limit) : sorted;
}
