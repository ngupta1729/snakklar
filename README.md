# Snakklar — Norwegian Language Coach

Practice Norwegian in realistic scenarios with immersive roleplay and strict, high-quality feedback on grammar, vocabulary, and tone.

## What it does

You describe a scenario (e.g. ordering coffee, checking into a hotel), then chat in Norwegian. For every message you send, Snakklar returns two things simultaneously:

1. **Strict feedback** — corrections, a better alternative, a native phrasing, and an explanation
2. **Conversation reply** — the roleplay character continues the dialogue naturally

**Example:**

> **You:** "Jeg vil ha kaffe"
>
> **Feedback:**
> - Correction: *Jeg vil ha en kaffe*
> - Better alternative: *Kan jeg få en kaffe?*
> - Native version: *Kan jeg få en kaffe?*
> - Explanation: You missed the article 'en'.
>
> **Character reply:** *Selvfølgelig! Vil du ha melk eller sukker i kaffen din?*

## Tech stack

- **Frontend** — Vite + React 18 + TypeScript, Tailwind CSS + shadcn/ui
- **Backend** — Supabase Edge Function (`chat_handler`) orchestrates two parallel Claude API calls
- **LLM** — Anthropic Claude (`claude-sonnet-4-6`) for both feedback and conversation

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Install dependencies

```bash
cd react-base
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Deploy the edge function

```bash
supabase functions deploy chat_handler
```

Set the Anthropic key as a secret:

```bash
supabase secrets set ANTHROPIC_API_KEY=your-key-here
```

### 4. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## Project structure

```
react-base/          # Vite + React frontend
  src/
    pages/
      NorwegianCoach.tsx   # Main chat UI
    hooks/
      useNorwegianChat.ts  # Chat state + API calls
    lib/
      supabase.ts          # Supabase client
supabase/
  functions/
    chat_handler/          # Edge function — LLM orchestration
norwegian_language_prd.md  # Product requirements
norwegian_language_plan.md # Implementation plan
```

## Roadmap

This is **Phase 1** (MVP) — session state is in-memory only with no persistence.

| Phase | Feature |
|-------|---------|
| ✅ 1 | Scenario-based chat, strict feedback, roleplay replies |
| 2 | Adaptive memory — track recurring mistakes across sessions |
| 3 | Predefined scenarios, context-aware branching |
| 4 | Session summaries — top mistakes and improvement tips |
| 5 | Voice input/output, CEFR-level adaptive difficulty |
