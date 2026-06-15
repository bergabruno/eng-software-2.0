const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./rotas/auth'))
app.use('/api/conta', require('./rotas/conta'))
app.use('/api/simulacao', require('./rotas/simulacao'))
app.use('/api/dataprev', require('./rotas/dataprev'))
app.use('/api/contratacao', require('./rotas/contratacao'))

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'))
