const contratacaoService = require('../services/contratacaoService')
const { sendJson } = require('../utils/response')

function contratar(req, res) {
  const resultado = contratacaoService.contratar(req.body)
  return sendJson(res, resultado)
}

module.exports = {
  contratar,
}
