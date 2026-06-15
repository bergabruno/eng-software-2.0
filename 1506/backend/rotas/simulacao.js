const express = require('express')
const router = express.Router()
const { calcularSimulacao, validarEntrada } = require('../calculadora')

router.post('/', (req, res) => {
  const { valorSolicitado, prazoMeses } = req.body
  const erro = validarEntrada(valorSolicitado, prazoMeses)
  if (erro) {
    return res.status(400).json({ ok: false, mensagem: erro })
  }
  const resultado = calcularSimulacao(Number(valorSolicitado), Number(prazoMeses))
  res.json(resultado)
})

module.exports = router
