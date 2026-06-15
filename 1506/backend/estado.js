// Estado global do processo. Reiniciar o servidor zera tudo.
const estado = {
  saldo: 0,
  contadorDataprev: 0,   // incrementa a cada chamada; par = sucesso, ímpar = erro
  contratos: [],
  contadorContrato: 0,
  ultimoTokenDataprev: null,
}

module.exports = estado
