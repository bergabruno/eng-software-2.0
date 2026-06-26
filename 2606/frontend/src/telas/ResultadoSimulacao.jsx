import AppHeader from '../components/AppHeader'
import InfoRow from '../components/InfoRow'
import { formatCurrencyBRL, formatDateBR } from '../utils/formatters'

export default function ResultadoSimulacao({ simulacao, onVoltar, onValidar }) {
  if (!simulacao) return null

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader actionLabel="← Voltar" onAction={onVoltar} />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#F5F5F5]">Resultado da Simulação</h2>

          <div className="card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#2A2A2A]">
                <InfoRow
                  label="Valor solicitado"
                  value={formatCurrencyBRL(simulacao.valorSolicitado)}
                />
                <InfoRow
                  label="Prazo"
                  value={`${simulacao.prazoMeses} meses`}
                />
                <InfoRow
                  label="Taxa mensal"
                  value={`${simulacao.taxaMensalPercentual.toFixed(2)}% a.m.`}
                />
                <InfoRow
                  label="Taxa anual"
                  value={`${simulacao.cetAnualPercentual.toFixed(2)}% a.a.`}
                />
                <InfoRow
                  label="Valor da parcela"
                  value={formatCurrencyBRL(simulacao.valorParcela)}
                  valueClassName="text-[#ED145B] text-right font-bold text-base"
                />
                <InfoRow
                  label="Total a pagar"
                  value={formatCurrencyBRL(simulacao.totalPagar)}
                />
                <InfoRow
                  label="Valor liberado"
                  value={formatCurrencyBRL(simulacao.valorLiberado)}
                  valueClassName="text-[#22C55E] text-right font-medium"
                />
                <InfoRow
                  label="Data da 1ª parcela"
                  value={formatDateBR(simulacao.dataPrimeiraParcela)}
                />
              </tbody>
            </table>
          </div>

          <button className="btn-primary" onClick={onValidar}>
            Validar na Dataprev
          </button>
          <button className="btn-secondary" onClick={onVoltar}>
            ← Nova simulação
          </button>
        </div>
      </main>
    </div>
  )
}
