const brl = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

export default function Home({ saldo, onEmprestimos, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A]">
        <span className="text-[#ED145B] font-bold text-xl">ConsigFIAP</span>
        <button
          onClick={onLogout}
          className="text-[#B3B3B3] hover:text-[#F5F5F5] text-sm transition-colors"
        >
          Sair
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="card text-center">
            <p className="label text-center">Saldo em conta</p>
            <p className="text-4xl font-bold text-[#F5F5F5] mt-2">{brl(saldo)}</p>
          </div>
          <button className="btn-primary" onClick={onEmprestimos}>
            Ver Empréstimos
          </button>
        </div>
      </main>
    </div>
  )
}
