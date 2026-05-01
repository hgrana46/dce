export const CORRENTES_DISJUNTOR = [
  2, 4, 6, 10, 16, 20, 25, 32, 40, 50, 63, 70, 80, 100, 125, 160, 200, 225,
  250, 300, 320, 350, 400, 500, 630,
] as const;

export function selecionarDisjuntor(
  correnteProjeto: number,
  ampacidadeCorrigida: number
): number | null {
  if (
    !Number.isFinite(correnteProjeto) ||
    !Number.isFinite(ampacidadeCorrigida) ||
    correnteProjeto <= 0 ||
    ampacidadeCorrigida <= 0
  ) {
    return null;
  }

  return (
    CORRENTES_DISJUNTOR.find(
      (corrente) =>
        corrente >= correnteProjeto && corrente <= ampacidadeCorrigida
    ) ?? null
  );
}
