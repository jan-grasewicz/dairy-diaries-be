const express = require('express')
const app = express()
const PORT = 8080

app.use(express.json())

app.listen(PORT, () => console.log(`live on port: ${PORT}`))

app.get('/test', (req, res) => {
  res.status(200).send({ message: 'hello' })
})
