# Personal Academic Site Design

## Goal

Build a personal academic website for an engineering graduate student. The first version prioritizes a mature, usable personal homepage. Future template extraction is intentionally out of scope, but the design keeps clean content schemas and extension points so the site can later become a reusable template.

## User Workflow

The site owner edits all public-facing content in GitBook. GitBook Git Sync writes Markdown/MDX content back to the GitHub Pages repository. A GitHub Actions workflow runs on push, validates content, builds a static Astro site, and deploys the generated `dist/` output to GitHub Pages.

```text
GitBook edit
-> GitBook Git Sync push to GitHub content/
-> GitHub Actions on push
-> Astro content validation and static build
-> GitHub Pages deploys dist/
-> Visitors browse the site
```

The owner should not need to clone the repository or manually push content changes after the site framework is set up.

## Technology Stack

- Astro for static site generation.
- Markdown and MDX for content.
- Astro Content Collections for build-time schema validation.
- GitHub Actions for build and deployment.
- GitHub Pages for static hosting.
- GitBook Git Sync for content editing and synchronization.

Astro is preferred because this is a content-driven static site with strong SEO needs and relatively limited client-side interactivity. It supports Markdown/MDX well, can validate content during builds, and deploys cleanly to GitHub Pages.

## Repository Structure

```text
content/
  site/
    profile.md
    navigation.md
    homepage.md
    education.md
    publications.md
    awards.md
    social.md
  projects/
    robot-navigation.mdx
    vision-system.mdx
  notes.md

src/
  components/
  content/
  layouts/
  pages/

public/
  images/
    avatar.jpg
    projects/
```

`content/` is the single source of truth for editable site content. GitBook owns this area. `src/` owns the rendering framework. `public/` stores static assets referenced from Markdown/MDX.

GitBook-generated files such as `README.md` or `SUMMARY.md` may exist, but Astro only reads explicitly configured collections under `content/site/` and `content/projects/`.

## Content Model

### Profile

`content/site/profile.md` drives the sidebar identity card and optional profile text.

```yaml
---
name: "Your Name"
avatar: "/images/avatar.jpg"
motto: "Long-term thinking, engineering validation"
location: "City"
organization: "University of Chinese Academy of Sciences"
position: "Master's Student"
title: "Major or Specialty"
research:
  - Robotics
  - Navigation
  - Multi-sensor fusion
email: "name@example.com"
---

Short biography text in Markdown.
```

Education content can naturally state that the undergraduate degree was at Wuhan University and the master's degree is at the University of Chinese Academy of Sciences. The visual identity should not be tied to either school color system.

### Homepage Configuration

`content/site/homepage.md` controls homepage section order through a restricted schema.

```yaml
---
layout: profile-home
sections:
  - type: markdown
    title: About
    source: profile
  - type: collection-list
    title: Research Projects
    source: projects
    filter:
      featured: true
    limit: 3
  - type: collection-list
    title: Publications
    source: publications
  - type: markdown
    title: Education
    source: education
---
```

### Navigation

`content/site/navigation.md` controls top-level navigation.

```yaml
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
    href: "https://your-notes.gitbook.io"
    external: true
---
```

### Projects

Each project is a standalone MDX file under `content/projects/`.

```yaml
---
title: "Autonomous Robot Navigation System"
summary: "Indoor mobile robot mapping, localization, and planning experiments."
date: 2026-03-01
tags:
  - ROS2
  - Navigation
cover: "/images/projects/nav-cover.jpg"
video: "https://example.com/demo.mp4"
links:
  - label: GitHub
    url: "https://github.com/example/project"
    type: code
featured: true
order: 10
---

Project detail content goes here.

<ProjectVideo url="https://example.com/demo.mp4" />
<ProjectGallery images={["/images/projects/a.jpg", "/images/projects/b.jpg"]} />
```

### Short Structured Lists

Education, publications, awards, and social links can start as single Markdown files with structured frontmatter arrays. This keeps editing simple in GitBook because these items are short and list-oriented.

Example publication file:

```yaml
---
items:
  - title: "Paper Title"
    venue: "Conference or Journal"
    date: 2025
    authors: "A, B, C"
    link: "https://example.com"
---
```

If these collections grow large later, they can be migrated to one-file-per-item collections without changing the public route design.

## Routing

```text
/                  Homepage
/projects/          Project list
/projects/[slug]/   Project detail
/publications/      Publication list
/awards/            Award list
/notes/             Notes landing or redirect to GitBook
```

The notes content is not merged into the Astro site. The site links to a separate GitBook Space for open learning notes. The notes site can link back to the GitHub Pages homepage.

## Controlled Rendering System

Markdown must not trigger arbitrary function execution. Page structure is controlled by a small whitelist of section types and MDX components.

Section renderer mapping:

```ts
const sectionRenderers = {
  markdown: MarkdownSection,
  "collection-list": CollectionList,
  timeline: TimelineSection,
  "link-card": LinkCardSection,
};
```

Build flow:

```text
Read homepage.md
-> Validate section type and source
-> Load referenced content or collection
-> Render through the matching built-in renderer
-> Generate static HTML
```

Allowed MDX components:

```ts
const mdxComponents = {
  ProjectVideo,
  ProjectGallery,
  LinkButton,
  ResearchFigure,
};
```

This gives the site enough flexibility for research project pages while keeping the content model safe, testable, and understandable for future template users.

## Visual Direction

The site should feel like a polished researcher's personal website, not a generic blog. It should be balanced, readable, and academically credible with a subtle engineering character.

Preferred layout:

- Desktop: persistent left identity sidebar and right scrollable content area.
- Mobile: profile card at the top, followed by navigation and stacked content sections.
- Sidebar: avatar, name, motto, location, current institution, position, specialty, research interests, email, and social buttons.
- Main content: biography, featured research projects, education, publications, awards, and links to notes.

Visual principles:

- Do not bind the palette to Wuhan University or University of Chinese Academy of Sciences branding.
- Use a restrained, elegant palette with tinted neutrals and one or two deliberate accents.
- Typography should prioritize long-form readability and clear hierarchy.
- Avoid generic card grids where richer list, timeline, and editorial layouts communicate the work better.
- Use motion sparingly for page entrance and section reveal, not decorative distraction.

## Deployment

GitHub Actions should run on pushes to the main branch.

Pipeline:

```text
Checkout repository
-> Install dependencies
-> Validate Astro content collections
-> Build static site to dist/
-> Upload GitHub Pages artifact
-> Deploy to GitHub Pages
```

The workflow should use GitHub's official Pages deployment action pattern and Astro's GitHub Pages deployment guidance.

## Error Handling

- Missing required frontmatter fields fail the build with a clear schema error.
- Unknown homepage section types fail the build.
- Unknown section sources fail the build.
- Invalid internal navigation links fail the build where practical.
- Missing project covers fall back to a default visual.
- Missing optional videos or external links render an empty state instead of breaking the page.
- External links are marked with `external: true`; they are not fetched or validated at build time.

Failing fast during GitHub Actions is preferred to silently publishing malformed pages.

## First-Version Scope

Included:

- Personal homepage with sidebar profile.
- Markdown-driven navigation.
- Editable profile, education, publications, awards, social links, and homepage section order.
- Project list and project detail pages from MDX.
- External notes link to GitBook.
- GitHub Actions deployment to GitHub Pages.
- Build-time content validation.
- Initial responsive visual design.

Excluded for now:

- Full reusable template documentation.
- Theme marketplace or plugin system.
- Arbitrary Markdown-triggered function execution.
- Runtime fetching from GitHub APIs.
- Importing the full notes knowledge base into the personal site.
- CMS features beyond GitBook Git Sync.

## References

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Astro GitHub Pages deployment: https://docs.astro.build/en/guides/deploy/github/
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- GitBook Git Sync: https://gitbook.com/docs/getting-started/git-sync
- GitBook content configuration: https://gitbook.com/docs/getting-started/git-sync/content-configuration
