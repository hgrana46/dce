import type { CalculationInput, CalculationResult } from "@/types/eletrica";
import { calcularCorrenteProjeto } from "./calcularCorrente";
import {
  calcularAmpacidadeCorrigida,
  selecionarCombinacaoPorAmpacidade,
} from "./calcularAmpacidade";
import {
  calcularQuedaPercentual,
  selecionarCombinacaoPorQueda,
} from "./calcularQuedaTensao";
import {
  areaTotal,
  descreverCombinacao,
  listarCombinacoes,
} from "./combinacoes";
import { selecionarDisjuntor } from "./selecionarDisjuntor";

export function validarEntrada(input: CalculationInput): string | null {
  if (!(["monofasico", "bifasico", "trifasico"] as const).includes(input.sistema))
    return "Sistema inválido";
  if (!input.tensao || input.tensao <= 0) return "Tensão inválida";
  if (!input.comprimento || input.comprimento <= 0)
    return "Comprimento inválido";
  if (!Number.isFinite(input.temperatura)) return "Temperatura inválida";
  if (input.temperatura < -20 || input.temperatura > 80)
    return "Temperatura fora de faixa razoável";
  if (
    input.cabosParalelos !== undefined &&
    !([1, 2, 3, 4] as const).includes(input.cabosParalelos)
  )
    return "Quantidade de cabos inválida";
  if (input.agrupamento < 1 || input.agrupamento > 6)
    return "Agrupamento inválido";

  if (input.modo === "corrente") {
    if (!input.corrente || input.corrente <= 0) return "Corrente inválida";
  } else {
    if (!input.potenciaKw || input.potenciaKw <= 0) return "Potência inválida";
    if (
      input.unidadePotencia &&
      !(["W", "kW", "kVA", "CV"] as const).includes(input.unidadePotencia)
    )
      return "Unidade de potência inválida";
    if (
      input.unidadePotencia !== "kVA" &&
      (!input.fatorPotencia ||
        input.fatorPotencia <= 0 ||
        input.fatorPotencia > 1)
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

  const combinacaoAmp = selecionarCombinacaoPorAmpacidade(
    input,
    correnteProjeto
  );
  const combinacaoQueda = selecionarCombinacaoPorQueda(input, correnteProjeto);

  if (combinacaoAmp === null || combinacaoQueda === null) {
    throw new Error(
      "Nenhuma combinação atende aos critérios com o limite de cabos em paralelo e seções disponíveis"
    );
  }

  const areaAmp = areaTotal(combinacaoAmp);
  const areaQueda = areaTotal(combinacaoQueda);
  const criterioLimitante: CalculationResult["criterioLimitante"] =
    areaQueda > areaAmp
      ? "queda"
      : areaAmp > areaQueda
      ? "ampacidade"
      : "ambos";

  const areaMinima = Math.max(areaAmp, areaQueda);
  const combinacaoFinal = listarCombinacoes(input).find((combinacao) => {
    if (areaTotal(combinacao) < areaMinima) return false;

    const ampacidade = calcularAmpacidadeCorrigida(
      input,
      combinacao.secao,
      combinacao.quantidadeCabos
    );
    const queda = calcularQuedaPercentual(
      input,
      correnteProjeto,
      combinacao.secao,
      combinacao.quantidadeCabos
    );

    return (
      ampacidade !== null &&
      queda !== null &&
      ampacidade >= correnteProjeto &&
      queda <= input.quedaMaximaPercentual &&
      selecionarDisjuntor(correnteProjeto, ampacidade) !== null
    );
  });

  if (!combinacaoFinal) {
    throw new Error(
      "Nenhuma combinação atende aos critérios com o limite de cabos em paralelo e seções disponíveis"
    );
  }

  const ampacidadeFinal = calcularAmpacidadeCorrigida(
    input,
    combinacaoFinal.secao,
    combinacaoFinal.quantidadeCabos
  );
  if (ampacidadeFinal === null) {
    throw new Error("Ampacidade final inválida");
  }

  const disjuntorRecomendado = selecionarDisjuntor(
    correnteProjeto,
    ampacidadeFinal
  );
  if (disjuntorRecomendado === null) {
    throw new Error(
      "Nenhum disjuntor padronizado atende a Ib <= In <= Iz para a seção selecionada"
    );
  }

  return {
    secaoFinal: combinacaoFinal.secao,
    quantidadeCabos: combinacaoFinal.quantidadeCabos,
    descricaoFinal: descreverCombinacao(combinacaoFinal),
    secaoAmpacidade: combinacaoAmp.secao,
    quantidadeCabosAmpacidade: combinacaoAmp.quantidadeCabos,
    secaoQueda: combinacaoQueda.secao,
    quantidadeCabosQueda: combinacaoQueda.quantidadeCabos,
    criterioLimitante,
    correnteProjeto,
    ampacidadeFinal,
    disjuntorRecomendado,
  };
}
