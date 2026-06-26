const express = require('express')
const simulacaoController = require('../controllers/simulacaoController')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.post('/', asyncHandler(simulacaoController.simular))

module.exports = router
