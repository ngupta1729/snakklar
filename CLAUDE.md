# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo contains two things:
- `react-base/` — a Vite + React + TypeScript frontend (the active codebase)
- `norwegian_language_prd.md` / `norwegian_language_plan.md` — product specs for a Norwegian Language Coach app to be built on top of this base

The current `Index.tsx` is a personal portfolio page for Rajesh P. The Norwegian Language Coach is the next feature to build.

## Commands (run from `react-base/`)

```bash
npm run dev          # Start dev server
npm run build        # Type-check + build (tsc && vite build)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier over src/**
npm run type-check   # tsc --noEmit only
npm run test         # Vitest
npm run analyze      # Run scripts/projectAnalyzer.ts via tsx
```

## Architecture

### Stack
- **Vite + React 18 + TypeScript** — standard SPA
- **Tailwind CSS** with shadcn/ui (Radix UI primitives) — all UI components live in `src/components/ui/`
- **Framer Motion** — animations; `FADE_UP` + `STAGGER` variants are defined in `Index.tsx` and reused across sections
- **React Router v6** — single route `/` → `Index.tsx`; add new pages as routes in `App.tsx`
- **`cn()` utility** (`src/lib/utils.ts`) — combines `clsx` + `tailwind-merge`; use for all conditional class merging

### Norwegian Language Coach (planned, per PRD/plan)
- **Two LLM calls per user message**: one for strict feedback (grammar/vocabulary corrections), one for roleplay conversation reply
- **Orchestration via Supabase Edge Function** (`chat_handler`) — `@supabase/supabase-js` is already installed
- **Claude API** — `@anthropic-ai/sdk` is already installed; use `claude-sonnet-4-6` or `claude-opus-4-6`
- **Structured JSON response** from edge function: `{ feedback: { correction, better_alternative, native_version, explanation }, conversation_reply }`
- Phase 1 has no persistent memory — session state is in-memory only, 1-minute timeout

### Styling conventions
- Global background: `#F8F7F4`; primary text: `#111111`
- Font: `Plus Jakarta Sans` (loaded via Google Fonts inline `<style>` in page components)
- Bento-grid card pattern: `p-[3px]` gradient border wrapper → inner `rounded-[calc(2rem-3px)]` white/off-white card
- Violet (`violet-600`) is the accent color for interactive/primary elements
