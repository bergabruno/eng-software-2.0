const { arredondarDinheiro } = require('../utils/money')

const estado = {
  saldo: 0,
  contadorDataprev: 0,
  contratos: [],
  contadorContrato: 0,
  ultimoTokenDataprev: null,
}

function obterSaldo() {
  return estado.saldo
}

function creditarSaldo(valor) {
  const saldoAntes = estado.saldo
  const valorCreditado = arredondarDinheiro(valor)

  estado.saldo = arredondarDinheiro(saldoAntes + valorCreditado)

  return {
    saldoAntes,
    valorCreditado,
    saldoDepois: estado.saldo,
  }
}

function incrementarConsultaDataprev() {
  estado.contadorDataprev += 1
  return estado.contadorDataprev
}

function salvarTokenDataprev(token) {
  estado.ultimoTokenDataprev = token
  return estado.ultimoTokenDataprev
}

function tokenDataprevValido(token) {
  return Boolean(token && token === estado.ultimoTokenDataprev)
}

function consumirTokenDataprev() {
  estado.ultimoTokenDataprev = null
}

function gerarContratoId() {
  estado.contadorContrato += 1
  return `CTR-${String(estado.contadorContrato).padStart(4, '0')}`
}

function salvarContrato(contrato) {
  estado.contratos.push(contrato)
  return contrato
}

module.exports = {
  obterSaldo,
  creditarSaldo,
  incrementarConsultaDataprev,
  salvarTokenDataprev,
  tokenDataprevValido,
  consumirTokenDataprev,
  gerarContratoId,
  salvarContrato,
}
