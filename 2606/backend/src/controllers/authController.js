const authService = require('../services/authService')
const { sendJson } = require('../utils/response')

function login(req, res) {
  return sendJson(res, authService.login())
}

function logout(req, res) {
  return sendJson(res, authService.logout())
}

module.exports = {
  login,
  logout,
}
