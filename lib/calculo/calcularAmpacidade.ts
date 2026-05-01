import { ampacidade, fatorAgrupamento } from "@/data/ampacidade";
import { obterFatorTemperatura } from "@/data/fatoresTemperatura";
import { type CalculationInput } from "@/types/eletrica";
import {
  type CableCombination,
  listarCombinacoes,
} from "./combinacoes";

export function selecionarCombinacaoPorAmpacidade(
  input: CalculationInput,
  correnteProjeto: number
): CableCombination | null {
  for (const combinacao of listarCombinacoes(input)) {
    const izTotal = calcularAmpacidadeCorrigida(
      input,
      combinacao.secao,
      combinacao.quantidadeCabos
    );
    if (izTotal === null) continue;
    if (izTotal >= correnteProjeto) return combinacao;
  }
  return null;
}

export function selecionarSecaoPorAmpacidade(
  input: CalculationInput,
  correnteProjeto: number
): number | null {
  return selecionarCombinacaoPorAmpacidade(input, correnteProjeto)?.secao ?? null;
}

export function calcularAmpacidadeCorrigida(
  input: CalculationInput,
  secao: number,
  quantidadeCabos = 1
): number | null {
  const tabela = ampacidade[input.isolacao][input.instalacao];
  const izBase = tabela[String(secao)];
  if (!izBase || !Number.isFinite(izBase)) return null;

  const fTemp = obterFatorTemperatura(input.isolacao, input.temperatura);
  const fAgrup = fatorAgrupamento[input.agrupamento];
  if (!Number.isInteger(quantidadeCabos) || quantidadeCabos < 1) return null;
  if (quantidadeCabos > 1 && secao < 50) return null;

  return izBase * fTemp * fAgrup * quantidadeCabos;
}
