function notFoundHandler(req, res) {
  return res.status(404).json({
    ok: false,
    mensagem: 'Rota não encontrada.',
  })
}

module.exports = notFoundHandler
