export default function Login({ onEntrar }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#ED145B] mb-2">ConsigFIAP</h1>
          <p className="text-[#B3B3B3] text-lg">Crédito Consignado INSS</p>
        </div>
        <div className="card w-full flex flex-col items-center gap-6 mt-4">
          <p className="text-[#B3B3B3] text-sm text-center">
            Acesse sua conta para simular e contratar seu crédito consignado.
          </p>
          <button className="btn-primary" onClick={onEntrar}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
