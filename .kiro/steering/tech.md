# Tech Stack

## Runtime & Language
- **TypeScript** (~5.8) — used throughout frontend and backend
- **Node.js** — backend runtime

## Frontend
- **React 19** with JSX transform (`react-jsx`)
- **Vite 6** — dev server and bundler
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin (no `tailwind.config.js`; theme tokens defined in `src/index.css` using `@theme {}`)
- **GSAP 3.12** (`gsap`) — primary animation engine. All animations use GSAP. Do NOT use `motion/react` or `framer-motion`.
  - Plugins registered: `ScrollTrigger`, `ScrollToPlugin`, `TextPlugin`, `CustomEase`
  - Central setup: `src/lib/gsap.ts` — import `{ gsap, ScrollTrigger }` from there, not directly from `"gsap"`
  - Custom easings: `yutobia.enter`, `yutobia.exit`, `yutobia.reveal`, `yutobia.spring`, `yutobia.curtain`
- **Lucide React** — icon library

## Backend
- **Express 4** — REST API server (`server.ts`)
- **mysql2** — database driver for TiDB Cloud Serverless (MySQL-compatible)
- **tsx** — runs `server.ts` directly in dev mode
- **esbuild** — bundles `server.ts` for production

## Database
- **TiDB Cloud Serverless** (primary, optional) — MySQL-compatible cloud DB
- **Local JSON file fallback** (`local-data.json`) — used when TiDB is not configured; all API endpoints fall back gracefully

## External Services
- **Supabase** — referenced in `src/lib/supabase.ts` but the file actually wraps the internal Express REST API (not the Supabase SDK directly). The file name is legacy.
- **Google Gemini** (`@google/genai`) — available via `GEMINI_API_KEY`

## Fonts (loaded via Google Fonts)
- `Inter` — default sans (`--font-sans`)
- `Space Grotesk` — display/headings (`--font-display`)
- `Playfair Display` — serif/italic (`--font-serif`)
- `JetBrains Mono` — monospace (`--font-mono`)

## Path Aliases
- `@/` maps to the project root (e.g., `@/src/components/...`)

## Environment Variables
- `GEMINI_API_KEY` — Gemini AI API key
- `APP_URL` — hosted app URL
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — optional legacy Supabase keys
- `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE` — TiDB Cloud credentials

## Common Commands

```bash
# Install dependencies
npm install

# Start dev server (Express + Vite middleware on port 3000)
npm run dev

# Type-check only (no emit)
npm run lint

# Production build (Vite frontend + esbuild server bundle)
npm run build

# Run production server
npm start

# Clean dist output
npm run clean
```

> Dev server runs on **http://localhost:3000** — both the Express API and Vite frontend are served from the same port via Vite middleware mode.
