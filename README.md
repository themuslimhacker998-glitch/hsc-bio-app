# Specimen — HSC Biology

A modular, future-ready structure and UI for an HSC Biology learning app. This
commit is **structure and design only** — no notes content or 3D
visualizations yet. Those slot in later without touching routing or layout.

## Stack

- React 18 + Vite 5
- React Router v6
- Plain CSS with design tokens (no UI framework/Tailwind) — see
  `src/styles/index.css`

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Push to GitHub

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial structure and UI for Specimen HSC Biology app"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## Project structure

```
src/
├── main.jsx                 # React root, router + theme provider
├── App.jsx                  # Route definitions only
├── data/
│   └── chapters.js          # All chapter + placeholder viz data (no UI here)
├── context/ThemeContext.jsx # Light/dark theme provider
├── hooks/useTheme.js
├── components/
│   ├── layout/               # Header, Footer, Layout, ThemeToggle
│   ├── chapter/               # ChapterCard, NotesSection,
│   │                            VisualizationsSection, VisualizationCard
│   └── common/                # Badge, SectionHeading, EmptyState, Breadcrumbs
├── pages/                    # HomePage, ChapterPage,
│                                VisualizationDetailPage, NotFoundPage
└── styles/index.css          # Design tokens, resets, animations
```

## Adding content later

- **Notes**: fill in a chapter's `notes` field in `src/data/chapters.js`, then
  branch on it inside `NotesSection.jsx` (the `hasNotes` check is already
  there).
- **3D visualizations**: install `three` and `@react-three/fiber`, then mount
  your `<Canvas>` inside `VisualizationDetailPage.jsx`'s
  `.viz-detail__stage` — it's already sized and styled as a reserved slot.
- **Search / bookmarks / progress / premium**: the header search input and
  card footer badges are already in place as disabled placeholders — wire up
  real state and remove the `disabled`/placeholder text when ready.

## Notes on this build

Every file here was syntax-checked with esbuild, but `npm install` /
`npm run dev` could not be run in the environment this was built in (no
network access), so please run those two commands yourself as the final
check. If anything errors, share the output and it can be fixed quickly.
