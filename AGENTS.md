# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 14 App Router project for electrical cable sizing. Route entry points live in `app/`: `page.tsx` renders the main UI, `layout.tsx` defines metadata and shell, and `globals.css` contains Tailwind/global styles. Reusable UI belongs in `components/`, with components named in PascalCase.

Calculation logic is isolated under `lib/calculo/` as pure TypeScript functions. Static lookup tables live in `data/`, and shared domain types live in `types/eletrica.ts`. Keep business rules out of React components; update calculation functions and data tables first, then wire them into UI.

## Build, Test, and Development Commands

Use pnpm because `pnpm-lock.yaml` is committed.

- `pnpm install`: install dependencies.
- `pnpm dev`: start the local development server at `http://localhost:3000`.
- `pnpm build`: create a production Next.js build and run type checks.
- `pnpm start`: serve the production build after `pnpm build`.
- `pnpm lint`: run Next.js ESLint rules.

## Coding Style & Naming Conventions

Write TypeScript for `strict` mode. Prefer explicit domain types from `types/eletrica.ts` for electrical inputs, outputs, and table rows. Use PascalCase for React components, camelCase for functions and variables, and descriptive Portuguese names where the domain already uses them, such as `calcularCorrente` or `selecionarSecao`.

Follow the existing style: two-space indentation, semicolons, single-purpose functions, and Tailwind utility classes. Import project files with the `@/` alias when it improves readability.

## Testing Guidelines

No automated test framework is currently configured. Before submitting changes, run `pnpm lint` and `pnpm build`. For calculation changes, manually verify representative inputs in the UI and list checked cases in the PR description.

When adding tests, prioritize `lib/calculo/`. Name tests after the function under test, for example `calcularCorrente.test.ts`, and cover normal cases, boundary values, and unsupported combinations.

## Commit & Pull Request Guidelines

This workspace does not include Git history, so use clear, imperative commit messages such as `Add voltage drop validation` or `Update ampacity table`. Keep commits focused.

Pull requests should include a summary, the reason for the change, screenshots for UI updates, and verification commands. Link related issues when available. For electrical sizing rule changes, mention the affected criterion, table, or calculation path.

## Security & Configuration Tips

The app has no backend, database, or required environment variables. Do not commit generated folders such as `.next/` or `node_modules/`. Treat calculation tables as source data: review changes carefully and avoid silent unit or standard changes without documenting them.
