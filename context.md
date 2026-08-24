# HSC Biology — Engineering Context

> Read this file before modifying any code in this repository.

## What This Is

A **static client-side** React 18 + Vite 5 + React Router 6 web app for Bangladeshi HSC (XI–XII) Biology students. Pure frontend — no backend, no API, no database. All data is hardcoded in `src/data/chapters.js`. Built for zero budget.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18.3.1 |
| Bundler | Vite 5.4.21 |
| Routing | React Router DOM 6.30.6 |
| Styling | Plain CSS with design tokens (`src/styles/index.css`) |
| State | React `useState` + `localStorage` |
| 3D | Not installed (planned: React Three Fiber + GLB) |
| Backend | None (planned: Supabase) |
| Tests | None |
| TypeScript | None |

## Project Structure

```
src/
  main.jsx              # ReactDOM root, BrowserRouter, ThemeProvider
  App.jsx               # All routes defined here
  data/chapters.js      # Single data source — 24 chapter objects, exported functions
  context/ThemeContext.jsx   # Light/dark theme via localStorage
  hooks/useTheme.js     # Convenience hook for ThemeContext
  styles/index.css      # Design tokens, resets, animations
  pages/                # 7 page components
  components/
    layout/             # Layout, Header, Sidebar, Footer, ThemeToggle
    chapter/            # ChapterCard, NotesSection, VisualizationsSection, VisualizationCard
    common/             # Badge, Breadcrumbs, EmptyState, SectionHeading
```

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | HomePage | Dashboard with stats, filter tabs, chapter grid |
| `/paper/1` | PaperPage | Paper 1 chapter catalog |
| `/paper/2` | PaperPage | Paper 2 chapter catalog |
| `/chapter/:chapterSlug` | ChapterPage | Single chapter: notes + visualizations |
| `/chapter/:chapterSlug/visualization/:visualizationId` | VisualizationDetailPage | Single visualization detail |
| `/explore-3d` | ExplorePage | 3D visual gallery (placeholder) |
| `/animations` | AnimationsPage | Animation gallery (placeholder) |
| `*` | NotFoundPage | 404 |

## Data Model

`src/data/chapters.js` exports:

- `CHAPTERS` — array of 24 objects (12 Paper 1 + 12 Paper 2)
- `chaptersByPaper(paper)` — filter by paper string
- `getChapterBySlug(slug)` — find by slug
- `getVisualization(slug, visualizationId)` — find visualization within chapter

Each chapter object has: `slug`, `paper`, `code`, `accent`, `title`, `description`, `notes` (placeholder), `visualizations` (always 2, placeholder).

**Currently absent from data model:** topics, lessons, questions, 3D model references, real note content.

## Unicode / Paper Filtering — Verified Fact

**The previously suspected Unicode mismatch between Paper 1 and Paper 2 is NOT confirmed.**

Binary analysis of the source files proves:

- `chapters.js` uses `U+09E8 U+09AF U+09BC U+0020 U+09AA U+09A4 U+09CD U+09B0` for `২য় পত্র` (decomposed `য়` = U+09AF + U+09BC)
- `PaperPage.jsx` constructs the **identical** codepoints
- `HomePage.jsx` filter tabs use the **identical** codepoints
- `Sidebar.jsx` nav labels use the **identical** codepoints
- Node.js simulation: `chaptersByPaper('১ম পত্র')` → 12, `chaptersByPaper('২য় পত্র')` → 12

**Do not change paper filtering logic unless a reproducible browser-level bug is demonstrated.** If the Paper 2 UI shows 0 chapters in the browser, the issue is elsewhere (routing, rendering, caching) — not in the data or filter function.

## Planned Architecture

```
Paper → Chapter → Topic → Lesson → Notes → Explore/3D → Questions → Progress
```

## MVP Scope

- **3D models:** Heart, Nephron, Grasshopper (optional: Eye)
- **Content:** Short notes per chapter
- **Assessment:** 5–10 MCQs per chapter
- **Features:** Basic revision loop
- **Auth:** None (no forced login)
- **Budget:** Zero

## UI Direction

- Calm, academic, trustworthy, education-first
- Mobile-first responsive design
- Not cyberpunk, not neon, not flashy
- Bengali-first with English technical terms where natural

## Future 3D Guidelines

- Use **React Three Fiber** + `@react-three/drei`
- Load **GLB format** models
- **Only properly licensed assets** — no pirated 3D models
- Mount inside the existing `.viz-detail__stage` slot in `VisualizationDetailPage.jsx`

## Future Backend

- **Supabase** is the planned backend (auth, database, storage)
- No backend work until explicitly planned and approved

## Development Rules

1. **Read `context.md`** (this file) before modifying code
2. **One narrowly scoped change at a time** — do not batch unrelated changes
3. **Inspect before changing** — read the file, understand the code, then edit
4. **Never perform broad refactors** unless explicitly requested
5. **Never migrate frameworks** (e.g., CSS modules, Tailwind, TypeScript migration) without approval
6. **Never install dependencies** unless required by the current task
7. **Never change unrelated files** — stay within scope of the request
8. **Never invent missing architecture** — if something doesn't exist, note it; don't fabricate it
9. **Test the change** before considering it done (run `npm run build` at minimum)
10. **Report assumptions** — if you must assume something, state it explicitly; do not silently guess

## Known Issues

| # | Issue | Status |
|---|---|---|
| 1 | **Paper 1/2 UI behavior:** Some reports suggest `/paper/2` shows 0 chapters in-browser. Source code analysis shows the data and filter are correct. **Needs browser-level reproduction** to identify the actual cause. | Open — unconfirmed |
| 2 | **UI needs redesign.** Current layout uses a mobile-only sidebar pattern on desktop, inconsistent card components across pages, and hardcoded header padding. | Open |
| 3 | **Mobile UX needs improvement.** Touch targets too small on filter tabs/theme toggle, viz stage fixed at 420px min-height on small screens, Bengali micro-text may be illegible. | Open |
| 4 | **Content is placeholder-heavy.** All 24 chapters have identical placeholder notes, visualization statuses (`শিগগিরই`), and summaries. No real educational content exists yet. | Open |
| 5 | **No 3D architecture.** Three.js / React Three Fiber not installed. No GLB files. No viewer component. The `.viz-detail__stage` slot is prepared but empty. | Open |
| 6 | **No quiz/question system.** No question data model, no quiz UI, no state management for Q&A. | Open |
| 7 | **No topic/lesson hierarchy.** Chapters are flat — no nesting for topics or lessons. | Open |
| 8 | **No tests.** Zero test files, no test runner, no `test` script in `package.json`. | Open |
| 9 | **Dead CSS.** `.site-header__search` styles exist in `Header.css` but no search element is rendered. | Open |
| 10 | **No error boundaries.** Runtime errors crash the entire app. | Open |
