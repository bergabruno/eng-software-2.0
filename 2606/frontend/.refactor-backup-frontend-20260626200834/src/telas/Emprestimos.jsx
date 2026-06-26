export default function Emprestimos({ onVoltar, onConsignado }) {
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
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Empréstimos</h2>
          <div className="card flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📋</span>
              <div className="flex-1">
                <h3 className="text-[#F5F5F5] font-semibold text-lg">
                  Empréstimo Consignado INSS
                </h3>
                <p className="text-[#B3B3B3] text-sm mt-1">
                  Desconto direto no benefício. Taxas a partir de 1,80% a.m.
                </p>
              </div>
            </div>
            <button className="btn-primary" onClick={onConsignado}>
              Solicitar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
