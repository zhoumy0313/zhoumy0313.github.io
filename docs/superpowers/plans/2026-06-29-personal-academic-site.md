# Personal Academic Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Astro personal academic website whose pages are generated from GitBook-editable Markdown/MDX content.

**Architecture:** Astro builds static pages from content collections under `content/site/` and `content/projects/`. A small whitelist renderer maps homepage section config to built-in components, while MDX project pages may use a limited set of exported components. GitHub Actions validates and deploys the static `dist/` output to GitHub Pages.

**Tech Stack:** Astro, TypeScript, Markdown, MDX, Zod via Astro Content Collections, GitHub Actions, GitHub Pages.

---

## File Structure

Create this structure:

```text
.github/
  workflows/
    deploy.yml
content/
  notes.md
  projects/
    robot-navigation.mdx
    vision-system.mdx
  site/
    awards.md
    education.md
    homepage.md
    navigation.md
    profile.md
    publications.md
    social.md
public/
  images/
    avatar.svg
    project-default.svg
src/
  components/
    AwardList.astro
    CollectionList.astro
    EducationTimeline.astro
    LinkButton.astro
    Navigation.astro
    ProfileSidebar.astro
    ProjectGallery.astro
    ProjectVideo.astro
    PublicationList.astro
    ResearchFigure.astro
    SectionRenderer.astro
    SocialLinks.astro
  layouts/
    BaseLayout.astro
    ProjectLayout.astro
  lib/
    content.ts
    paths.ts
    sections.ts
  pages/
    awards.astro
    index.astro
    notes.astro
    projects/
      [slug].astro
      index.astro
    publications.astro
  styles/
    global.css
src/content.config.ts
astro.config.mjs
package.json
tsconfig.json
```

Responsibilities:

- `src/content.config.ts`: all Markdown/MDX schemas and collection loaders.
- `src/lib/content.ts`: typed helper functions for reading singleton site documents and sorted project entries.
- `src/lib/sections.ts`: homepage section whitelist validation and renderer type helpers.
- `src/lib/paths.ts`: URL helpers that respect Astro `base` paths.
- `src/components/*`: focused presentational components.
- `src/layouts/*`: shared page chrome and project detail wrapper.
- `src/pages/*`: route entry points only; minimal logic.
- `content/*`: editable content that GitBook can sync.
- `.github/workflows/deploy.yml`: GitHub Pages deployment.

## Task 1: Scaffold Astro Project

**Files:**

- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Modify: `.gitignore`

- [ ] **Step 1: Create package manifest**

Create `package.json`:

```json
{
  "name": "personal-academic-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "@astrojs/mdx": "latest",
    "astro": "latest",
    "typescript": "latest"
  },
  "devDependencies": {}
}
```

- [ ] **Step 2: Create Astro config**

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

const site = process.env.SITE_URL || "https://example.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  integrations: [mdx()],
});
```

- [ ] **Step 3: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

- [ ] **Step 4: Create global stylesheet**

Create `src/styles/global.css`:

```css
:root {
  color-scheme: light;
  --surface: oklch(97% 0.006 92);
  --surface-strong: oklch(93% 0.01 92);
  --panel: oklch(99% 0.006 92);
  --ink: oklch(23% 0.018 248);
  --muted: oklch(48% 0.02 248);
  --line: oklch(86% 0.012 92);
  --accent: oklch(45% 0.095 205);
  --accent-soft: oklch(90% 0.04 205);
  --warm: oklch(78% 0.065 72);
  --shadow: 0 24px 80px oklch(25% 0.03 248 / 0.11);
  --font-serif: "Source Serif 4", "Noto Serif SC", Georgia, serif;
  --font-sans: "Aptos", "Noto Sans SC", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  background:
    radial-gradient(circle at top left, oklch(90% 0.05 205 / 0.38), transparent 34rem),
    linear-gradient(135deg, var(--surface), oklch(95% 0.01 70));
  color: var(--ink);
  font-family: var(--font-sans);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

img,
video {
  display: block;
  max-width: 100%;
}

.site-shell {
  display: grid;
  grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
  margin: 0 auto;
  max-width: 1240px;
  min-height: 100vh;
  padding: clamp(1.25rem, 3vw, 3rem);
}

.main-column {
  min-width: 0;
  padding-block: clamp(0.5rem, 2vw, 2rem);
}

.content-section {
  margin-block: clamp(2.25rem, 5vw, 4.5rem);
}

.section-kicker {
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  line-height: 1.1;
  margin: 0.35rem 0 1rem;
}

.prose {
  color: var(--ink);
  font-family: var(--font-serif);
  font-size: clamp(1.03rem, 1.4vw, 1.18rem);
  line-height: 1.75;
  max-width: 72ch;
}

.prose h2,
.prose h3 {
  font-family: var(--font-serif);
  line-height: 1.2;
}

.prose p {
  margin: 0 0 1.05rem;
}

.subtle {
  color: var(--muted);
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pill {
  background: var(--accent-soft);
  border: 1px solid oklch(80% 0.04 205);
  border-radius: 999px;
  color: oklch(32% 0.08 205);
  font-size: 0.82rem;
  padding: 0.35rem 0.62rem;
}

@media (max-width: 860px) {
  .site-shell {
    display: block;
    padding: 1rem;
  }

  .main-column {
    padding-block: 0;
  }
}
```

- [ ] **Step 5: Update `.gitignore`**

Modify `.gitignore` to include:

```gitignore
.superpowers/
node_modules/
dist/
.astro/
.env
.env.local
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: npm creates `package-lock.json` and installs Astro packages without errors.

- [ ] **Step 7: Run initial Astro check**

Run:

```bash
npm run check
```

Expected: command may fail because no Astro pages exist yet. Acceptable failure contains an Astro project/page setup error, not a package installation or TypeScript syntax error.

- [ ] **Step 8: Commit scaffold**

Run:

```bash
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json src/styles/global.css
git commit -m "chore: scaffold astro site"
```

Expected: commit succeeds.

## Task 2: Define Content Collections and Seed GitBook-Editable Content

**Files:**

- Create: `src/content.config.ts`
- Create: `content/site/profile.md`
- Create: `content/site/navigation.md`
- Create: `content/site/homepage.md`
- Create: `content/site/education.md`
- Create: `content/site/publications.md`
- Create: `content/site/awards.md`
- Create: `content/site/social.md`
- Create: `content/projects/robot-navigation.mdx`
- Create: `content/projects/vision-system.mdx`
- Create: `content/notes.md`
- Create: `public/images/avatar.svg`
- Create: `public/images/project-default.svg`

- [ ] **Step 1: Create content collection config**

Create `src/content.config.ts`:

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
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
    email: z.string().email().optional(),
    layout: z.enum(["profile-home"]).optional(),
    sections: z
      .array(
        z.object({
          type: z.enum(["markdown", "collection-list", "timeline", "link-card"]),
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
    items: z.array(z.object({}).passthrough()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().default("/images/project-default.svg"),
    video: z.string().url().optional(),
    links: z.array(linkSchema).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "notes.md", base: "./content" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    url: z.string().url(),
  }),
});

export const collections = { site, projects, notes };
```

- [ ] **Step 2: Create profile content**

Create `content/site/profile.md`:

```md
---
name: "Your Name"
avatar: "/images/avatar.svg"
motto: "Long-term thinking, engineering validation."
location: "China"
organization: "University of Chinese Academy of Sciences"
position: "Master's Student"
title: "Engineering Graduate Student"
research:
  - Robotics
  - Autonomous navigation
  - Multi-sensor systems
email: "name@example.com"
---

I am an engineering graduate student focused on building reliable robotic systems from research ideas to working demonstrations. My current interests include autonomous navigation, perception, and deployment-oriented robotics software.
```

- [ ] **Step 3: Create navigation content**

Create `content/site/navigation.md`:

```md
---
items:
  - label: "Home"
    href: "/"
  - label: "Projects"
    href: "/projects/"
  - label: "Publications"
    href: "/publications/"
  - label: "Awards"
    href: "/awards/"
  - label: "Notes"
    href: "https://example.gitbook.io/notes"
    external: true
---
```

- [ ] **Step 4: Create homepage content**

Create `content/site/homepage.md`:

```md
---
layout: profile-home
sections:
  - type: markdown
    title: About
    source: profile
  - type: collection-list
    title: Featured Projects
    source: projects
    filter:
      featured: true
    limit: 3
  - type: timeline
    title: Education
    source: education
  - type: collection-list
    title: Publications
    source: publications
  - type: collection-list
    title: Awards
    source: awards
  - type: link-card
    title: Notes
    source: notes
---
```

- [ ] **Step 5: Create education content**

Create `content/site/education.md`:

```md
---
items:
  - degree: "M.S. Candidate"
    school: "University of Chinese Academy of Sciences"
    period: "2026 - Present"
    description: "Graduate study in engineering and research-oriented systems development."
  - degree: "B.Eng."
    school: "Wuhan University"
    period: "2022 - 2026"
    description: "Undergraduate training in engineering fundamentals, research practice, and project implementation."
---
```

- [ ] **Step 6: Create publication content**

Create `content/site/publications.md`:

```md
---
items:
  - title: "Research Paper Title"
    venue: "Conference or Journal"
    date: 2026
    authors: "Your Name, Collaborator A, Collaborator B"
    link: "https://example.com/paper"
    status: "Under review"
---
```

- [ ] **Step 7: Create awards content**

Create `content/site/awards.md`:

```md
---
items:
  - title: "Academic Award"
    issuer: "Awarding Organization"
    date: 2025
    description: "Recognition for research, coursework, competition, or engineering project work."
---
```

- [ ] **Step 8: Create social links content**

Create `content/site/social.md`:

```md
---
items:
  - label: "GitHub"
    url: "https://github.com/yourname"
    type: "code"
  - label: "Google Scholar"
    url: "https://scholar.google.com"
    type: "paper"
---
```

- [ ] **Step 9: Create notes link content**

Create `content/notes.md`:

```md
---
title: "Open Learning Notes"
summary: "A separate GitBook space for study notes, research reading, and long-form technical writing."
url: "https://example.gitbook.io/notes"
---

The notes site is maintained in GitBook and linked from this homepage.
```

- [ ] **Step 10: Create sample project MDX**

Create `content/projects/robot-navigation.mdx`:

```mdx
---
title: "Autonomous Robot Navigation System"
summary: "An indoor navigation experiment covering mapping, localization, path planning, and system integration."
date: 2026-03-01
tags:
  - ROS2
  - Navigation
  - Robotics
cover: "/images/project-default.svg"
video: "https://example.com/navigation-demo.mp4"
links:
  - label: "Repository"
    url: "https://github.com/example/navigation"
    type: "code"
featured: true
order: 10
---

This project demonstrates an end-to-end navigation workflow for a mobile robot. The first version emphasizes reproducible launch files, observable runtime behavior, and clear experiment records.

<ProjectVideo url="https://example.com/navigation-demo.mp4" title="Navigation Demo" />
```

Create `content/projects/vision-system.mdx`:

```mdx
---
title: "Vision-Based Scene Understanding"
summary: "A research prototype for image-based perception and qualitative experiment review."
date: 2025-11-15
tags:
  - Computer Vision
  - Perception
cover: "/images/project-default.svg"
links:
  - label: "Demo"
    url: "https://example.com/vision-demo"
    type: "demo"
featured: false
order: 5
---

This project records an early exploration of visual perception pipelines. The page is intentionally written as a research note with images, decisions, and experimental observations.

<LinkButton href="https://example.com/vision-demo">Open demo</LinkButton>
```

- [ ] **Step 11: Create placeholder SVG assets**

Create `public/images/avatar.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="Avatar placeholder">
  <rect width="320" height="320" rx="64" fill="oklch(90% 0.04 205)"/>
  <circle cx="160" cy="124" r="56" fill="oklch(45% 0.095 205)"/>
  <path d="M72 272c14-58 50-88 88-88s74 30 88 88" fill="oklch(70% 0.055 72)"/>
</svg>
```

Create `public/images/project-default.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img" aria-label="Project cover placeholder">
  <rect width="960" height="540" fill="oklch(94% 0.012 92)"/>
  <path d="M0 390C180 310 280 430 460 340s290-120 500-18v218H0z" fill="oklch(88% 0.04 205)"/>
  <circle cx="730" cy="150" r="70" fill="oklch(78% 0.065 72)"/>
  <path d="M140 150h360M140 205h250M140 260h310" stroke="oklch(45% 0.095 205)" stroke-width="22" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 12: Run content validation**

Run:

```bash
npm run check
```

Expected: may still fail because pages and MDX component exports do not exist. Acceptable failure mentions missing pages/components. Schema-related errors in the content files are not acceptable; fix those before continuing.

- [ ] **Step 13: Commit content schema and seed content**

Run:

```bash
git add src/content.config.ts content public/images
git commit -m "feat: add content schema and seed content"
```

Expected: commit succeeds.

## Task 3: Add Typed Content and Path Utilities

**Files:**

- Create: `src/lib/paths.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/sections.ts`

- [ ] **Step 1: Create path helpers**

Create `src/lib/paths.ts`:

```ts
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";

  if (/^(https?:|mailto:|tel:)/.test(path)) {
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
```

- [ ] **Step 2: Create section helpers**

Create `src/lib/sections.ts`:

```ts
export const sectionTypes = ["markdown", "collection-list", "timeline", "link-card"] as const;

export type SectionType = (typeof sectionTypes)[number];

export type HomeSection = {
  type: SectionType;
  title: string;
  source: "profile" | "education" | "publications" | "awards" | "projects" | "notes";
  limit?: number;
  filter?: {
    featured?: boolean;
  };
};

export function assertKnownSection(section: HomeSection): HomeSection {
  if (!sectionTypes.includes(section.type)) {
    throw new Error(`Unknown homepage section type: ${section.type}`);
  }

  return section;
}
```

- [ ] **Step 3: Create content helpers**

Create `src/lib/content.ts`:

```ts
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type SiteEntryId =
  | "profile"
  | "navigation"
  | "homepage"
  | "education"
  | "publications"
  | "awards"
  | "social";

export async function getSiteEntry(id: SiteEntryId): Promise<CollectionEntry<"site">> {
  const entry = await getEntry("site", id);

  if (!entry) {
    throw new Error(`Missing required site content: content/site/${id}.md`);
  }

  return entry;
}

export async function getNotesEntry(): Promise<CollectionEntry<"notes">> {
  const entry = await getEntry("notes", "notes");

  if (!entry) {
    throw new Error("Missing required notes content: content/notes.md");
  }

  return entry;
}

export async function getProjects(options: { featured?: boolean; limit?: number } = {}) {
  const projects = await getCollection("projects");
  const filtered = options.featured === undefined
    ? projects
    : projects.filter((project) => project.data.featured === options.featured);

  const sorted = filtered.sort((a, b) => {
    if (b.data.order !== a.data.order) {
      return b.data.order - a.data.order;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });

  return typeof options.limit === "number" ? sorted.slice(0, options.limit) : sorted;
}
```

- [ ] **Step 4: Run TypeScript check**

Run:

```bash
npm run check
```

Expected: may still fail due missing route/page files, but should not fail because of `src/lib/*.ts` syntax or type errors.

- [ ] **Step 5: Commit utilities**

Run:

```bash
git add src/lib
git commit -m "feat: add content utilities"
```

Expected: commit succeeds.

## Task 4: Build Base Layout, Sidebar, Navigation, and MDX Components

**Files:**

- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/ProfileSidebar.astro`
- Create: `src/components/Navigation.astro`
- Create: `src/components/SocialLinks.astro`
- Create: `src/components/ProjectVideo.astro`
- Create: `src/components/ProjectGallery.astro`
- Create: `src/components/LinkButton.astro`
- Create: `src/components/ResearchFigure.astro`

- [ ] **Step 1: Create base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "@styles/global.css";
import Navigation from "@components/Navigation.astro";
import ProfileSidebar from "@components/ProfileSidebar.astro";
import { getSiteEntry } from "@lib/content";

type Props = {
  title?: string;
  description?: string;
};

const profile = await getSiteEntry("profile");
const navigation = await getSiteEntry("navigation");
const social = await getSiteEntry("social");

const pageTitle = Astro.props.title
  ? `${Astro.props.title} | ${profile.data.name}`
  : profile.data.name || "Personal Academic Site";
const description = Astro.props.description || profile.body || profile.data.motto || "";
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description.slice(0, 160)} />
    <title>{pageTitle}</title>
  </head>
  <body>
    <div class="site-shell">
      <ProfileSidebar profile={profile} social={social} />
      <main class="main-column">
        <Navigation items={navigation.data.items ?? []} />
        <slot />
      </main>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Create social links component**

Create `src/components/SocialLinks.astro`:

```astro
---
type SocialItem = {
  label?: string;
  url?: string;
  type?: string;
};

type Props = {
  items: SocialItem[];
};

const { items } = Astro.props;
---

<div class="social-links" aria-label="Social links">
  {items.map((item) => item.label && item.url && (
    <a href={item.url} target="_blank" rel="noreferrer">
      {item.label}
    </a>
  ))}
</div>

<style>
  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 1.2rem;
  }

  .social-links a {
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    font-size: 0.85rem;
    padding: 0.42rem 0.72rem;
    text-decoration: none;
    transition: background 180ms ease-out, border-color 180ms ease-out, transform 180ms ease-out;
  }

  .social-links a:hover {
    background: var(--accent-soft);
    border-color: oklch(75% 0.045 205);
    transform: translateY(-1px);
  }
</style>
```

- [ ] **Step 3: Create profile sidebar**

Create `src/components/ProfileSidebar.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import SocialLinks from "@components/SocialLinks.astro";

type Props = {
  profile: CollectionEntry<"site">;
  social: CollectionEntry<"site">;
};

const { profile, social } = Astro.props;
const research = profile.data.research ?? [];
const socialItems = (social.data.items ?? []) as Array<{ label?: string; url?: string; type?: string }>;
---

<aside class="profile-card">
  {profile.data.avatar && <img class="avatar" src={profile.data.avatar} alt={`${profile.data.name} avatar`} />}
  <p class="eyebrow">{profile.data.position}</p>
  <h1>{profile.data.name}</h1>
  {profile.data.motto && <p class="motto">{profile.data.motto}</p>}

  <dl class="facts">
    {profile.data.location && <><dt>Location</dt><dd>{profile.data.location}</dd></>}
    {profile.data.organization && <><dt>Institution</dt><dd>{profile.data.organization}</dd></>}
    {profile.data.title && <><dt>Specialty</dt><dd>{profile.data.title}</dd></>}
    {profile.data.email && <><dt>Email</dt><dd><a href={`mailto:${profile.data.email}`}>{profile.data.email}</a></dd></>}
  </dl>

  {research.length > 0 && (
    <div class="research">
      <p>Research</p>
      <ul class="pill-list">
        {research.map((item) => <li class="pill">{item}</li>)}
      </ul>
    </div>
  )}

  <SocialLinks items={socialItems} />
</aside>

<style>
  .profile-card {
    align-self: start;
    background:
      linear-gradient(180deg, oklch(99% 0.006 92 / 0.92), oklch(96% 0.012 92 / 0.92)),
      radial-gradient(circle at 20% 0%, oklch(88% 0.045 205 / 0.7), transparent 18rem);
    border: 1px solid var(--line);
    border-radius: 2rem;
    box-shadow: var(--shadow);
    padding: clamp(1.25rem, 3vw, 2rem);
    position: sticky;
    top: 2rem;
  }

  .avatar {
    aspect-ratio: 1;
    border-radius: 1.5rem;
    box-shadow: 0 16px 40px oklch(30% 0.03 248 / 0.16);
    object-fit: cover;
    width: min(11rem, 58vw);
  }

  .eyebrow {
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    margin: 1.4rem 0 0.45rem;
    text-transform: uppercase;
  }

  h1 {
    font-family: var(--font-serif);
    font-size: clamp(2rem, 4vw, 3.4rem);
    line-height: 0.98;
    margin: 0;
  }

  .motto {
    color: var(--muted);
    font-family: var(--font-serif);
    font-size: 1.08rem;
    line-height: 1.55;
    margin: 1rem 0 1.4rem;
  }

  .facts {
    border-top: 1px solid var(--line);
    display: grid;
    gap: 0.75rem;
    margin: 0;
    padding-top: 1.2rem;
  }

  .facts dt {
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .facts dd {
    margin: 0;
  }

  .research {
    margin-top: 1.25rem;
  }

  .research p {
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  @media (max-width: 860px) {
    .profile-card {
      position: static;
    }
  }
</style>
```

- [ ] **Step 4: Create navigation component**

Create `src/components/Navigation.astro`:

```astro
---
import { withBase } from "@lib/paths";

type NavItem = {
  label?: string;
  href?: string;
  external?: boolean;
};

type Props = {
  items: NavItem[];
};

const { items } = Astro.props;
---

<nav class="top-nav" aria-label="Primary navigation">
  {items.map((item) => item.label && item.href && (
    <a href={item.external ? item.href : withBase(item.href)} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
      {item.label}
    </a>
  ))}
</nav>

<style>
  .top-nav {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-bottom: clamp(2rem, 5vw, 4rem);
  }

  .top-nav a {
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.92rem;
    font-weight: 700;
    padding: 0.55rem 0.85rem;
    text-decoration: none;
  }

  .top-nav a:hover {
    background: var(--panel);
    color: var(--accent);
  }

  @media (max-width: 860px) {
    .top-nav {
      justify-content: flex-start;
      margin: 1.25rem 0 2rem;
    }
  }
</style>
```

- [ ] **Step 5: Create MDX component whitelist components**

Create `src/components/ProjectVideo.astro`:

```astro
---
type Props = {
  url: string;
  title?: string;
};

const { url, title } = Astro.props;
---

<figure class="project-video">
  <video src={url} controls preload="metadata"></video>
  {title && <figcaption>{title}</figcaption>}
</figure>
```

Create `src/components/ProjectGallery.astro`:

```astro
---
type Props = {
  images: string[];
};

const { images } = Astro.props;
---

<div class="project-gallery">
  {images.map((image) => <img src={image} alt="" loading="lazy" />)}
</div>
```

Create `src/components/LinkButton.astro`:

```astro
---
type Props = {
  href: string;
};

const { href } = Astro.props;
---

<a class="link-button" href={href} target="_blank" rel="noreferrer">
  <slot />
</a>
```

Create `src/components/ResearchFigure.astro`:

```astro
---
type Props = {
  src: string;
  alt: string;
  caption?: string;
};

const { src, alt, caption } = Astro.props;
---

<figure class="research-figure">
  <img src={src} alt={alt} loading="lazy" />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

- [ ] **Step 6: Add MDX component styles to `src/styles/global.css`**

Append:

```css
.project-video,
.research-figure {
  margin: 2rem 0;
}

.project-video video,
.research-figure img,
.project-gallery img {
  border: 1px solid var(--line);
  border-radius: 1.25rem;
  box-shadow: 0 18px 50px oklch(30% 0.03 248 / 0.1);
}

.project-video figcaption,
.research-figure figcaption {
  color: var(--muted);
  font-size: 0.92rem;
  margin-top: 0.65rem;
}

.project-gallery {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  margin: 2rem 0;
}

.link-button {
  background: var(--ink);
  border-radius: 999px;
  color: var(--panel);
  display: inline-flex;
  font-weight: 800;
  margin: 1rem 0;
  padding: 0.72rem 1rem;
  text-decoration: none;
}
```

- [ ] **Step 7: Run check**

Run:

```bash
npm run check
```

Expected: if it fails, acceptable remaining failures are missing page files or renderer components from later tasks. Fix any errors from these newly created files before committing.

- [ ] **Step 8: Commit layout foundation**

Run:

```bash
git add src/layouts/BaseLayout.astro src/components/ProfileSidebar.astro src/components/Navigation.astro src/components/SocialLinks.astro src/components/ProjectVideo.astro src/components/ProjectGallery.astro src/components/LinkButton.astro src/components/ResearchFigure.astro src/styles/global.css
git commit -m "feat: add site layout foundation"
```

Expected: commit succeeds.

## Task 5: Render Homepage Sections

**Files:**

- Create: `src/components/CollectionList.astro`
- Create: `src/components/EducationTimeline.astro`
- Create: `src/components/PublicationList.astro`
- Create: `src/components/AwardList.astro`
- Create: `src/components/SectionRenderer.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create project collection list component**

Create `src/components/CollectionList.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import { projectHref } from "@lib/paths";

type Props = {
  projects: CollectionEntry<"projects">[];
};

const { projects } = Astro.props;
---

<div class="project-list">
  {projects.map((project) => (
    <article class="project-item">
      <a href={projectHref(project.id)}>
        <img src={project.data.cover} alt="" loading="lazy" />
        <div>
          <p class="meta">{project.data.date.getFullYear()} · {project.data.tags.join(" / ")}</p>
          <h3>{project.data.title}</h3>
          <p>{project.data.summary}</p>
        </div>
      </a>
    </article>
  ))}
</div>

<style>
  .project-list {
    display: grid;
    gap: 1rem;
  }

  .project-item a {
    align-items: center;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 1.35rem;
    display: grid;
    gap: 1rem;
    grid-template-columns: 10rem minmax(0, 1fr);
    padding: 0.85rem;
    text-decoration: none;
    transition: border-color 180ms ease-out, transform 180ms ease-out, box-shadow 180ms ease-out;
  }

  .project-item a:hover {
    border-color: oklch(74% 0.05 205);
    box-shadow: 0 16px 48px oklch(30% 0.03 248 / 0.09);
    transform: translateY(-2px);
  }

  .project-item img {
    aspect-ratio: 16 / 10;
    border-radius: 0.9rem;
    object-fit: cover;
  }

  .project-item h3 {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    margin: 0.2rem 0 0.35rem;
  }

  .project-item p {
    color: var(--muted);
    margin: 0;
  }

  .project-item .meta {
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  @media (max-width: 620px) {
    .project-item a {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create education timeline**

Create `src/components/EducationTimeline.astro`:

```astro
---
type EducationItem = {
  degree?: string;
  school?: string;
  period?: string;
  description?: string;
};

type Props = {
  items: EducationItem[];
};

const { items } = Astro.props;
---

<ol class="timeline">
  {items.map((item) => (
    <li>
      <span>{item.period}</span>
      <h3>{item.degree}</h3>
      <p class="school">{item.school}</p>
      {item.description && <p>{item.description}</p>}
    </li>
  ))}
</ol>

<style>
  .timeline {
    border-left: 1px solid var(--line);
    list-style: none;
    margin: 0;
    padding: 0 0 0 1.2rem;
  }

  .timeline li {
    margin: 0 0 1.4rem;
    position: relative;
  }

  .timeline li::before {
    background: var(--accent);
    border: 4px solid var(--surface);
    border-radius: 999px;
    content: "";
    height: 0.62rem;
    left: -1.58rem;
    position: absolute;
    top: 0.2rem;
    width: 0.62rem;
  }

  .timeline span {
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 800;
  }

  .timeline h3 {
    font-family: var(--font-serif);
    margin: 0.25rem 0;
  }

  .timeline p {
    color: var(--muted);
    margin: 0.2rem 0;
  }

  .timeline .school {
    color: var(--ink);
    font-weight: 700;
  }
</style>
```

- [ ] **Step 3: Create publication list**

Create `src/components/PublicationList.astro`:

```astro
---
type PublicationItem = {
  title?: string;
  venue?: string;
  date?: number;
  authors?: string;
  link?: string;
  status?: string;
};

type Props = {
  items: PublicationItem[];
};

const { items } = Astro.props;
---

<div class="publication-list">
  {items.map((item) => (
    <article>
      <p class="meta">{item.date}{item.venue ? ` · ${item.venue}` : ""}</p>
      <h3>{item.link ? <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a> : item.title}</h3>
      {item.authors && <p>{item.authors}</p>}
      {item.status && <span>{item.status}</span>}
    </article>
  ))}
</div>

<style>
  .publication-list {
    display: grid;
    gap: 1rem;
  }

  .publication-list article {
    border-bottom: 1px solid var(--line);
    padding-bottom: 1rem;
  }

  .publication-list .meta {
    color: var(--accent);
    font-size: 0.82rem;
    font-weight: 800;
    margin: 0 0 0.35rem;
  }

  .publication-list h3 {
    font-family: var(--font-serif);
    margin: 0;
  }

  .publication-list p {
    color: var(--muted);
    margin: 0.4rem 0;
  }

  .publication-list span {
    background: var(--surface-strong);
    border-radius: 999px;
    color: var(--muted);
    display: inline-flex;
    font-size: 0.78rem;
    padding: 0.28rem 0.55rem;
  }
</style>
```

- [ ] **Step 4: Create award list**

Create `src/components/AwardList.astro`:

```astro
---
type AwardItem = {
  title?: string;
  issuer?: string;
  date?: number;
  description?: string;
};

type Props = {
  items: AwardItem[];
};

const { items } = Astro.props;
---

<div class="award-list">
  {items.map((item) => (
    <article>
      <time>{item.date}</time>
      <div>
        <h3>{item.title}</h3>
        {item.issuer && <p class="issuer">{item.issuer}</p>}
        {item.description && <p>{item.description}</p>}
      </div>
    </article>
  ))}
</div>

<style>
  .award-list {
    display: grid;
    gap: 0.85rem;
  }

  .award-list article {
    align-items: start;
    display: grid;
    gap: 1rem;
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }

  .award-list time {
    color: var(--accent);
    font-weight: 800;
  }

  .award-list h3 {
    font-family: var(--font-serif);
    margin: 0;
  }

  .award-list p {
    color: var(--muted);
    margin: 0.3rem 0;
  }

  .award-list .issuer {
    color: var(--ink);
    font-weight: 700;
  }
</style>
```

- [ ] **Step 5: Create section renderer**

Create `src/components/SectionRenderer.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import { render } from "astro:content";
import AwardList from "@components/AwardList.astro";
import CollectionList from "@components/CollectionList.astro";
import EducationTimeline from "@components/EducationTimeline.astro";
import PublicationList from "@components/PublicationList.astro";
import { getNotesEntry, getProjects, getSiteEntry } from "@lib/content";
import { assertKnownSection, type HomeSection } from "@lib/sections";

type Props = {
  section: HomeSection;
};

const section = assertKnownSection(Astro.props.section);

let bodyEntry: CollectionEntry<"site"> | undefined;
let projects: CollectionEntry<"projects">[] = [];
let notes: CollectionEntry<"notes"> | undefined;
let listItems: Array<Record<string, unknown>> = [];
let MarkdownContent: any = undefined;

if (section.source === "projects") {
  projects = await getProjects({
    featured: section.filter?.featured,
    limit: section.limit,
  });
} else if (section.source === "notes") {
  notes = await getNotesEntry();
} else {
  bodyEntry = await getSiteEntry(section.source);
  listItems = (bodyEntry.data.items ?? []) as Array<Record<string, unknown>>;

  if (section.type === "markdown") {
    const rendered = await render(bodyEntry);
    MarkdownContent = rendered.Content;
  }
}

const educationItems = listItems as Array<{ degree?: string; school?: string; period?: string; description?: string }>;
const publicationItems = listItems as Array<{ title?: string; venue?: string; date?: number; authors?: string; link?: string; status?: string }>;
const awardItems = listItems as Array<{ title?: string; issuer?: string; date?: number; description?: string }>;
---

<section class="content-section">
  <p class="section-kicker">{section.source}</p>
  <h2 class="section-title">{section.title}</h2>

  {section.type === "markdown" && MarkdownContent && (
    <div class="prose">
      <MarkdownContent />
    </div>
  )}

  {section.type === "collection-list" && section.source === "projects" && (
    <CollectionList projects={projects} />
  )}

  {section.type === "collection-list" && section.source === "publications" && (
    <PublicationList items={publicationItems} />
  )}

  {section.type === "collection-list" && section.source === "awards" && (
    <AwardList items={awardItems} />
  )}

  {section.type === "timeline" && section.source === "education" && (
    <EducationTimeline items={educationItems} />
  )}

  {section.type === "link-card" && section.source === "notes" && notes && (
    <a class="note-card" href={notes.data.url} target="_blank" rel="noreferrer">
      <span>{notes.data.title}</span>
      <strong>{notes.data.summary}</strong>
    </a>
  )}
</section>

<style>
  .note-card {
    background: var(--ink);
    border-radius: 1.4rem;
    color: var(--panel);
    display: block;
    max-width: 42rem;
    padding: 1.2rem;
    text-decoration: none;
  }

  .note-card span {
    color: var(--warm);
    display: block;
    font-weight: 800;
    margin-bottom: 0.4rem;
  }

  .note-card strong {
    display: block;
    font-family: var(--font-serif);
    font-size: 1.35rem;
    line-height: 1.25;
  }
</style>
```

- [ ] **Step 6: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import SectionRenderer from "@components/SectionRenderer.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { getSiteEntry } from "@lib/content";
import type { HomeSection } from "@lib/sections";

const homepage = await getSiteEntry("homepage");
const sections = (homepage.data.sections ?? []) as HomeSection[];
---

<BaseLayout>
  <div class="hero">
    <p class="section-kicker">Personal academic site</p>
    <h2>Research, engineering projects, and notes in one maintained place.</h2>
  </div>

  {sections.map((section) => <SectionRenderer section={section} />)}
</BaseLayout>

<style>
  .hero {
    max-width: 760px;
  }

  .hero h2 {
    font-family: var(--font-serif);
    font-size: clamp(2.4rem, 6vw, 5.6rem);
    letter-spacing: -0.04em;
    line-height: 0.95;
    margin: 0;
  }
</style>
```

- [ ] **Step 7: Run build**

Run:

```bash
npm run build
```

Expected: build may fail only because project detail routes and MDX component injection are not complete. Fix any homepage, section renderer, or content utility errors before committing.

- [ ] **Step 8: Commit homepage rendering**

Run:

```bash
git add src/components/CollectionList.astro src/components/EducationTimeline.astro src/components/PublicationList.astro src/components/AwardList.astro src/components/SectionRenderer.astro src/pages/index.astro
git commit -m "feat: render markdown-driven homepage"
```

Expected: commit succeeds.

## Task 6: Add Project, Publication, Award, and Notes Routes

**Files:**

- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/publications.astro`
- Create: `src/pages/awards.astro`
- Create: `src/pages/notes.astro`

- [ ] **Step 1: Create project layout**

Create `src/layouts/ProjectLayout.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";
import BaseLayout from "@layouts/BaseLayout.astro";

type Props = {
  project: CollectionEntry<"projects">;
};

const { project } = Astro.props;
---

<BaseLayout title={project.data.title} description={project.data.summary}>
  <article class="project-detail">
    <header>
      <p class="section-kicker">{project.data.date.getFullYear()} · {project.data.tags.join(" / ")}</p>
      <h2>{project.data.title}</h2>
      <p>{project.data.summary}</p>
      {project.data.links.length > 0 && (
        <div class="project-links">
          {project.data.links.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
          ))}
        </div>
      )}
    </header>
    <img class="cover" src={project.data.cover} alt="" />
    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>

<style>
  .project-detail header {
    max-width: 760px;
  }

  .project-detail h2 {
    font-family: var(--font-serif);
    font-size: clamp(2.3rem, 5vw, 4.8rem);
    letter-spacing: -0.035em;
    line-height: 0.98;
    margin: 0.35rem 0 1rem;
  }

  .project-detail header > p:last-of-type {
    color: var(--muted);
    font-size: 1.1rem;
    line-height: 1.65;
  }

  .project-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.2rem;
  }

  .project-links a {
    background: var(--accent);
    border-radius: 999px;
    color: var(--panel);
    font-weight: 800;
    padding: 0.58rem 0.85rem;
    text-decoration: none;
  }

  .cover {
    border: 1px solid var(--line);
    border-radius: 1.6rem;
    box-shadow: var(--shadow);
    margin: 2rem 0;
    width: 100%;
  }
</style>
```

- [ ] **Step 2: Create project list route**

Create `src/pages/projects/index.astro`:

```astro
---
import CollectionList from "@components/CollectionList.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { getProjects } from "@lib/content";

const projects = await getProjects();
---

<BaseLayout title="Projects" description="Research and engineering project portfolio.">
  <section class="content-section">
    <p class="section-kicker">Projects</p>
    <h2 class="section-title">Research projects and engineering demonstrations.</h2>
    <CollectionList projects={projects} />
  </section>
</BaseLayout>
```

- [ ] **Step 3: Create project detail route**

Create `src/pages/projects/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import ProjectLayout from "@layouts/ProjectLayout.astro";
import LinkButton from "@components/LinkButton.astro";
import ProjectGallery from "@components/ProjectGallery.astro";
import ProjectVideo from "@components/ProjectVideo.astro";
import ResearchFigure from "@components/ResearchFigure.astro";

const mdxComponents = {
  LinkButton,
  ProjectGallery,
  ProjectVideo,
  ResearchFigure,
};

export async function getStaticPaths() {
  const projects = await getCollection("projects");

  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---

<ProjectLayout project={project}>
  <Content components={mdxComponents} />
</ProjectLayout>
```

- [ ] **Step 4: Create publications route**

Create `src/pages/publications.astro`:

```astro
---
import PublicationList from "@components/PublicationList.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { getSiteEntry } from "@lib/content";

const publications = await getSiteEntry("publications");
const items = (publications.data.items ?? []) as Array<{ title?: string; venue?: string; date?: number; authors?: string; link?: string; status?: string }>;
---

<BaseLayout title="Publications" description="Publication list.">
  <section class="content-section">
    <p class="section-kicker">Publications</p>
    <h2 class="section-title">Published and in-progress research writing.</h2>
    <PublicationList items={items} />
  </section>
</BaseLayout>
```

- [ ] **Step 5: Create awards route**

Create `src/pages/awards.astro`:

```astro
---
import AwardList from "@components/AwardList.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { getSiteEntry } from "@lib/content";

const awards = await getSiteEntry("awards");
const items = (awards.data.items ?? []) as Array<{ title?: string; issuer?: string; date?: number; description?: string }>;
---

<BaseLayout title="Awards" description="Awards and recognitions.">
  <section class="content-section">
    <p class="section-kicker">Awards</p>
    <h2 class="section-title">Selected awards and recognitions.</h2>
    <AwardList items={items} />
  </section>
</BaseLayout>
```

- [ ] **Step 6: Create notes route**

Create `src/pages/notes.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import { getNotesEntry } from "@lib/content";

const notes = await getNotesEntry();
---

<BaseLayout title="Notes" description={notes.data.summary}>
  <section class="content-section">
    <p class="section-kicker">Notes</p>
    <h2 class="section-title">{notes.data.title}</h2>
    <p class="prose">{notes.data.summary}</p>
    <a class="notes-link" href={notes.data.url} target="_blank" rel="noreferrer">Open GitBook notes</a>
  </section>
</BaseLayout>

<style>
  .notes-link {
    background: var(--ink);
    border-radius: 999px;
    color: var(--panel);
    display: inline-flex;
    font-weight: 800;
    margin-top: 1.2rem;
    padding: 0.78rem 1rem;
    text-decoration: none;
  }
</style>
```

- [ ] **Step 7: Run full build**

Run:

```bash
npm run build
```

Expected: PASS. `dist/` contains `index.html`, `projects/index.html`, generated project detail pages, `publications/index.html`, `awards/index.html`, and `notes/index.html`.

- [ ] **Step 8: Commit routes**

Run:

```bash
git add src/layouts/ProjectLayout.astro src/pages
git commit -m "feat: add site routes"
```

Expected: commit succeeds.

## Task 7: Add GitHub Pages Deployment and Final Verification

**Files:**

- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Install, build, and upload site
        uses: withastro/action@v6
        env:
          SITE_URL: ${{ vars.SITE_URL || format('https://{0}.github.io', github.repository_owner) }}
          BASE_PATH: ${{ vars.BASE_PATH || format('/{0}', github.event.repository.name) }}

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Create README**

Create `README.md`:

```md
# Personal Academic Site

Astro-based personal academic website generated from Markdown and MDX content.

## Content Editing

Editable content lives in `content/`.

- `content/site/profile.md`: sidebar profile and biography.
- `content/site/navigation.md`: navigation items.
- `content/site/homepage.md`: homepage section order.
- `content/site/education.md`: education timeline.
- `content/site/publications.md`: publications.
- `content/site/awards.md`: awards.
- `content/site/social.md`: social links.
- `content/projects/*.mdx`: project details.
- `content/notes.md`: external GitBook notes link.

The intended workflow is GitBook editing with Git Sync into this repository. GitHub Actions rebuilds and deploys the site after pushes to `main`.

## Local Commands

```bash
npm install
npm run check
npm run build
npm run dev
```

## GitHub Pages Settings

Set Pages source to GitHub Actions. If deploying to a user site such as `username.github.io`, set repository variable `BASE_PATH` to `/`. If deploying to a project site, leave `BASE_PATH` unset or set it to `/<repository-name>` with no trailing slash.
```

- [ ] **Step 3: Run final checks**

Run:

```bash
npm run check
npm run build
```

Expected: both PASS.

- [ ] **Step 4: Inspect generated files**

Run:

```bash
find dist -maxdepth 3 -type f | sort
```

Expected output includes:

```text
dist/awards/index.html
dist/index.html
dist/notes/index.html
dist/projects/index.html
dist/projects/robot-navigation/index.html
dist/projects/vision-system/index.html
dist/publications/index.html
```

- [ ] **Step 5: Commit deployment and docs**

Run:

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci: add github pages deployment"
```

Expected: commit succeeds.

- [ ] **Step 6: Final repository status**

Run:

```bash
git status --short
```

Expected: no output.

## Plan Self-Review

Spec coverage:

- GitBook-editable content under `content/`: covered by Tasks 2 and 7.
- Astro build-time static generation: covered by Tasks 1, 2, 5, and 6.
- Content schemas and fail-fast validation: covered by Task 2.
- Controlled homepage renderer: covered by Tasks 3 and 5.
- Whitelisted MDX components: covered by Tasks 4 and 6 with Astro-native components.
- Sidebar profile, navigation, publications, awards, education, projects, and notes link: covered by Tasks 4, 5, and 6.
- GitHub Pages deployment: covered by Task 7.
- Visual direction: covered by Tasks 1, 4, 5, and 6 through global CSS and focused components.

Placeholder scan:

- The plan contains sample content values such as `Your Name` and `example.com` intentionally as editable seed content, not implementation placeholders.
- There are no placeholder markers or incomplete implementation steps.

Type consistency:

- `HomeSection`, section schema, and `SectionRenderer.astro` use the same section types and source names.
- Markdown body rendering uses Astro's `render(entry)` API instead of relying on nonexistent rendered fields.
- MDX components are Astro components imported explicitly in the project detail route, avoiding a framework renderer dependency.
- Project route slug generation uses `project.id`, matching content collection entry IDs.
- Navigation and path helpers consistently use `withBase()` for internal links.
