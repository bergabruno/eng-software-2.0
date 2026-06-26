const HttpError = require('../domain/HttpError')

const CAMPOS_NUMERICOS_SIMULACAO = [
  'valorSolicitado',
  'prazoMeses',
  'valorParcela',
  'valorLiberado',
  'taxaMensal',
  'cetAnualPercentual',
  'totalPagar',
]

function validarSimulacaoContratacao(simulacao) {
  if (!simulacao || typeof simulacao !== 'object') {
    throw new HttpError(400, 'Dados da simulação são obrigatórios.')
  }

  for (const campo of CAMPOS_NUMERICOS_SIMULACAO) {
    const valor = Number(simulacao[campo])

    if (!Number.isFinite(valor)) {
      throw new HttpError(400, `Campo inválido na simulação: ${campo}.`)
    }
  }

  return {
    valorSolicitado: Number(simulacao.valorSolicitado),
    prazoMeses: Number(simulacao.prazoMeses),
    valorParcela: Number(simulacao.valorParcela),
    valorLiberado: Number(simulacao.valorLiberado),
    taxaMensal: Number(simulacao.taxaMensal),
    cetAnualPercentual: Number(simulacao.cetAnualPercentual),
    totalPagar: Number(simulacao.totalPagar),
  }
}

module.exports = {
  validarSimulacaoContratacao,
}
