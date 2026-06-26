function criarContrato({
  contratoId,
  simulacao,
  saldoAntes,
  saldoDepois,
}) {
  return {
    contratoId,
    valorSolicitado: simulacao.valorSolicitado,
    prazoMeses: simulacao.prazoMeses,
    valorParcela: simulacao.valorParcela,
    valorLiberado: simulacao.valorLiberado,
    taxaMensal: simulacao.taxaMensal,
    cetAnualPercentual: simulacao.cetAnualPercentual,
    totalPagar: simulacao.totalPagar,
    saldoAntes,
    saldoDepois,
    dataContratacao: new Date().toISOString(),
  }
}

module.exports = {
  criarContrato,
}
