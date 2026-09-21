# Publish Your Book — website

Marketing site for Publish Your Book, an independent book-publishing services
company. Next.js 16 · React 19 · Tailwind CSS v4 · GSAP · Lenis · TypeScript.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

## Documentation

| File | Read it for |
|---|---|
| [docs/PROJECT.md](docs/PROJECT.md) | The business, audience, goals, tone, deployment |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, file map, section order, layering |
| [docs/DESIGN.md](docs/DESIGN.md) | Colour, type, shape tokens; reference sites and what came from each |
| [docs/INTERACTIONS.md](docs/INTERACTIONS.md) | Loader, nav, footer reveal, tracks, hovers — how and why |
| [docs/CONVENTIONS.md](docs/CONVENTIONS.md) | Rules, known traps, verification checklist |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Open items, pending decisions, what is done |

AI coding agents: start with [AGENTS.md](AGENTS.md).

## Two rules

1. All copy lives in `src/lib/site.ts`.
2. All visual values live in `src/app/globals.css` (`@theme`).
