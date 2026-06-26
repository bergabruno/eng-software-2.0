function sendJson(res, payload, statusCode = 200) {
  return res.status(statusCode).json(payload)
}

module.exports = {
  sendJson,
}
