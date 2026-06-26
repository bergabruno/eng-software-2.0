const TAXA_MENSAL = 0.018

export function calcularSimulacao(valorSolicitado, prazoMeses) {
  const pv = valorSolicitado
  const i = TAXA_MENSAL
  const n = prazoMeses
  const fator = Math.pow(1 + i, n)
  const pmt = pv * (i * fator) / (fator - 1)
  const valorParcela = Math.round(pmt * 100) / 100
  const cetAnualPercentual = Math.round(i * 12 * 10000) / 100
  const valorLiberado = pv
  return {
    valorSolicitado: pv,
    prazoMeses: n,
    taxaMensal: i,
    taxaMensalPercentual: i * 100,
    cetAnualPercentual,
    valorParcela,
    valorLiberado,
    totalPagar: Math.round(valorParcela * n * 100) / 100,
  }
}
