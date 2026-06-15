import { useState } from 'react'
import { simular } from '../api'

function formatarBRL(digitos) {
  if (!digitos) return ''
  const padded = digitos.padStart(3, '0')
  const cents = padded.slice(-2)
  const intPart = padded.slice(0, -2).replace(/^0+/, '') || '0'
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${intFormatted},${cents}`
}

function parseBRL(formatted) {
  if (!formatted) return 0
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0
}

function dataISO(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export default function Simulacao({ onVoltar, onSimular }) {
  const [valorDisplay, setValorDisplay] = useState('')
  const [prazo, setPrazo] = useState('')
  const [dataParcela, setDataParcela] = useState(dataISO(1))
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const minData = dataISO(1)
  const maxData = dataISO(60)

  function handleValorChange(e) {
    const raw = e.target.value.replace(/\D/g, '')
    setValorDisplay(raw ? formatarBRL(raw) : '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    const v = parseBRL(valorDisplay)
    const p = parseInt(prazo, 10)

    if (!v || v <= 0) {
      setErro('Informe um valor maior que zero.')
      return
    }
    if (!p || p < 2 || p > 102) {
      setErro('Prazo deve ser entre 2 e 102 meses.')
      return
    }
    if (!dataParcela || dataParcela < minData || dataParcela > maxData) {
      setErro('Data da 1ª parcela deve ser entre amanhã e 60 dias.')
      return
    }

    setLoading(true)
    try {
      const resultado = await simular(v, p)
      onSimular({ ...resultado, dataPrimeiraParcela: dataParcela })
    } catch (err) {
      setErro(err.message || 'Erro ao simular.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
        <span className="text-[#ED145B] font-bold text-xl">ConsigFIAP</span>
        <button
          onClick={onVoltar}
          className="text-[#B3B3B3] hover:text-[#F5F5F5] text-sm transition-colors"
        >
          ← Voltar
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Simular Empréstimo</h2>
          <form className="card flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="label">Valor desejado (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                className="input-field"
                value={valorDisplay}
                onChange={handleValorChange}
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
                  value={prazo}
                  onChange={(e) => setPrazo(e.target.value)}
                />
                <span className="text-[#B3B3B3] whitespace-nowrap">meses</span>
              </div>
            </div>
            <div>
              <label className="label">Data da 1ª parcela</label>
              <input
                type="date"
                className="input-field"
                value={dataParcela}
                min={minData}
                max={maxData}
                onChange={(e) => setDataParcela(e.target.value)}
              />
              <p className="text-[#B3B3B3] text-xs mt-1">Máximo 60 dias a partir de hoje.</p>
            </div>
            <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
              <span>Taxa:</span>
              <span className="text-[#F5F5F5] font-medium">1,80% a.m. · 21,60% a.a.</span>
            </div>
            {erro && (
              <p className="text-[#EF4444] text-sm">{erro}</p>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Calculando...' : 'Simular'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
