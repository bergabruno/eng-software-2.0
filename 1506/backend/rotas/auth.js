const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  res.json({ ok: true, nome: 'Cliente FIAP' })
})

router.post('/logout', (req, res) => {
  res.json({ ok: true })
})

module.exports = router
