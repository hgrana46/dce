import type { CalculationInput, PowerUnit } from "@/types/eletrica";

const UNIDADES_POTENCIA: PowerUnit[] = ["W", "kW", "kVA", "CV"];

export function converterPotenciaParaWatts(
  valor: number,
  unidade: PowerUnit
): number {
  if (unidade === "W") return valor;
  if (unidade === "kW") return valor * 1000;
  if (unidade === "kVA") return valor * 1000;
  return valor * 735.5;
}

function unidadePotenciaValida(unidade: unknown): unidade is PowerUnit {
  return UNIDADES_POTENCIA.includes(unidade as PowerUnit);
}

export function calcularCorrenteProjeto(input: CalculationInput): number {
  if (input.modo === "corrente") {
    if (!input.corrente || input.corrente <= 0) {
      throw new Error("Corrente inválida");
    }
    return input.corrente;
  }

  const p = input.potenciaKw;
  const unidadePotencia = input.unidadePotencia ?? "kW";
  const fp = input.fatorPotencia;
  if (!p || p <= 0) throw new Error("Potência inválida");
  if (!unidadePotenciaValida(unidadePotencia))
    throw new Error("Unidade de potência inválida");
  if (unidadePotencia !== "kVA" && (!fp || fp <= 0 || fp > 1)) {
    throw new Error("Fator de potência inválido");
  }
  if (!input.tensao || input.tensao <= 0) throw new Error("Tensão inválida");

  const potenciaWatts = converterPotenciaParaWatts(p, unidadePotencia);
  const divisorFatorPotencia = unidadePotencia === "kVA" ? 1 : fp ?? 1;

  if (input.sistema === "trifasico") {
    return potenciaWatts / (Math.sqrt(3) * input.tensao * divisorFatorPotencia);
  }
  if (input.sistema === "monofasico" || input.sistema === "bifasico") {
    return potenciaWatts / (input.tensao * divisorFatorPotencia);
  }

  throw new Error("Sistema inválido");
}
