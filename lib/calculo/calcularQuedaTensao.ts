import { resistencia } from "@/data/resistencia";
import { type CalculationInput } from "@/types/eletrica";
import {
  type CableCombination,
  listarCombinacoes,
} from "./combinacoes";

export function selecionarCombinacaoPorQueda(
  input: CalculationInput,
  correnteProjeto: number
): CableCombination | null {
  const limite = input.quedaMaximaPercentual;

  for (const combinacao of listarCombinacoes(input)) {
    const quedaPercentual = calcularQuedaPercentual(
      input,
      correnteProjeto,
      combinacao.secao,
      combinacao.quantidadeCabos
    );
    if (quedaPercentual === null) continue;
    if (quedaPercentual <= limite) return combinacao;
  }
  return null;
}

export function selecionarSecaoPorQueda(
  input: CalculationInput,
  correnteProjeto: number
): number | null {
  return selecionarCombinacaoPorQueda(input, correnteProjeto)?.secao ?? null;
}

export function calcularQuedaPercentual(
  input: CalculationInput,
  correnteProjeto: number,
  secao: number,
  quantidadeCabos = 1
): number | null {
  const rKm = resistencia[String(secao)];
  if (!rKm || !Number.isFinite(rKm)) return null;
  if (!Number.isInteger(quantidadeCabos) || quantidadeCabos < 1) return null;
  if (quantidadeCabos > 1 && secao < 50) return null;
  const rMetro = rKm / 1000 / quantidadeCabos;

  const deltaV =
    input.sistema === "monofasico"
      ? 2 * input.comprimento * correnteProjeto * rMetro
      : Math.sqrt(3) * input.comprimento * correnteProjeto * rMetro;

  return (deltaV / input.tensao) * 100;
}
