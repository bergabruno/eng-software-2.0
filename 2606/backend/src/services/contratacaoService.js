const HttpError = require('../domain/HttpError')
const { criarContrato } = require('../domain/contratoFactory')
const memoryRepository = require('../repositories/memoryRepository')
const {
  validarSimulacaoContratacao,
} = require('../validations/contratacaoValidation')

function contratar(payload) {
  const { tokenDataprev, simulacao } = payload || {}

  if (!memoryRepository.tokenDataprevValido(tokenDataprev)) {
    throw new HttpError(
      422,
      'Validação Dataprev não realizada ou expirada. Reinicie a simulação.'
    )
  }

  const simulacaoValidada = validarSimulacaoContratacao(simulacao)

  memoryRepository.consumirTokenDataprev()

  const {
    saldoAntes,
    valorCreditado,
    saldoDepois,
  } = memoryRepository.creditarSaldo(simulacaoValidada.valorLiberado)

  const contratoId = memoryRepository.gerarContratoId()

  const contrato = criarContrato({
    contratoId,
    simulacao: simulacaoValidada,
    saldoAntes,
    saldoDepois,
  })

  memoryRepository.salvarContrato(contrato)

  return {
    ok: true,
    contratoId,
    saldoAntes,
    valorCreditado,
    saldoDepois,
    dataContratacao: contrato.dataContratacao,
    mensagem: 'Contratação realizada com sucesso.',
  }
}

module.exports = {
  contratar,
}
