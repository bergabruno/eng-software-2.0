const ERROS_DATAPREV = [
  'sem_margem',
  'sem_dinheiro_simular',
  'sem_dinheiro_contratar',
]

const MENSAGENS_ERRO_DATAPREV = {
  sem_margem: 'Cliente não possui margem consignável ou está com bloqueio na Dataprev.',
  sem_dinheiro_simular: 'Cliente não possui recursos disponíveis para simulação na Dataprev.',
  sem_dinheiro_contratar: 'Cliente não possui recursos disponíveis para contratação na Dataprev.',
}

module.exports = {
  ERROS_DATAPREV,
  MENSAGENS_ERRO_DATAPREV,
}
