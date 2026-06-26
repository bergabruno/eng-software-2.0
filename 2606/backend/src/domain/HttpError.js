class HttpError extends Error {
  constructor(statusCode, mensagem, metadata = {}) {
    super(mensagem)
    this.name = 'HttpError'
    this.statusCode = statusCode
    Object.assign(this, metadata)
  }
}

module.exports = HttpError
