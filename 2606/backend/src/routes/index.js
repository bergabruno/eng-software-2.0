const express = require('express')
const authRoutes = require('./authRoutes')
const contaRoutes = require('./contaRoutes')
const simulacaoRoutes = require('./simulacaoRoutes')
const dataprevRoutes = require('./dataprevRoutes')
const contratacaoRoutes = require('./contratacaoRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/conta', contaRoutes)
router.use('/simulacao', simulacaoRoutes)
router.use('/dataprev', dataprevRoutes)
router.use('/contratacao', contratacaoRoutes)

module.exports = router
