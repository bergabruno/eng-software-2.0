import Login from './telas/Login'
import Home from './telas/Home'
import Emprestimos from './telas/Emprestimos'
import Simulacao from './telas/Simulacao'
import ResultadoSimulacao from './telas/ResultadoSimulacao'
import StatusDataprev from './telas/StatusDataprev'
import Contratacao from './telas/Contratacao'
import Comprovante from './telas/Comprovante'
import { useFluxoConsignado } from './hooks/useFluxoConsignado'

export default function App() {
  const fluxo = useFluxoConsignado()

  const telas = {
    login: <Login onEntrar={fluxo.entrar} />,
    home: (
      <Home
        saldo={fluxo.saldo}
        onEmprestimos={fluxo.irParaEmprestimos}
        onLogout={fluxo.sair}
      />
    ),
    emprestimos: (
      <Emprestimos
        onVoltar={fluxo.irParaHome}
        onConsignado={fluxo.irParaSimulacao}
      />
    ),
    simulacao: (
      <Simulacao
        onVoltar={fluxo.irParaEmprestimos}
        onSimular={fluxo.concluirSimulacao}
      />
    ),
    resultado: (
      <ResultadoSimulacao
        simulacao={fluxo.simulacao}
        onVoltar={fluxo.irParaSimulacao}
        onValidar={fluxo.irParaDataprev}
      />
    ),
    dataprev: (
      <StatusDataprev
        simulacao={fluxo.simulacao}
        onVoltar={fluxo.irParaResultado}
        onContinuar={fluxo.concluirDataprev}
        onErro={fluxo.irParaResultado}
      />
    ),
    contratacao: (
      <Contratacao
        simulacao={fluxo.simulacao}
        dataprev={fluxo.dataprev}
        onVoltar={fluxo.irParaDataprev}
        onContratar={fluxo.concluirContratacao}
      />
    ),
    comprovante: (
      <Comprovante
        comprovante={fluxo.comprovante}
        onInicio={fluxo.voltarAoInicio}
      />
    ),
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans">
      {telas[fluxo.tela]}
    </div>
  )
}
