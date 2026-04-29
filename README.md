# DCE — Dimensionamento de Cabos Elétricos

MVP web para dimensionamento de cabos de cobre em baixa tensão, usando critérios simplificados inspirados na NBR 5410 (ampacidade + queda de tensão).

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript, Tailwind CSS
- Pronto para deploy na Vercel

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

## Deploy

```bash
vercel
```

Sem variáveis de ambiente, sem backend, sem banco de dados.

## Estrutura

```
app/                Next.js App Router (page + layout)
components/         UI (formulário, resultado)
lib/calculo/        Motor de cálculo (funções puras)
data/               Tabelas (ampacidade, fatores, resistência)
types/              Tipagem TypeScript
```

> Didático. Não substitui projeto elétrico assinado por profissional habilitado.
