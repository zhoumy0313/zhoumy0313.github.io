# Chinese-English Site Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add static Chinese and English routing to the personal academic site while preserving GitHub Pages compatibility and the current markdown-driven content model.

**Architecture:** Use language-prefixed routes (`/zh/...` and `/en/...`) for all pages, including the homepage, list pages, and project detail pages. Keep shared Astro components and layouts, but split content files by language under `content/site/{zh,en}/` and `content/projects/{zh,en}/`; page helpers will resolve the correct language content and build language-aware links.

**Tech Stack:** Astro static routing, Astro content collections, Markdown/MDX frontmatter, existing shared Astro components.

---

### Task 1: Introduce language-aware content structure

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/paths.ts`
- Modify: `src/lib/sections.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/content.ts
// Pseudocode for type coverage:
// expect getSiteEntry("profile", "zh") to resolve content/site/zh/profile.md
// expect getSiteEntry("profile", "en") to resolve content/site/en/profile.md
// expect getProjects("zh") to resolve content/projects/zh/*
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: Type errors or unresolved imports because language-aware loaders and helpers do not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/content.ts
export type Locale = "zh" | "en";
export async function getSiteEntry(id: SiteEntryId, locale: Locale = "zh") { /* resolve content/site/${locale}/${id}.md */ }
export async function getProjects(locale: Locale = "zh", options = {}) { /* resolve locale-specific project collection */ }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run check`
Expected: TypeScript compiles with the new locale-aware signatures.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/lib/content.ts src/lib/paths.ts src/lib/sections.ts
git commit -m "feat: add locale-aware content helpers"
```

### Task 2: Split content into zh/en markdown sources

**Files:**
- Create: `content/site/zh/profile.md`
- Create: `content/site/zh/homepage.md`
- Create: `content/site/zh/navigation.md`
- Create: `content/site/zh/social.md`
- Create: `content/site/zh/publications.md`
- Create: `content/site/zh/awards.md`
- Create: `content/site/zh/education.md`
- Create: `content/site/zh/notes.md`
- Create: `content/site/en/profile.md`
- Create: `content/site/en/homepage.md`
- Create: `content/site/en/navigation.md`
- Create: `content/site/en/social.md`
- Create: `content/site/en/publications.md`
- Create: `content/site/en/awards.md`
- Create: `content/site/en/education.md`
- Create: `content/site/en/notes.md`
- Create: `content/projects/zh/*.mdx`
- Create: `content/projects/en/*.mdx`

- [ ] **Step 1: Write the failing test**

```md
<!-- Expected content structure -->
<!-- getSiteEntry("profile", "zh") should find content/site/zh/profile.md -->
<!-- getSiteEntry("profile", "en") should find content/site/en/profile.md -->
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: missing-file errors until the new files exist.

- [ ] **Step 3: Write minimal implementation**

```md
---
name: "..."
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: both language trees are discovered and build succeeds.

- [ ] **Step 5: Commit**

```bash
git add content/site content/projects
git commit -m "feat: add bilingual content files"
```

### Task 3: Generate language-prefixed routes

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/[lang]/index.astro`
- Create: `src/pages/[lang]/publications.astro`
- Create: `src/pages/[lang]/awards.astro`
- Create: `src/pages/[lang]/education.astro`
- Create: `src/pages/[lang]/notes.astro`
- Create: `src/pages/[lang]/projects/index.astro`
- Create: `src/pages/[lang]/projects/[slug].astro`
- Modify: existing unprefixed route files to redirect or preserve only default entry behavior

- [ ] **Step 1: Write the failing test**

```ts
// Expect Astro build to emit /zh/index.html and /en/index.html
// Expect project detail pages under /zh/projects/... and /en/projects/...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: route generation fails or only produces unprefixed pages.

- [ ] **Step 3: Write minimal implementation**

```astro
---
export function getStaticPaths() {
  return [{ params: { lang: "zh" } }, { params: { lang: "en" } }];
}
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: both language route trees are emitted successfully.

- [ ] **Step 5: Commit**

```bash
git add src/pages
git commit -m "feat: add localized static routes"
```

### Task 4: Make layouts and navigation language-aware

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Navigation.astro`
- Modify: `src/components/ProfileSidebar.astro`
- Modify: `src/components/SectionRenderer.astro`

- [ ] **Step 1: Write the failing test**

```ts
// Expect base layout to accept locale and render the matching nav/sidebar content.
// Expect navigation links to preserve the current locale prefix.
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: props and helper calls are missing locale support.

- [ ] **Step 3: Write minimal implementation**

```astro
---
const { locale = "zh" } = Astro.props;
const homeHref = locale === "zh" ? "/zh/" : "/en/";
---
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: navigation and sidebar links resolve in the current locale.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Navigation.astro src/components/ProfileSidebar.astro src/components/SectionRenderer.astro
git commit -m "feat: localize shared layout and navigation"
```

### Task 5: Add locale switch and verify deployment behavior

**Files:**
- Modify: `src/components/Navigation.astro`
- Modify: `src/lib/paths.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**

```ts
// Verify locale switch links from /zh/... to /en/... and vice versa.
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: locale switch helpers not yet present.

- [ ] **Step 3: Write minimal implementation**

```ts
export function localizedHref(locale: Locale, path: string): string { /* prefix path */ }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run build`
Expected: locale switch links are generated and GitHub Pages-ready output still builds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navigation.astro src/lib/paths.ts README.md
git commit -m "feat: add locale switcher and usage notes"
```

### Coverage Check

- Homepage, list pages, and project pages all get localized routes in Task 3.
- Shared layout, sidebar, and nav receive locale awareness in Task 4.
- Language-aware content loading is established in Task 1 and populated in Task 2.
- Locale switch UX and deployment notes are covered in Task 5.

