export function formatCurrencyBRL(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0)
}

export function formatDateBR(iso) {
  if (!iso) return '—'

  const [year, month, day] = iso.split('-')

  if (!year || !month || !day) return '—'

  return `${day}/${month}/${year}`
}

export function formatDateTimeBR(iso) {
  if (!iso) return '—'

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
