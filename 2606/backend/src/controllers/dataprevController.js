const dataprevService = require('../services/dataprevService')
const { sendJson } = require('../utils/response')

function validar(req, res) {
  const resultado = dataprevService.validarDataprev(req.body)
  return sendJson(res, resultado)
}

module.exports = {
  validar,
}
