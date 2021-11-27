const express = require('express')
const { google } = require('googleapis')

const app = express()

app.use(express.json())

app.listen(process.env.PORT, () => console.log(`live on port: ${process.env.PORT}`))

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
