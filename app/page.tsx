"use client";

import { useMemo, useState } from "react";
import CableSizingForm, {
  type FormState,
  estadoInicial,
} from "@/components/CableSizingForm";
import CableSizingResult from "@/components/CableSizingResult";
import { calcular } from "@/lib/calculo";
import type { CalculationInput, CalculationResult } from "@/types/eletrica";

type Computed =
  | { status: "inicial" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; resultado: CalculationResult };

function formToInput(f: FormState): CalculationInput | null {
  const toNum = (v: string) => {
    const n = Number(String(v).trim().replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  const tensao = toNum(f.tensao);
  const comprimento = toNum(f.comprimento);
  const temperatura = toNum(f.temperatura);
  const corrente = toNum(f.corrente);
  const potenciaKw = toNum(f.potenciaKw);
  const fatorPotencia = toNum(f.fatorPotencia);

  const essenciais = [tensao, comprimento, temperatura];
  if (essenciais.some((n) => !Number.isFinite(n))) return null;

  return {
    modo: f.modo,
    corrente: Number.isFinite(corrente) ? corrente : undefined,
    potenciaKw: Number.isFinite(potenciaKw) ? potenciaKw : undefined,
    unidadePotencia: f.unidadePotencia,
    fatorPotencia: Number.isFinite(fatorPotencia) ? fatorPotencia : undefined,
    sistema: f.sistema,
    tensao,
    comprimento,
    cabosParalelos: f.cabosParalelos,
    quedaMaximaPercentual: f.quedaMaximaPercentual,
    instalacao: f.instalacao,
    isolacao: f.isolacao,
    temperatura,
    agrupamento: f.agrupamento,
  };
}

function temEntradaSuficiente(f: FormState): boolean {
  if (!f.tensao || !f.comprimento || !f.temperatura) return false;
  if (f.modo === "corrente") return !!f.corrente;
  return !!f.potenciaKw && !!f.fatorPotencia;
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>(estadoInicial);

  const computed: Computed = useMemo(() => {
    if (!temEntradaSuficiente(form)) return { status: "inicial" };
    const input = formToInput(form);
    if (!input) return { status: "erro", mensagem: "Verifique os dados informados" };
    try {
      const resultado = calcular(input);
      return { status: "ok", resultado };
    } catch (error) {
      return {
        status: "erro",
        mensagem:
          error instanceof Error ? error.message : "Verifique os dados informados",
      };
    }
  }, [form]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dimensionamento de Cabos Elétricos
        </h1>
        <p className="text-sm text-slate-600">
          Cobre, baixa tensão — critério NBR 5410 (versão simplificada).
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <CableSizingForm
            value={form}
            onChange={setForm}
            onReset={() => setForm(estadoInicial)}
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <CableSizingResult computed={computed} />
        </section>
      </div>

      <footer className="mt-10 text-xs text-slate-500">
        MVP didático. Não substitui projeto elétrico assinado por profissional habilitado.
      </footer>
    </main>
  );
}
