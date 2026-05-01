"use client";

import type { CalculationResult } from "@/types/eletrica";

type Computed =
  | { status: "inicial" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; resultado: CalculationResult };

function rotuloCriterio(c: CalculationResult["criterioLimitante"]): string {
  if (c === "ampacidade") return "Ampacidade";
  if (c === "queda") return "Queda de tensão";
  return "Ambos";
}

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function formatarSecao(s: number): string {
  return `${numberFormatter.format(s)} mm²`;
}

function formatarCombinacao(secao: number, quantidadeCabos: number): string {
  if (quantidadeCabos === 1) return formatarSecao(secao);
  return `${quantidadeCabos} × ${formatarSecao(secao)} por fase`;
}

export default function CableSizingResult({ computed }: { computed: Computed }) {
  if (computed.status === "inicial") {
    return (
      <div className="flex h-full min-h-[16rem] items-center justify-center text-center text-slate-500">
        Preencha os dados para calcular
      </div>
    );
  }

  if (computed.status === "erro") {
    return (
      <div className="flex h-full min-h-[16rem] items-center justify-center text-center">
        <div>
          <p className="text-base font-medium text-red-700">
            {computed.mensagem}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Revise corrente/potência, tensão, comprimento e demais campos.
          </p>
        </div>
      </div>
    );
  }

  const r = computed.resultado;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Resultado</h2>

      <div className="rounded-lg bg-slate-900 p-5 text-white">
        <p className="text-xs uppercase tracking-wide text-slate-300">
          Seção recomendada
        </p>
        <p className="mt-1 text-4xl font-bold">{r.descricaoFinal}</p>
        <p className="mt-2 text-sm text-slate-300">
          Critério limitante:{" "}
          <span className="font-medium text-white">
            {rotuloCriterio(r.criterioLimitante)}
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs text-slate-500">Corrente de projeto</dt>
          <dd className="mt-0.5 font-medium">
            {numberFormatter.format(r.correnteProjeto)} A
          </dd>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs text-slate-500">Disjuntor recomendado</dt>
          <dd className="mt-0.5 font-medium">
            {numberFormatter.format(r.disjuntorRecomendado)} A
          </dd>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs text-slate-500">Ampacidade corrigida</dt>
          <dd className="mt-0.5 font-medium">
            {numberFormatter.format(r.ampacidadeFinal)} A
          </dd>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs text-slate-500">Por ampacidade</dt>
          <dd className="mt-0.5 font-medium">
            {formatarCombinacao(
              r.secaoAmpacidade,
              r.quantidadeCabosAmpacidade
            )}
          </dd>
        </div>
        <div className="rounded-md border border-slate-200 p-3">
          <dt className="text-xs text-slate-500">Por queda de tensão</dt>
          <dd className="mt-0.5 font-medium">
            {formatarCombinacao(r.secaoQueda, r.quantidadeCabosQueda)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
