export function formatCurrencyInput(digitos) {
  if (!digitos) return ''

  const padded = digitos.padStart(3, '0')
  const cents = padded.slice(-2)
  const intPart = padded.slice(0, -2).replace(/^0+/, '') || '0'
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${intFormatted},${cents}`
}

export function parseCurrencyBRL(formatted) {
  if (!formatted) return 0

  return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0
}
