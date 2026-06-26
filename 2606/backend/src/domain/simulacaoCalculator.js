const { TAXA_MENSAL } = require('../constants/consignadoConstants')
const { arredondarDinheiro } = require('../utils/money')

function calcularSimulacao(valorSolicitado, prazoMeses) {
  const pv = valorSolicitado
  const i = TAXA_MENSAL
  const n = prazoMeses
  const fator = Math.pow(1 + i, n)
  const pmt = pv * (i * fator) / (fator - 1)
  const valorParcela = arredondarDinheiro(pmt)
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
    totalPagar: arredondarDinheiro(valorParcela * n),
  }
}

module.exports = {
  calcularSimulacao,
}
