import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export const siteEntryIds = ["profile", "navigation", "homepage", "education", "publications", "awards", "notes", "social"] as const;
export type SiteEntryId = (typeof siteEntryIds)[number];
export type Localized<T = string> = { zh: T; en: T };
export type SiteData = CollectionEntry<"site">["data"];

export function localize<T>(value: Localized<T>, locale: "zh" | "en"): T { return value[locale]; }
export async function getSiteEntry(id: SiteEntryId): Promise<CollectionEntry<"site">> {
  const entry = await getEntry("site", id);
  if (!entry) throw new Error(`Missing required site data: data/site/${id}.yaml`);
  return entry;
}
export async function getSiteData<K extends SiteData["kind"]>(id: K): Promise<Extract<SiteData, { kind: K }>> {
  const entry = await getSiteEntry(id);
  if (entry.data.kind !== id) throw new Error(`Site entry ${id} declares kind ${entry.data.kind}`);
  return entry.data as Extract<SiteData, { kind: K }>;
}
export async function getProjects(options: { featured?: boolean; limit?: number } = {}) {
  const projects = await getCollection("projects");
  const filtered = options.featured === undefined ? projects : projects.filter((project) => project.data.featured === options.featured);
  const sorted = [...filtered].sort((a, b) => b.data.order - a.data.order || b.data.date.getTime() - a.data.date.getTime());
  return typeof options.limit === "number" ? sorted.slice(0, options.limit) : sorted;
}
