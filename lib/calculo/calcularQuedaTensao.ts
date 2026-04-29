import { resistencia } from "@/data/resistencia";
import {
  SECOES_COMERCIAIS,
  type CalculationInput,
} from "@/types/eletrica";

export function selecionarSecaoPorQueda(
  input: CalculationInput,
  correnteProjeto: number
): number | null {
  const limite = input.quedaMaximaPercentual;

  for (const secao of SECOES_COMERCIAIS) {
    const rKm = resistencia[String(secao)];
    if (!rKm || !Number.isFinite(rKm)) continue;
    const rMetro = rKm / 1000;

    const deltaV =
      input.sistema === "monofasico"
        ? 2 * input.comprimento * correnteProjeto * rMetro
        : Math.sqrt(3) * input.comprimento * correnteProjeto * rMetro;

    const quedaPercentual = (deltaV / input.tensao) * 100;
    if (quedaPercentual <= limite) return secao;
  }
  return null;
}
