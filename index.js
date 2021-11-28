const express = require('express')
const { google } = require('googleapis')

const app = express()

app.use(express.json())

app.get('/test', async (req, res) => {
  console.log('sheet', process.env.SHEET_ID)
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const sheetsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A2:A10',
    majorDimension: 'COLUMNS',
  })

  res.status(200).send({ data: sheetsRes })
})

// fetch topics with their metadata
app.get('/topics', (req, res) => {
  res.status(200).send('WIP')
})

// fetch topic elements list
app.get('/elements/:elements_list_id', (req, res) => {
  res.status(200).send(`WIP, ${req.params.elements_list_id}`)
})

// save new element
app.post('/elements/:elements_list_id', (req, res) => {
  console.log('> ~ req', req)
  res.status(200).send(`WIP, ${req.params.elements_list_id}, ${req.body.data}`)
})

// fetch topic entries list
app.get('/entries/:entries_list_id', (req, res) => {
  res.status(200).send(`WIP, ${req.params.entries_list_id}`)
})

// save new entry
app.post('/entries/:entries_list_id', (req, res) => {
  res.status(200).send(`WIP, ${req.params.entries_list_id}, ${req.body.data}`)
})

app.listen(process.env.PORT, () => console.log(`live on port: ${process.env.PORT}`))
