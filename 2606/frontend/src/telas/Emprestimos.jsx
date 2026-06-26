import AppHeader from '../components/AppHeader'

export default function Emprestimos({ onVoltar, onConsignado }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader actionLabel="← Voltar" onAction={onVoltar} />

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
