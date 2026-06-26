const express = require('express')
const dataprevController = require('../controllers/dataprevController')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.post('/validar', asyncHandler(dataprevController.validar))

module.exports = router
