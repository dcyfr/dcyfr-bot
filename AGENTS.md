# AGENTS.md - dcyfr-bot

## Project Overview

`dcyfr-bot-marketplace` is a Next.js 15 / React 19 site for the DCYFR bot marketplace.

## Architecture

- Routes and layouts: `app/`
- Shared UI: `components/`
- Reusable logic: `lib/`
- Static/content data: `data/`

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Working Rules

- Keep marketplace behavior and content aligned with the existing app structure.
- Favor minimal App Router changes over introducing new frameworks or patterns.
