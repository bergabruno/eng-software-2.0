const express = require('express')
const router = express.Router()
const estado = require('../estado')

router.get('/saldo', (req, res) => {
  res.json({ saldo: estado.saldo })
})

module.exports = router
