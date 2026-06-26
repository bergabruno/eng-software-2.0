const express = require('express')
const contaController = require('../controllers/contaController')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/saldo', asyncHandler(contaController.obterSaldo))

module.exports = router
