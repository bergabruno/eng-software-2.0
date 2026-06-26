import AppHeader from '../components/AppHeader'
import { formatCurrencyBRL } from '../utils/formatters'

export default function Home({ saldo, onEmprestimos, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader actionLabel="Sair" onAction={onLogout} />

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="card text-center">
            <p className="label text-center">Saldo em conta</p>
            <p className="text-4xl font-bold text-[#F5F5F5] mt-2">
              {formatCurrencyBRL(saldo)}
            </p>
          </div>
          <button className="btn-primary" onClick={onEmprestimos}>
            Ver Empréstimos
          </button>
        </div>
      </main>
    </div>
  )
}
