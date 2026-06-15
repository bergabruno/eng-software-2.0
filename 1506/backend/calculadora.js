const TAXA_MENSAL = 0.018 // 1,80% a.m. — taxa fixa de mercado consignado INSS

function calcularSimulacao(valorSolicitado, prazoMeses) {
  const pv = valorSolicitado
  const i = TAXA_MENSAL
  const n = prazoMeses
  const fator = Math.pow(1 + i, n)
  const pmt = pv * (i * fator) / (fator - 1)
  const valorParcela = Math.round(pmt * 100) / 100
  const cetAnualPercentual = Math.round(i * 12 * 10000) / 100  // simplificado para MVP
  const valorLiberado = pv  // no MVP o valor liberado = valor solicitado
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

function validarEntrada(valorSolicitado, prazoMeses) {
  if (!valorSolicitado || valorSolicitado <= 0) return 'Valor solicitado deve ser maior que zero.'
  if (!prazoMeses || prazoMeses < 2 || prazoMeses > 102) return 'Prazo deve ser entre 2 e 102 meses.'
  return null
}

module.exports = { calcularSimulacao, validarEntrada, TAXA_MENSAL }
