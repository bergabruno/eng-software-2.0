import { useState } from 'react'
import Login from './telas/Login'
import Home from './telas/Home'
import Emprestimos from './telas/Emprestimos'
import Simulacao from './telas/Simulacao'
import ResultadoSimulacao from './telas/ResultadoSimulacao'
import StatusDataprev from './telas/StatusDataprev'
import Contratacao from './telas/Contratacao'
import Comprovante from './telas/Comprovante'

export default function App() {
  const [tela, setTela] = useState('login')
  const [simulacao, setSimulacao] = useState(null)
  const [dataprev, setDataprev] = useState(null)
  const [comprovante, setComprovante] = useState(null)
  const [saldo, setSaldo] = useState(0)

  const ir = (proxima) => setTela(proxima)

  const telas = {
    login: <Login onEntrar={() => ir('home')} />,
    home: <Home saldo={saldo} onEmprestimos={() => ir('emprestimos')} onLogout={() => ir('login')} />,
    emprestimos: <Emprestimos onVoltar={() => ir('home')} onConsignado={() => ir('simulacao')} />,
    simulacao: <Simulacao onVoltar={() => ir('emprestimos')} onSimular={(s) => { setSimulacao(s); ir('resultado') }} />,
    resultado: <ResultadoSimulacao simulacao={simulacao} onVoltar={() => ir('simulacao')} onValidar={() => ir('dataprev')} />,
    dataprev: <StatusDataprev simulacao={simulacao} onVoltar={() => ir('resultado')} onContinuar={(dp) => { setDataprev(dp); ir('contratacao') }} onErro={() => ir('resultado')} />,
    contratacao: <Contratacao simulacao={simulacao} dataprev={dataprev} onVoltar={() => ir('dataprev')} onContratar={(c) => { setComprovante(c); setSaldo(c.saldoDepois); ir('comprovante') }} />,
    comprovante: <Comprovante comprovante={comprovante} onInicio={() => { setSimulacao(null); setDataprev(null); setComprovante(null); ir('home') }} />,
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      {telas[tela]}
    </div>
  )
}
