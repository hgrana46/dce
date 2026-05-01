import { SECOES_COMERCIAIS, type CalculationInput } from "@/types/eletrica";

export interface CableCombination {
  secao: number;
  quantidadeCabos: number;
}

export function listarCombinacoes(input: CalculationInput): CableCombination[] {
  const maxCabos = input.cabosParalelos ?? 1;
  const combinacoes: CableCombination[] = [];

  for (let quantidadeCabos = 1; quantidadeCabos <= maxCabos; quantidadeCabos++) {
    for (const secao of SECOES_COMERCIAIS) {
      if (quantidadeCabos > 1 && secao < 50) continue;
      combinacoes.push({ secao, quantidadeCabos });
    }
  }

  return combinacoes;
}

export function areaTotal(combinacao: CableCombination): number {
  return combinacao.secao * combinacao.quantidadeCabos;
}

export function descreverCombinacao(combinacao: CableCombination): string {
  const secao = String(combinacao.secao).replace(".", ",");
  if (combinacao.quantidadeCabos === 1) return `${secao} mm²`;
  return `${combinacao.quantidadeCabos} × ${secao} mm² por fase`;
}
