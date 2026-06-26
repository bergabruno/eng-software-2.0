const brl = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

function formatarData(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function ResultadoSimulacao({ simulacao, onVoltar, onValidar }) {
  if (!simulacao) return null

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
        <div className="max-w-md w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[#F5F5F5]">Resultado da Simulação</h2>

          <div className="card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#2A2A2A]">
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Valor solicitado</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {brl(simulacao.valorSolicitado)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Prazo</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {simulacao.prazoMeses} meses
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Taxa mensal</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {simulacao.taxaMensalPercentual.toFixed(2)}% a.m.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Taxa anual</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {simulacao.cetAnualPercentual.toFixed(2)}% a.a.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Valor da parcela</td>
                  <td className="py-3 text-[#ED145B] text-right font-bold text-base">
                    {brl(simulacao.valorParcela)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Total a pagar</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {brl(simulacao.totalPagar)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Valor liberado</td>
                  <td className="py-3 text-[#22C55E] text-right font-medium">
                    {brl(simulacao.valorLiberado)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Data da 1ª parcela</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {formatarData(simulacao.dataPrimeiraParcela)}
                  </td>
                </tr>
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
