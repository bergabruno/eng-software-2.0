import { useState, useEffect } from 'react'
import { validarDataprev } from '../api'
import AppHeader from '../components/AppHeader'

export default function StatusDataprev({ simulacao, onVoltar, onContinuar }) {
  const [status, setStatus] = useState('loading')
  const [dados, setDados] = useState(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      const resultado = await validarDataprev(
        simulacao.valorSolicitado,
        simulacao.prazoMeses
      )

      if (resultado.ok) {
        setDados(resultado)
        setStatus('sucesso')
      } else {
        setDados(resultado)
        setStatus('erro')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [simulacao])

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        actionLabel={status !== 'loading' ? '← Voltar' : undefined}
        onAction={onVoltar}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {status === 'loading' && (
            <div className="card flex flex-col items-center gap-6 text-center">
              <div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#ED145B] rounded-full animate-spin mx-auto" />
              <p className="text-[#B3B3B3]">Consultando Dataprev...</p>
            </div>
          )}

          {status === 'sucesso' && (
            <div className="card flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="badge-success text-base px-4 py-2">
                  ✓ Aprovado pela Dataprev
                </span>
                <p className="text-[#B3B3B3] text-sm">
                  Margem consignável verificada com sucesso.
                </p>
              </div>
              <button className="btn-primary" onClick={() => onContinuar(dados)}>
                Continuar para contratação
              </button>
            </div>
          )}

          {status === 'erro' && dados && (
            <div className="card flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="badge-error text-base px-4 py-2">
                  ✗ Reprovado pela Dataprev
                </span>
                <p className="text-[#EF4444] text-sm">{dados.mensagem}</p>
                <span className="bg-[#2A2A2A] text-[#B3B3B3] text-xs px-3 py-1 rounded-full font-mono">
                  {dados.codigo}
                </span>
              </div>
              <button className="btn-secondary" onClick={onVoltar}>
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
