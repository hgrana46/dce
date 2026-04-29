# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DCE (Dimensionamento de Cabos Elétricos) — a single-page Next.js MVP that sizes copper low-voltage cables using simplified NBR 5410 criteria (Brazilian standard). The product, UI copy, identifiers, and domain comments are in **Portuguese (pt-BR)**; preserve that language in new code and user-facing text.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`). There is no test runner configured.

```bash
pnpm install
pnpm dev      # Next.js dev server on :3000
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # next lint (no custom ESLint config)
```

The README claims Next 15 / React 19, but `package.json` pins **Next 14.2.18 / React 18.3.1** — trust the lockfile, not the README, when reasoning about available APIs.

## Architecture

The whole app fits into three layers, separated so the calculation engine stays portable and pure:

1. **`types/eletrica.ts`** — single source of truth for the domain. Defines `CalculationInput`, `CalculationResult`, the `InputMode | SystemType | InstallationType | InsulationType` unions, and the `SECOES_COMERCIAIS` array of standard cross-sections (1.5…300 mm²). The whole engine iterates over this array in ascending order.

2. **`data/`** — static reference tables, all keyed by stringified cross-section so they can be looked up uniformly:
   - `ampacidade.ts` — ampacity (A) per `[isolacao][instalacao][secao]`, plus `fatorAgrupamento` (grouping correction by number of circuits).
   - `fatoresTemperatura.ts` — ambient-temperature correction factors plus `obterFatorTemperatura`, which picks the **floor anchor point** (closest tabulated temp ≤ requested) for a conservative reading. Out-of-range temps clamp to the nearest endpoint.
   - `resistencia.ts` — copper resistance Ω/km at 70 °C.

   Values are simplified/didactic approximations of NBR 5410 — not normative. Don't tighten precision without a source.

3. **`lib/calculo/`** — pure functions, re-exported from `index.ts`. Pipeline:
   - `calcularCorrenteProjeto` — returns `I` directly when `modo="corrente"`, else derives it from `P, U, fp` using `P/(U·fp)` (mono) or `P/(√3·U·fp)` (tri).
   - `selecionarSecaoPorAmpacidade` — first `secao` whose `Iz_base · fTemp · fAgrup ≥ I_projeto`.
   - `selecionarSecaoPorQueda` — first `secao` whose `ΔV%` is within the limit, with `ΔV = 2·L·I·r` (mono) or `√3·L·I·r` (tri).
   - `calcular` (in `selecionarSecao.ts`) — orchestrates the two selectors and returns the **larger** of the two cross-sections, tagging which criterion was limiting (`ampacidade | queda | ambos`). Throws on validation or when no commercial section satisfies a criterion.

   Both selectors return `null` when nothing fits, and `calcular` translates that into a thrown error — keep this contract intact.

4. **UI** (`app/`, `components/`) — App Router. `app/page.tsx` is a single client component holding `FormState` (all numeric fields are kept as **strings** so partially-typed values don't blow up `Number()`). It calls `calcular` synchronously inside `useMemo`; errors are caught and surfaced as a generic message. There's no backend, no API route, no persistence. `CableSizingForm` and `CableSizingResult` are presentational.

## Conventions

- Path alias `@/*` resolves to the repo root (see `tsconfig.json`). Use it for cross-layer imports (`@/types/eletrica`, `@/data/...`, `@/lib/calculo`).
- Decimal commas: `app/page.tsx` normalizes `","` → `"."` before `Number()`. Preserve this in any new numeric input handler.
- `SECOES_COMERCIAIS` must stay sorted ascending — the selectors rely on first-match-wins iteration.
- Cross-section keys in data tables are stringified numbers (`"1.5"`, `"2.5"`, …) and must match the values in `SECOES_COMERCIAIS`.
- The footer disclaimer ("MVP didático…") is part of the product positioning — don't drop it when editing the page.
