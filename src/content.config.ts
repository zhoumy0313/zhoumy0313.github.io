import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const nonEmpty = z.string().trim().min(1);
const slug = nonEmpty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const localPath = nonEmpty.refine((value) => value.startsWith("/images/"), "Media paths must start with /images/");
const tagSchema = z.enum(["robotics", "autonomous-navigation", "manipulation", "agricultural-robotics", "computer-vision", "mechanical-design", "embedded-systems", "lesson", "notes", "inertial-navigation", "integrated-navigation"]);
export const localizedStringSchema = z.object({ zh: nonEmpty, en: nonEmpty }).strict();
export const localizedTextSchema = localizedStringSchema;
export const localizedMarkdownSchema = localizedStringSchema;

export const profileSchema = z.object({
  kind: z.literal("profile"), avatar: localPath, email: z.email(), name: localizedStringSchema,
  motto: localizedStringSchema, location: localizedStringSchema, organization: localizedStringSchema,
  position: localizedStringSchema, major: localizedStringSchema,
  research: z.array(z.object({ id: slug, label: localizedStringSchema }).strict()).min(1),
  about: localizedMarkdownSchema,
}).strict();
export const navigationSchema = z.object({ kind: z.literal("navigation"), items: z.array(z.object({ id: slug, href: nonEmpty, label: localizedStringSchema, external: z.boolean().optional() }).strict()).min(1) }).strict();
export const homepageSchema = z.object({ kind: z.literal("homepage"), sections: z.array(z.object({ source: z.enum(["profile", "education", "publications", "awards", "projects", "notes"]), featuredOnly: z.boolean().optional(), limit: z.number().int().positive().optional() }).strict()).min(1) }).strict();
export const educationSchema = z.object({ kind: z.literal("education"), title: localizedStringSchema, summary: localizedStringSchema, items: z.array(z.object({ id: slug, start: nonEmpty.regex(/^\d{4}-\d{2}$/), end: z.union([nonEmpty.regex(/^\d{4}-\d{2}$/), z.null()]), degree: localizedStringSchema, school: localizedStringSchema, description: localizedStringSchema, image: localPath }).strict()) }).strict();
export const projectLinkSchema = z.object({ type: z.enum(["code", "paper", "demo", "video", "external"]), label: localizedStringSchema.optional(), url: z.url() }).strict();
export const publicationSchema = z.object({ kind: z.literal("publications"), title: localizedStringSchema, summary: localizedStringSchema, items: z.array(z.object({ id: slug, title: nonEmpty, authors: z.array(nonEmpty).min(1), year: z.number().int().min(1900).max(2200), venue: nonEmpty, status: z.enum(["published", "preprint", "accepted", "in-press"]), image: localPath.optional(), links: z.array(projectLinkSchema).default([]) }).strict()) }).strict();
export const awardSchema = z.object({ kind: z.literal("awards"), title: localizedStringSchema, summary: localizedStringSchema, items: z.array(z.object({ id: slug, year: z.number().int().min(1900).max(2200), title: localizedStringSchema, issuer: localizedStringSchema, description: localizedStringSchema, image: localPath }).strict()) }).strict();
export const noteSchema = z.object({ kind: z.literal("notes"), title: localizedStringSchema, summary: localizedStringSchema, items: z.array(z.object({ id: slug, url: z.url(), image: localPath.optional(), title: localizedStringSchema, summary: localizedStringSchema, tags: z.array(tagSchema).default([]) }).strict()) }).strict();
export const socialSchema = z.object({ kind: z.literal("social"), items: z.array(z.object({ id: slug, label: nonEmpty, type: z.enum(["code", "orcid", "researchgate", "blog", "external"]), url: z.url() }).strict()) }).strict();
export const projectMediaSchema = z.object({ id: slug, src: localPath, caption: localizedStringSchema }).strict();
export const projectSchema = z.object({ id: slug, slug, date: z.coerce.date(), featured: z.boolean(), order: z.number().int(), title: localizedStringSchema, summary: localizedTextSchema, cover: localPath, tags: z.array(tagSchema), links: z.array(projectLinkSchema).default([]), video: z.object({ provider: z.enum(["youtube", "bilibili"]), id: nonEmpty }).strict().optional(), gallery: z.array(projectMediaSchema).default([]), body: localizedMarkdownSchema }).strict();

const siteSchema = z.discriminatedUnion("kind", [profileSchema, navigationSchema, homepageSchema, educationSchema, publicationSchema, awardSchema, noteSchema, socialSchema]);
const site = defineCollection({ loader: glob({ pattern: "*.yaml", base: "./data/site" }), schema: siteSchema });
const projects = defineCollection({ loader: glob({ pattern: "*.yaml", base: "./data/projects" }), schema: projectSchema });
export const collections = { site, projects };
