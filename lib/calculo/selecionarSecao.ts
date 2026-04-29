import type { CalculationInput, CalculationResult } from "@/types/eletrica";
import { calcularCorrenteProjeto } from "./calcularCorrente";
import { selecionarSecaoPorAmpacidade } from "./calcularAmpacidade";
import { selecionarSecaoPorQueda } from "./calcularQuedaTensao";

export function validarEntrada(input: CalculationInput): string | null {
  if (!input.tensao || input.tensao <= 0) return "Tensão inválida";
  if (!input.comprimento || input.comprimento <= 0)
    return "Comprimento inválido";
  if (!Number.isFinite(input.temperatura)) return "Temperatura inválida";
  if (input.temperatura < -20 || input.temperatura > 80)
    return "Temperatura fora de faixa razoável";
  if (input.agrupamento < 1 || input.agrupamento > 6)
    return "Agrupamento inválido";

  if (input.modo === "corrente") {
    if (!input.corrente || input.corrente <= 0) return "Corrente inválida";
  } else {
    if (!input.potenciaKw || input.potenciaKw <= 0) return "Potência inválida";
    if (
      !input.fatorPotencia ||
      input.fatorPotencia <= 0 ||
      input.fatorPotencia > 1
    )
      return "Fator de potência inválido";
  }
  return null;
}

export function calcular(input: CalculationInput): CalculationResult {
  const erro = validarEntrada(input);
  if (erro) throw new Error(erro);

  const correnteProjeto = calcularCorrenteProjeto(input);
  if (!Number.isFinite(correnteProjeto) || correnteProjeto <= 0) {
    throw new Error("Corrente de projeto inválida");
  }

  const secaoAmp = selecionarSecaoPorAmpacidade(input, correnteProjeto);
  const secaoQueda = selecionarSecaoPorQueda(input, correnteProjeto);

  if (secaoAmp === null || secaoQueda === null) {
    throw new Error(
      "Nenhuma seção comercial atende aos critérios — reveja os dados"
    );
  }

  const secaoFinal = Math.max(secaoAmp, secaoQueda);
  const criterioLimitante: CalculationResult["criterioLimitante"] =
    secaoQueda > secaoAmp
      ? "queda"
      : secaoAmp > secaoQueda
      ? "ampacidade"
      : "ambos";

  return {
    secaoFinal,
    secaoAmpacidade: secaoAmp,
    secaoQueda: secaoQueda,
    criterioLimitante,
    correnteProjeto,
  };
}
