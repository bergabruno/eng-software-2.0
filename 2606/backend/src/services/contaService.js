const memoryRepository = require('../repositories/memoryRepository')

function obterSaldo() {
  return {
    saldo: memoryRepository.obterSaldo(),
  }
}

module.exports = {
  obterSaldo,
}
