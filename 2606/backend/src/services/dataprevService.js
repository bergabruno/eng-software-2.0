const HttpError = require('../domain/HttpError')
const memoryRepository = require('../repositories/memoryRepository')
const {
  ERROS_DATAPREV,
  MENSAGENS_ERRO_DATAPREV,
} = require('../constants/dataprevConstants')

function consultarDataprev() {
  const contador = memoryRepository.incrementarConsultaDataprev()
  const ehErro = contador % 2 !== 0

  if (!ehErro) {
    return {
      ok: true,
    }
  }

  const indiceErro = (contador - 1) % ERROS_DATAPREV.length
  const codigo = ERROS_DATAPREV[indiceErro]

  throw new HttpError(422, MENSAGENS_ERRO_DATAPREV[codigo], {
    codigo,
  })
}

function validarDataprev() {
  consultarDataprev()

  const token = `dp_ok_${Date.now()}`
  memoryRepository.salvarTokenDataprev(token)

  return {
    ok: true,
    status: 'aprovado',
    token,
  }
}

module.exports = {
  validarDataprev,
}
