import AppHeader from '../components/AppHeader'
import ErrorMessage from '../components/ErrorMessage'
import { useSimulacaoForm } from '../hooks/useSimulacaoForm'

export default function Simulacao({ onVoltar, onSimular }) {
  const form = useSimulacaoForm(onSimular)

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader actionLabel="← Voltar" onAction={onVoltar} />

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Simular Empréstimo</h2>
          <form className="card flex flex-col gap-5" onSubmit={form.handleSubmit}>
            <div>
              <label className="label">Valor desejado (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                className="input-field"
                value={form.valorDisplay}
                onChange={form.handleValorChange}
              />
            </div>

            <div>
              <label className="label">Prazo</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="102"
                  placeholder="2 a 102"
                  className="input-field"
                  value={form.prazo}
                  onChange={(e) => form.setPrazo(e.target.value)}
                />
                <span className="text-[#B3B3B3] whitespace-nowrap">meses</span>
              </div>
            </div>

            <div>
              <label className="label">Data da 1ª parcela</label>
              <input
                type="date"
                className="input-field"
                value={form.dataParcela}
                min={form.minData}
                max={form.maxData}
                onChange={(e) => form.setDataParcela(e.target.value)}
              />
              <p className="text-[#B3B3B3] text-xs mt-1">
                Máximo 60 dias a partir de hoje.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
              <span>Taxa:</span>
              <span className="text-[#F5F5F5] font-medium">
                1,80% a.m. · 21,60% a.a.
              </span>
            </div>

            <ErrorMessage>{form.erro}</ErrorMessage>

            <button type="submit" className="btn-primary" disabled={form.loading}>
              {form.loading ? 'Calculando...' : 'Simular'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
