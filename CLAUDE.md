# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build
npm run lint     # ESLint check (eslint-config-next, core-web-vitals + typescript)
npm run start    # Start production server
```

No test runner is configured. There is no single-test command.

## Architecture

**Lingoura AI** is a frontend-only AI-powered English fluency platform (IELTS prep focus). All data is currently hardcoded mock data — no backend API integration exists yet.

### Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS 4** via `@tailwindcss/postcss` — no `tailwind.config.js`; config is in `postcss.config.mjs`
- **Framer Motion 12** for animations
- **Radix UI** primitives (Dialog, DropdownMenu, Tabs, Progress, ScrollArea, Avatar, Separator, Slot)
- **next-themes** for dark/light mode (class strategy)
- Path alias: `@/*` → `./src/*`

### Routing & Layout

```
src/app/
  layout.tsx              # Root layout (fonts: Manrope, Lexend, Libre Baskerville)
  page.tsx                # Landing page (independent dark mode)
  (dashboard)/            # Route group — shares DashboardLayout
    layout.tsx            # Sidebar + Header shell
    dashboard/page.tsx    # Main dashboard
    ...                   # Other protected pages
  auth/                   # Login, onboarding
  case-studies/           # Case study pages
```

The `(dashboard)` route group wraps all protected pages in a shared layout with a collapsible sidebar. Sidebar pin state is persisted to `localStorage`.

### Component Patterns

- **`"use client"`** is required on any component using `useState`, `useEffect`, Framer Motion, or event handlers. Pages are Server Components by default.
- **Animations**: Sidebar expand/collapse uses `duration: 0.7s`; card entrances use staggered delays (`i * 0.1`). Always use `motion.*` variants rather than raw CSS transitions for interactive elements.
- **Styling**: Use `cn()` (from `@/lib/utils`, wraps `clsx` + `tailwind-merge`) for conditional class merging. Glassmorphism (`backdrop-blur-2xl`) is the sidebar background style.
- **Theming**: CSS custom properties (`--surface`, `--on-surface`, `--outline-variant`) drive the color system; Tailwind `dark:` classes layer on top.

### Data

All stats, CEFR scores, activity charts, and test history are defined as inline constants within their components. When integrating a real API, replace these constants with data fetched in Server Components (or via SWR/React Query in Client Components).
