const contaService = require('../services/contaService')
const { sendJson } = require('../utils/response')

function obterSaldo(req, res) {
  return sendJson(res, contaService.obterSaldo())
}

module.exports = {
  obterSaldo,
}
