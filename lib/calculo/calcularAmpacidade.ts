import { ampacidade, fatorAgrupamento } from "@/data/ampacidade";
import { obterFatorTemperatura } from "@/data/fatoresTemperatura";
import {
  SECOES_COMERCIAIS,
  type CalculationInput,
} from "@/types/eletrica";

export function selecionarSecaoPorAmpacidade(
  input: CalculationInput,
  correnteProjeto: number
): number | null {
  for (const secao of SECOES_COMERCIAIS) {
    const izCorrigida = calcularAmpacidadeCorrigida(input, secao);
    if (izCorrigida === null) continue;
    if (izCorrigida >= correnteProjeto) return secao;
  }
  return null;
}

export function calcularAmpacidadeCorrigida(
  input: CalculationInput,
  secao: number
): number | null {
  const tabela = ampacidade[input.isolacao][input.instalacao];
  const izBase = tabela[String(secao)];
  if (!izBase || !Number.isFinite(izBase)) return null;

  const fTemp = obterFatorTemperatura(input.isolacao, input.temperatura);
  const fAgrup = fatorAgrupamento[input.agrupamento];

  return izBase * fTemp * fAgrup;
}
