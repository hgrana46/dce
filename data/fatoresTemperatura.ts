import type { InsulationType, TemperatureFactorTable } from "@/types/eletrica";

// Fatores de correção por temperatura ambiente (°C), valores didáticos
// coerentes com a tendência da NBR 5410 para isolação PVC (70°C) e XLPE/EPR (90°C).
export const fatoresTemperatura: TemperatureFactorTable = {
  PVC: {
    "30": 1.0,
    "35": 0.94,
    "40": 0.87,
    "45": 0.79,
    "50": 0.71,
  },
  XLPE: {
    "30": 1.0,
    "35": 0.96,
    "40": 0.91,
    "45": 0.87,
    "50": 0.82,
  },
};

// Seleciona o fator aplicável: usa o ponto mais próximo <= temperatura informada.
// Abaixo do mínimo (30°C) aplica o fator do menor ponto tabelado.
// Acima do máximo (50°C) aplica o fator do maior ponto tabelado (conservador moderado).
export function obterFatorTemperatura(
  isolacao: InsulationType,
  temperatura: number
): number {
  const tabela = fatoresTemperatura[isolacao];
  const pontos = Object.keys(tabela)
    .map((k) => Number(k))
    .sort((a, b) => a - b);

  if (temperatura <= pontos[0]) return tabela[String(pontos[0])];
  if (temperatura >= pontos[pontos.length - 1]) {
    return tabela[String(pontos[pontos.length - 1])];
  }

  // Faixa imediatamente inferior (mais conservador: usa o ponto <= temperatura).
  let escolhido = pontos[0];
  for (const p of pontos) {
    if (p <= temperatura) escolhido = p;
  }
  return tabela[String(escolhido)];
}
