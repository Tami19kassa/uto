# Project Structure

## Root
```
Youtopia-main/
├── server.ts          # Express backend — all API routes + Vite middleware
├── index.html         # Vite HTML entry point
├── vite.config.ts     # Vite config (React + Tailwind plugins, @ alias)
├── tsconfig.json      # TypeScript config
├── package.json
├── local-data.json    # Local JSON database fallback (auto-created at runtime)
├── .env.example       # Environment variable reference
└── src/
```

## Frontend Source (`src/`)
```
src/
├── main.tsx           # React entry — mounts <App /> into #root
├── App.tsx            # Root component — layout, state, section orchestration
├── index.css          # Global styles, Tailwind @theme tokens, dark mode overrides
├── types.ts           # Shared TypeScript interfaces (MediaItem, Riddle, SocialAccount, etc.)
├── lib/
│   └── supabase.ts    # API client layer — all fetch() calls to Express endpoints
└── components/        # One file per UI component (no subdirectories)
    ├── HugeHeader.tsx          # Sticky navigation header
    ├── HugeHero.tsx            # Hero section with background video
    ├── EcosystemSection.tsx    # Five sub-brands showcase
    ├── StoryScrollJourney.tsx  # Narrative scroll section
    ├── EnqoqCashDemo.tsx       # Playable trivia game demo
    ├── StudioShowcase.tsx      # Studio/sub-brand showcase
    ├── VisionSection.tsx       # Vision forward section
    ├── MediaHub.tsx            # Blog/vlog media grid
    ├── HugeFooter.tsx          # Contact/footer with social links
    ├── AdminPanel.tsx          # Admin control panel modal
    ├── CookieBanner.tsx        # Cookie consent banner
    ├── GlobalBackground.tsx    # Full-page background effects
    ├── SectionBackground.tsx   # Per-section background variants
    ├── ThreeDScrollWrapper.tsx # Scroll-driven 3D perspective wrapper (used in App.tsx)
    ├── ScrollRotatingLogo.tsx  # Scroll-animated logo element
    ├── Reveal.tsx              # Generic scroll reveal wrapper
    ├── InteractiveYutobiaStage.tsx # Interactive stage component
    └── YutobiaLogo.tsx         # SVG logo components
```

## Key Architectural Patterns

### Page Layout
`App.tsx` is the single root. Each major section is wrapped in `<ThreeDScrollWrapper id="section-name">` which applies scroll-driven `rotateX`, `scale`, and `opacity` transforms. Section IDs are used for scroll navigation (`handleNavigate`).

### Data Flow
- All data fetching goes through `src/lib/supabase.ts` (the API client)
- The client calls Express REST endpoints (`/api/*`) defined in `server.ts`
- `server.ts` tries TiDB Cloud first, falls back to `local-data.json`
- `App.tsx` holds top-level state (`mediaItems`, `socials`, `heroVideoUrl`) and passes data down as props

### Styling Conventions
- Tailwind CSS v4 utility classes throughout — no CSS modules
- Theme tokens (colors, fonts) defined in `src/index.css` under `@theme {}`
- Brand color: `text-brand`, `bg-brand`, `border-brand` (resolves to `#FF1E27`)
- Dark mode via `.dark` class on `<html>` (toggled in `App.tsx`, persisted in `localStorage`)
- Dark mode overrides for light-named classes are in `src/index.css` `@layer base`
- Font utilities: `font-sans`, `font-display`, `font-serif`, `font-mono`

### Animation
- All animations use **GSAP 3.12** — never use `motion/react` or `framer-motion`
- Import `{ gsap, ScrollTrigger }` from `"../lib/gsap"` (not directly from `"gsap"`) — plugins are pre-registered there
- Custom brand easings available: `yutobia.enter`, `yutobia.exit`, `yutobia.reveal`, `yutobia.spring`, `yutobia.curtain`
- Scroll-driven animations use `ScrollTrigger` with `scrub` for parallax, `toggleActions` for one-shot reveals
- Always wrap GSAP logic in `gsap.context()` and call `ctx.revert()` in the cleanup to prevent memory leaks
- Use `useLayoutEffect` (not `useEffect`) for GSAP animations that measure DOM on mount
- Avoid `translateY` in scroll animations — use `rotateX`/`scale`/`opacity` only to prevent phantom scroll overflow
- Shared animation helpers in `src/lib/gsap.ts`: `animFadeUp`, `animStagger`, `animCharsSpring`, `animClipReveal`, `animCardIn`, `animLineDraw`

### Component Conventions
- All components are functional React components with TypeScript
- Props interfaces defined inline or above the component
- `React.FC<Props>` typing used on named exports; default exports also provided
- No routing library — navigation is scroll-based via `element.scrollIntoView()`
