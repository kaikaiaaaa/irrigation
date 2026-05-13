# GSD Workflow Guide

## Project: 放心灌 Web版

This file contains agent instructions for the GSD (Get Shit Done) workflow.

## Workflow Commands

- `/gsd-discuss-phase N` — Gather context for phase N
- `/gsd-plan-phase N` — Create detailed plan for phase N
- `/gsd-execute-phase N` — Execute phase N
- `/gsd-verify-work N` — Verify phase N completion
- `/gsd-progress` — Check project progress
- `/gsd-stats` — Display project statistics

## Project Context

- **Type:** Web application (React + Vite + TypeScript)
- **Domain:** Smart irrigation assistant
- **Storage:** LocalStorage only (no backend)
- **Target users:** Farmers and irrigation managers
- **Language:** Chinese (UI), English (code)

## Key Decisions

1. **No backend** — All data in LocalStorage
2. **Open-Meteo API** — Free weather data, no API key needed
3. **Rule-based recommendations** — Simple weather rules for v1
4. **Responsive design** — Mobile-first, works on phone and desktop
5. **Interactive mode** — Confirm at each step

## Code Style

- TypeScript strict mode
- Functional React components with hooks
- Tailwind CSS for styling
- Zustand for state management
- Chinese UI labels, English code comments

## Testing

- Manual testing on mobile and desktop
- Test weather API failure scenarios
- Test LocalStorage quota exceeded

## Deployment

- Static hosting (GitHub Pages / Vercel / Netlify)
- Build: `npm run build`
- No server-side requirements
