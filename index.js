const express = require('express')
const { google } = require('googleapis')

const app = express()

app.use(express.json())

const getSheets = async () => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

// fetch topics with their metadata
app.get('/topics', async (req, res) => {
  const sheets = await getSheets()
  const sheetsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'topics!A1:E',
  })

  const data = sheetsRes.data.values?.reduce((acc, cur, i, arr) => {
    if (i === 0) return acc
    const rowData = cur.reduce((accu, curr, idx) => ({ ...accu, [arr[0][idx]]: curr }), {})
    return [...acc, rowData]
  }, [])

  res.status(200).send({ data })
})

// fetch topic elements list
app.get('/elements/:elements_list_id', async (req, res) => {
  res.status(200).send(`WIP, ${req.params.elements_list_id}`)
})

// save new element
app.post('/elements/:elements_list_id', async (req, res) => {
  console.log('> ~ req', req)
  res.status(200).send(`WIP, ${req.params.elements_list_id}, ${req.body.data}`)
})

// fetch topic entries list
app.get('/entries/:entries_list_id', async (req, res) => {
  res.status(200).send(`WIP, ${req.params.entries_list_id}`)
})

// save new entry
app.post('/entries/:entries_list_id', async (req, res) => {
  res.status(200).send(`WIP, ${req.params.entries_list_id}, ${req.body.data}`)
})

app.listen(process.env.PORT, () => console.log(`live on port: ${process.env.PORT}`))
