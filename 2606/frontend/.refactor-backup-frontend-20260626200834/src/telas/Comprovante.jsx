const brl = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

function formatarData(iso) {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Comprovante({ comprovante, onInicio }) {
  if (!comprovante) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
        <span className="text-[#ED145B] font-bold text-xl">ConsigFIAP</span>
      </header>

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
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Número do contrato</td>
                  <td className="py-3 text-[#ED145B] text-right font-bold font-mono">
                    {comprovante.contratoId}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Valor creditado</td>
                  <td className="py-3 text-[#22C55E] text-right font-bold">
                    {brl(comprovante.valorCreditado)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Saldo anterior</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {brl(comprovante.saldoAntes)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Saldo atual</td>
                  <td className="py-3 text-[#22C55E] text-right font-bold">
                    {brl(comprovante.saldoDepois)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-[#B3B3B3]">Data/hora</td>
                  <td className="py-3 text-[#F5F5F5] text-right font-medium">
                    {formatarData(comprovante.dataContratacao)}
                  </td>
                </tr>
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
