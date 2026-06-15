const express = require('express')
const router = express.Router()
const estado = require('../estado')

const ERROS = ['sem_margem', 'sem_dinheiro_simular', 'sem_dinheiro_contratar']

const MENSAGENS_ERRO = {
  sem_margem: 'Cliente não possui margem consignável ou está com bloqueio na Dataprev.',
  sem_dinheiro_simular: 'Cliente não possui recursos disponíveis para simulação na Dataprev.',
  sem_dinheiro_contratar: 'Cliente não possui recursos disponíveis para contratação na Dataprev.',
}

function consultarDataprev() {
  estado.contadorDataprev += 1
  const ehErro = estado.contadorDataprev % 2 !== 0
  if (ehErro) {
    const codigo = ERROS[Math.floor(Math.random() * ERROS.length)]
    return { ok: false, codigo }
  }
  return { ok: true }
}

router.post('/validar', (req, res) => {
  const resultado = consultarDataprev()
  if (!resultado.ok) {
    return res.status(422).json({
      ok: false,
      codigo: resultado.codigo,
      mensagem: MENSAGENS_ERRO[resultado.codigo],
    })
  }
  const token = `dp_ok_${Date.now()}`
  estado.ultimoTokenDataprev = token
  res.json({ ok: true, status: 'aprovado', token })
})

module.exports = router
