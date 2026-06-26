const HttpError = require('../domain/HttpError')
const {
  PRAZO_MINIMO_MESES,
  PRAZO_MAXIMO_MESES,
} = require('../constants/consignadoConstants')

function validarPayloadSimulacao(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Requisição inválida.')
  }

  const valorSolicitado = Number(payload.valorSolicitado)
  const prazoMeses = Number(payload.prazoMeses)

  if (!Number.isFinite(valorSolicitado) || valorSolicitado <= 0) {
    throw new HttpError(400, 'Valor solicitado deve ser maior que zero.')
  }

  if (
    !Number.isInteger(prazoMeses) ||
    prazoMeses < PRAZO_MINIMO_MESES ||
    prazoMeses > PRAZO_MAXIMO_MESES
  ) {
    throw new HttpError(400, 'Prazo deve ser entre 2 e 102 meses.')
  }

  return {
    valorSolicitado,
    prazoMeses,
  }
}

module.exports = {
  validarPayloadSimulacao,
}
