const BASE = '/api'

export async function login() {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  return r.json()
}

export async function logout() {
  await fetch(`${BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
}

export async function getSaldo() {
  const r = await fetch(`${BASE}/conta/saldo`)
  return r.json()
}

export async function simular(valorSolicitado, prazoMeses) {
  const r = await fetch(`${BASE}/simulacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.mensagem || 'Erro na simulação')
  return data
}

export async function validarDataprev(valorSolicitado, prazoMeses) {
  const r = await fetch(`${BASE}/dataprev/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valorSolicitado, prazoMeses }),
  })
  const data = await r.json()
  return { status: r.status, ...data }
}

export async function contratar(tokenDataprev, simulacao) {
  const r = await fetch(`${BASE}/contratacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenDataprev, simulacao }),
  })
  const data = await r.json()
  return { status: r.status, ...data }
}
