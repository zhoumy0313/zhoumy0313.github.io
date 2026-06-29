import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  label: z.string(),
  url: z.url(),
  type: z.enum(["code", "paper", "demo", "video", "external"]).default("external"),
});

const site = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/site" }),
  schema: z.object({
    name: z.string().optional(),
    avatar: z.string().optional(),
    motto: z.string().optional(),
    location: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    title: z.string().optional(),
    research: z.array(z.string()).optional(),
    email: z.email().optional(),
    layout: z.enum(["profile-home"]).optional(),
    summary: z.string().optional(),
    sections: z
      .array(
        z.object({
          type: z.enum(["markdown", "collection-list", "timeline"]),
          title: z.string(),
          source: z.enum([
            "profile",
            "education",
            "publications",
            "awards",
            "projects",
            "notes",
          ]),
          limit: z.number().int().positive().optional(),
          filter: z
            .object({
              featured: z.boolean().optional(),
            })
            .optional(),
        }),
      )
      .optional(),
    items: z.array(z.looseObject({})).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().default("/images/project-default.svg"),
    video: z.url().optional(),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  }),
});

export const collections = { site, projects };
