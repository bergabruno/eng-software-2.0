const { createApp } = require('./src/app')
const { PORT } = require('./src/config/env')

const app = createApp()

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})
