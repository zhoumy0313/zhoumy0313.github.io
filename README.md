# Personal Academic Site

An Astro-based personal academic website generated from Markdown and MDX content.

## What This Site Is

This repository is the presentation layer for a personal academic homepage.
It is built as a static site and deployed to GitHub Pages.

The editable content is intended to live in `content/` and be updated through GitBook Git Sync, so the site owner can change page content without touching the Astro components.

## Local Development

Install dependencies:

```bash
npm install
```

Run the type and content checks:

```bash
npm run check
```

Build the static site:

```bash
npm run build
```

Start the local dev server:

```bash
npm run dev
```

Open the local site in your browser with the URL printed by Astro, usually `http://localhost:4321/`.

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

It:
- runs on pushes to `main`
- supports manual runs via `workflow_dispatch`
- uses `actions/checkout@v6`
- builds with `withastro/action@v6`
- deploys with `actions/deploy-pages@v5`

### GitHub Pages Settings

In the repository settings, set Pages source to `GitHub Actions`.

Set these repository variables when needed:

- `SITE_URL`
  - Optional.
  - Overrides the public site URL passed to Astro.
- `BASE_PATH`
  - Required for project sites.
  - Use `/` for a user site such as `username.github.io`.
  - Use `/<repo-name>` for a project site, for example `/personal-academic-site`.

The workflow uses safe fallbacks:

```yaml
SITE_URL: ${{ vars.SITE_URL || format('https://{0}.github.io', github.repository_owner) }}
BASE_PATH: ${{ vars.BASE_PATH || format('/{0}', github.event.repository.name) }}
```

If you are deploying a user site, override `BASE_PATH` to `/`.

## GitBook Editing Model

GitBook is the source of truth for content editing. The intended workflow is:

```text
Edit in GitBook
-> GitBook Git Sync pushes Markdown/MDX into this repo
-> GitHub Actions builds the site
-> GitHub Pages serves the generated static output
```

The goal is that the site owner edits content in GitBook, not by cloning and manually editing Astro files.

## Content Structure

All editable content lives under `content/`.

- `content/site/homepage.md` controls homepage section order and section types.
- `content/site/profile.md` controls the sidebar identity block and homepage "About" section body.
- `content/site/navigation.md` controls top navigation labels and destinations.
- `content/site/social.md` controls sidebar social/contact buttons.
- `content/site/education.md` controls the education timeline.
- `content/site/publications.md` controls the publications list.
- `content/site/awards.md` controls the awards list.
- `content/notes.md` controls the external notes landing page.
- `content/projects/*.mdx` controls individual project pages.

Static assets live under `public/`:

- `public/images/avatar.svg` is the default profile avatar.
- `public/images/project-default.svg` is the fallback project cover.

## Markdown and MDX Conventions

### 1. Site singleton files

`content/site/*.md` files are single-entry content sources used by the homepage and dedicated routes.

Supported homepage section types are controlled by `content/site/homepage.md`:

- `markdown`
- `collection-list`
- `timeline`
- `link-card`

The renderer only accepts the allowed source/type combinations. Invalid combinations fail the build.

### 2. Structured list data

`content/site/publications.md`, `content/site/awards.md`, and `content/site/education.md` use frontmatter arrays.

The expected item shapes are:

```md
---
items:
  - title: "Paper Title"
    venue: "Conference or Journal"
    date: 2026
    authors: "A, B, C"
    link: "https://example.com"
    status: "Under review"
---
```

```md
---
items:
  - title: "Academic Award"
    issuer: "Awarding Organization"
    date: 2025
    description: "Recognition for research or project work."
---
```

```md
---
items:
  - degree: "M.S. Candidate"
    school: "University of Chinese Academy of Sciences"
    period: "2026 - Present"
    description: "Graduate study in engineering and research-oriented systems development."
---
```

These files are validated at build time. Missing required fields fail the build instead of publishing blank UI.

### 3. Project MDX pages

Each file in `content/projects/*.mdx` is a standalone project page.

Required frontmatter fields:

- `title`
- `summary`
- `date`

Common optional fields:

- `tags`
- `cover`
- `video`
- `links`
- `featured`
- `order`

Example:

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

Project detail content goes here.

<ProjectVideo url="https://example.com/navigation-demo.mp4" title="Navigation Demo" />
```

Allowed MDX components in project pages:

- `LinkButton`
- `ProjectGallery`
- `ProjectVideo`
- `ResearchFigure`

Project MDX files must not declare `import` or `export` statements. That keeps the component surface narrow and predictable.

## URL and Base-Path Rules

This site is built to work on both:

- a user site such as `https://username.github.io`
- a project site such as `https://username.github.io/repo-name`

Internal links and public assets are normalized through the site base path.
That means URLs like `/images/avatar.svg`, `/projects/`, and similar paths are safe to keep in content files.

External links are not rewritten.

## Homepage Behavior

The homepage renders sections from `content/site/homepage.md`.

The current first-version structure includes:

- sidebar profile card
- navigation bar
- about section
- featured projects
- education timeline
- publications
- awards
- notes link card

## Deployment Flow

```text
GitBook edit
-> Git Sync to GitHub
-> GitHub Actions runs Astro build
-> GitHub Pages deploys the generated `dist/`
```

## Troubleshooting

- If images or links work locally but fail on GitHub Pages, check `BASE_PATH`.
- If a GitBook edit breaks the build, the content schema or section validator is doing its job. Fix the frontmatter rather than weakening the validator.
- If you add new project MDX syntax and the build fails, check whether the file introduced an `import` or `export` statement.

## Repository Layout

```text
.github/workflows/deploy.yml
content/
public/
src/
```

The implementation is intentionally small and content-driven so it can later be turned into a reusable template if needed.
