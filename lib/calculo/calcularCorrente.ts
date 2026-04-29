import type { CalculationInput } from "@/types/eletrica";

export function calcularCorrenteProjeto(input: CalculationInput): number {
  if (input.modo === "corrente") {
    if (!input.corrente || input.corrente <= 0) {
      throw new Error("Corrente inválida");
    }
    return input.corrente;
  }

  const p = input.potenciaKw;
  const fp = input.fatorPotencia;
  if (!p || p <= 0) throw new Error("Potência inválida");
  if (!fp || fp <= 0 || fp > 1) throw new Error("Fator de potência inválido");
  if (!input.tensao || input.tensao <= 0) throw new Error("Tensão inválida");

  if (input.sistema === "monofasico") {
    return (p * 1000) / (input.tensao * fp);
  }
  return (p * 1000) / (Math.sqrt(3) * input.tensao * fp);
}
