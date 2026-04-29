import type { AmpacityTable } from "@/types/eletrica";

// Ampacidades (A) para condutores de cobre, 2 condutores carregados, Tamb=30°C.
// Valores de referência baseados na NBR 5410 (Tabelas 36/37), aproximados por método:
//   embutido  -> método B1 (condutores em eletroduto embutido em parede)
//   aparente  -> método B2 (condutores em eletroduto aparente)
//   ar        -> método E  (cabo multipolar ao ar livre)
// Tabela simplificada e didática para MVP; não substitui a norma.
export const ampacidade: AmpacityTable = {
  PVC: {
    embutido: {
      "1.5": 15.5, "2.5": 21, "4": 28, "6": 36, "10": 50, "16": 68,
      "25": 89, "35": 111, "50": 134, "70": 171, "95": 207, "120": 239,
      "150": 275, "185": 314, "240": 369, "300": 424,
    },
    aparente: {
      "1.5": 15, "2.5": 20, "4": 27, "6": 34, "10": 46, "16": 62,
      "25": 80, "35": 99, "50": 118, "70": 149, "95": 179, "120": 206,
      "150": 236, "185": 268, "240": 312, "300": 358,
    },
    ar: {
      "1.5": 19, "2.5": 26, "4": 35, "6": 45, "10": 61, "16": 81,
      "25": 106, "35": 131, "50": 158, "70": 200, "95": 241, "120": 278,
      "150": 318, "185": 362, "240": 424, "300": 486,
    },
  },
  XLPE: {
    embutido: {
      "1.5": 20, "2.5": 28, "4": 37, "6": 48, "10": 66, "16": 89,
      "25": 117, "35": 144, "50": 175, "70": 222, "95": 269, "120": 312,
      "150": 358, "185": 408, "240": 481, "300": 553,
    },
    aparente: {
      "1.5": 19, "2.5": 26, "4": 35, "6": 44, "10": 60, "16": 80,
      "25": 105, "35": 128, "50": 154, "70": 194, "95": 233, "120": 268,
      "150": 307, "185": 348, "240": 406, "300": 465,
    },
    ar: {
      "1.5": 24, "2.5": 33, "4": 45, "6": 58, "10": 80, "16": 107,
      "25": 138, "35": 171, "50": 209, "70": 269, "95": 328, "120": 382,
      "150": 441, "185": 506, "240": 599, "300": 693,
    },
  },
};

export const fatorAgrupamento: Record<1 | 2 | 3 | 4 | 5 | 6, number> = {
  1: 1.0,
  2: 0.8,
  3: 0.7,
  4: 0.65,
  5: 0.6,
  6: 0.57,
};
