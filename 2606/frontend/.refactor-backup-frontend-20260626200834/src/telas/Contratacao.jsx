import { useState } from 'react'
import { contratar } from '../api'

const brl = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

export default function Contratacao({ simulacao, dataprev, onVoltar, onContratar }) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleContratar() {
    setErro('')
    setLoading(true)
    try {
      const resultado = await contratar(dataprev.token, simulacao)
      if (!resultado.ok) {
        setErro(resultado.mensagem || 'Erro ao contratar.')
        return
      }
      onContratar(resultado)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!simulacao || !dataprev) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
        <span className="text-[#ED145B] font-bold text-xl">ConsigFIAP</span>
        <button
          onClick={onVoltar}
          className="text-[#B3B3B3] hover:text-[#F5F5F5] text-sm transition-colors"
          disabled={loading}
        >
          ← Voltar
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#F5F5F5]">Confirmar Contratação</h2>

          <div className="card flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-[#B3B3B3] text-sm">Valor liberado</span>
              <span className="text-[#22C55E] font-bold">{brl(simulacao.valorLiberado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B3B3B3] text-sm">Parcela mensal</span>
              <span className="text-[#F5F5F5] font-semibold">{brl(simulacao.valorParcela)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B3B3B3] text-sm">Prazo</span>
              <span className="text-[#F5F5F5] font-semibold">{simulacao.prazoMeses} meses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B3B3B3] text-sm">Taxa</span>
              <span className="text-[#F5F5F5] font-semibold">1,80% a.m.</span>
            </div>
            <div className="border-t border-[#2A2A2A] pt-4">
              <span className="badge-success">✓ Dataprev Aprovado</span>
            </div>
          </div>

          {erro && <p className="text-[#EF4444] text-sm">{erro}</p>}

          <button className="btn-primary" onClick={handleContratar} disabled={loading}>
            {loading ? 'Processando...' : 'Contratar agora'}
          </button>

          {erro && (
            <button className="btn-secondary" onClick={onVoltar}>
              Voltar
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
