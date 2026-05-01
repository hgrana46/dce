export type InputMode = "corrente" | "potencia";
export type PowerUnit = "W" | "kW" | "CV";
export type SystemType = "monofasico" | "bifasico" | "trifasico";
export type InstallationType = "embutido" | "aparente" | "ar";
export type InsulationType = "PVC" | "XLPE";

export interface CalculationInput {
  modo: InputMode;
  corrente?: number;
  potenciaKw?: number;
  unidadePotencia?: PowerUnit;
  fatorPotencia?: number;
  sistema: SystemType;
  tensao: number;
  comprimento: number;
  cabosParalelos?: 1 | 2 | 3 | 4;
  quedaMaximaPercentual: 2 | 3 | 4 | 5;
  instalacao: InstallationType;
  isolacao: InsulationType;
  temperatura: number;
  agrupamento: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CalculationResult {
  secaoFinal: number;
  quantidadeCabos: number;
  descricaoFinal: string;
  secaoAmpacidade: number;
  quantidadeCabosAmpacidade: number;
  secaoQueda: number;
  quantidadeCabosQueda: number;
  criterioLimitante: "ampacidade" | "queda" | "ambos";
  correnteProjeto: number;
  ampacidadeFinal: number;
  disjuntorRecomendado: number;
}

export type AmpacityTable = {
  [insulation in InsulationType]: {
    [installation in InstallationType]: Record<string, number>;
  };
};

export type TemperatureFactorTable = {
  [insulation in InsulationType]: Record<string, number>;
};

export const SECOES_COMERCIAIS = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35,
  50, 70, 95, 120, 150, 185, 240, 300,
] as const;
