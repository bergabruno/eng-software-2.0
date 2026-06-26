import AppHeader from '../components/AppHeader'
import InfoRow from '../components/InfoRow'
import { formatCurrencyBRL, formatDateTimeBR } from '../utils/formatters'

export default function Comprovante({ comprovante, onInicio }) {
  if (!comprovante) return null

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
              <span className="text-[#22C55E] text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">Contratação realizada!</h2>
          </div>

          <div className="card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#2A2A2A]">
                <InfoRow
                  label="Número do contrato"
                  value={comprovante.contratoId}
                  valueClassName="text-[#ED145B] text-right font-bold font-mono"
                />
                <InfoRow
                  label="Valor creditado"
                  value={formatCurrencyBRL(comprovante.valorCreditado)}
                  valueClassName="text-[#22C55E] text-right font-bold"
                />
                <InfoRow
                  label="Saldo anterior"
                  value={formatCurrencyBRL(comprovante.saldoAntes)}
                />
                <InfoRow
                  label="Saldo atual"
                  value={formatCurrencyBRL(comprovante.saldoDepois)}
                  valueClassName="text-[#22C55E] text-right font-bold"
                />
                <InfoRow
                  label="Data/hora"
                  value={formatDateTimeBR(comprovante.dataContratacao)}
                />
              </tbody>
            </table>
          </div>

          <button className="btn-primary" onClick={onInicio}>
            Ir para home
          </button>
        </div>
      </main>
    </div>
  )
}
