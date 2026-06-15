const express = require('express')
const router = express.Router()
const estado = require('../estado')

router.post('/', (req, res) => {
  const { tokenDataprev, simulacao } = req.body

  if (!tokenDataprev || tokenDataprev !== estado.ultimoTokenDataprev) {
    return res.status(422).json({
      ok: false,
      mensagem: 'Validação Dataprev não realizada ou expirada. Reinicie a simulação.',
    })
  }

  // Consumir token (uso único)
  estado.ultimoTokenDataprev = null

  const saldoAntes = estado.saldo
  const valorCreditado = simulacao.valorLiberado
  estado.saldo = Math.round((saldoAntes + valorCreditado) * 100) / 100

  estado.contadorContrato += 1
  const contratoId = `CTR-${String(estado.contadorContrato).padStart(4, '0')}`

  const contrato = {
    contratoId,
    valorSolicitado: simulacao.valorSolicitado,
    prazoMeses: simulacao.prazoMeses,
    valorParcela: simulacao.valorParcela,
    valorLiberado: valorCreditado,
    taxaMensal: simulacao.taxaMensal,
    cetAnualPercentual: simulacao.cetAnualPercentual,
    totalPagar: simulacao.totalPagar,
    saldoAntes,
    saldoDepois: estado.saldo,
    dataContratacao: new Date().toISOString(),
  }

  estado.contratos.push(contrato)

  res.json({
    ok: true,
    contratoId,
    saldoAntes,
    valorCreditado,
    saldoDepois: estado.saldo,
    dataContratacao: contrato.dataContratacao,
    mensagem: 'Contratação realizada com sucesso.',
  })
})

module.exports = router
