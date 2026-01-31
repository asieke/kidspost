# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KidsPost is a SvelteKit web app that generates AI-powered, kid-friendly newspapers using Google's Gemini API. Users provide their own Google API key (BYOK), select a grade level (1-5), and the app generates a 2-page newspaper with 10 articles and AI-generated illustrations. Generated newspapers are saved client-side in IndexedDB via Dexie.

## Commands

- `bun run dev` — Start dev server
- `bun run build` — Production build (uses Vercel adapter)
- `bun run preview` — Preview production build
- `bun run check` — Svelte type checking
- `bun run lint` — Prettier + ESLint check
- `bun run format` — Auto-format with Prettier

No test framework is configured.

## Architecture

### Tech Stack

- **Svelte 5** with runes (`$state`, `$derived`, `$effect`) — NOT Svelte 4 syntax
- **SvelteKit** with file-based routing, deployed to **Vercel**
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Dexie** (IndexedDB) for client-side persistence
- **Google Generative AI SDK** (`@google/genai`) for Gemini API calls
- **Bun** as the package manager

### Data Flow

1. Client POSTs to `/api/generate` with `gradeLevel` and `apiKey`
2. Server calls Gemini Flash with Google Search grounding to find real current news
3. Server reformats news into kid-friendly JSON (10 articles: 2 featured, 8 regular)
4. Server generates 10 cartoon illustrations in parallel via Gemini Pro Image
5. Client receives `NewspaperData`, compresses images, and saves to IndexedDB

### Key Types (`src/lib/types.ts`)

- `Article` — Has `page` (1|2), `position` (1-5), `featured`, `borderColor`, `headlineColor`, and `images`
- `NewspaperData` — Contains `title`, `subtitle`, `dateRange`, and `articles[]`

### Layout System

Each newspaper is 2 pages with a 5-position grid per page. Position 2 is always the featured article (spans 2 rows). The layout uses a 2-column CSS grid on desktop/print and switches to a vertical card stack on mobile (< 900px breakpoint). Print styles in `layout.css` target letter-size pages (8.5" x 11").

### Database (`src/lib/db.ts`)

Two Dexie tables:
- `newspapers` — Saved newspapers with `id`, `timestamp`, `gradeLevel`, `data`. Auto-limited to 50 entries.
- `settings` — Key-value store. Currently stores the Google API key.

### Fonts

Custom fonts loaded in `app.html`: **Bangers** (headlines) and **Comic Neue** (body text).

## Svelte MCP Tools

You have access to the Svelte MCP server with these tools:

1. **list-sections** — Use FIRST to discover available Svelte 5/SvelteKit documentation sections
2. **get-documentation** — Fetch full docs for relevant sections (analyze `use_cases` field to pick sections)
3. **svelte-autofixer** — MUST run on all Svelte code before sending to user; iterate until no issues
4. **playground-link** — Generate Svelte Playground links (ask user first; never use if code was written to project files)
