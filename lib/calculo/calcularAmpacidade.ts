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
  const tabela = ampacidade[input.isolacao][input.instalacao];
  const fTemp = obterFatorTemperatura(input.isolacao, input.temperatura);
  const fAgrup = fatorAgrupamento[input.agrupamento];

  for (const secao of SECOES_COMERCIAIS) {
    const izBase = tabela[String(secao)];
    if (!izBase || !Number.isFinite(izBase)) continue;
    const izCorrigida = izBase * fTemp * fAgrup;
    if (izCorrigida >= correnteProjeto) return secao;
  }
  return null;
}
