function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      ok: false,
      mensagem: 'JSON inválido.',
    })
  }

  const statusCode = Number(err.statusCode || 500)
  const mensagem = statusCode >= 500
    ? 'Erro interno no servidor.'
    : err.message

  const payload = {
    ok: false,
    mensagem,
  }

  if (err.codigo) {
    payload.codigo = err.codigo
  }

  return res.status(statusCode).json(payload)
}

module.exports = errorHandler
