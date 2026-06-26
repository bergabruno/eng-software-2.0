const { calcularSimulacao } = require('../domain/simulacaoCalculator')
const { validarPayloadSimulacao } = require('../validations/simulacaoValidation')

function simularEmprestimo(payload) {
  const dadosValidados = validarPayloadSimulacao(payload)

  return calcularSimulacao(
    dadosValidados.valorSolicitado,
    dadosValidados.prazoMeses
  )
}

module.exports = {
  simularEmprestimo,
}
