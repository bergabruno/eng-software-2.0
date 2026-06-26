const express = require('express')
const contratacaoController = require('../controllers/contratacaoController')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.post('/', asyncHandler(contratacaoController.contratar))

module.exports = router
