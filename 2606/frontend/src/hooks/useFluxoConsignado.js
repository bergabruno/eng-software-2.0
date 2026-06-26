import { useState } from 'react'

export function useFluxoConsignado() {
  const [tela, setTela] = useState('login')
  const [simulacao, setSimulacao] = useState(null)
  const [dataprev, setDataprev] = useState(null)
  const [comprovante, setComprovante] = useState(null)
  const [saldo, setSaldo] = useState(0)

  function ir(proximaTela) {
    setTela(proximaTela)
  }

  function entrar() {
    ir('home')
  }

  function sair() {
    ir('login')
  }

  function irParaHome() {
    ir('home')
  }

  function irParaEmprestimos() {
    ir('emprestimos')
  }

  function irParaSimulacao() {
    ir('simulacao')
  }

  function irParaResultado() {
    ir('resultado')
  }

  function irParaDataprev() {
    ir('dataprev')
  }

  function concluirSimulacao(resultadoSimulacao) {
    setSimulacao(resultadoSimulacao)
    ir('resultado')
  }

  function concluirDataprev(resultadoDataprev) {
    setDataprev(resultadoDataprev)
    ir('contratacao')
  }

  function concluirContratacao(resultadoContratacao) {
    setComprovante(resultadoContratacao)
    setSaldo(resultadoContratacao.saldoDepois)
    ir('comprovante')
  }

  function voltarAoInicio() {
    setSimulacao(null)
    setDataprev(null)
    setComprovante(null)
    ir('home')
  }

  return {
    tela,
    simulacao,
    dataprev,
    comprovante,
    saldo,
    entrar,
    sair,
    irParaHome,
    irParaEmprestimos,
    irParaSimulacao,
    irParaResultado,
    irParaDataprev,
    concluirSimulacao,
    concluirDataprev,
    concluirContratacao,
    voltarAoInicio,
  }
}
