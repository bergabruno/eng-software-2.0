const simulacaoService = require('../services/simulacaoService')
const { sendJson } = require('../utils/response')

function simular(req, res) {
  const resultado = simulacaoService.simularEmprestimo(req.body)
  return sendJson(res, resultado)
}

module.exports = {
  simular,
}
