function arredondarDinheiro(valor) {
  return Math.round(Number(valor) * 100) / 100
}

module.exports = {
  arredondarDinheiro,
}
