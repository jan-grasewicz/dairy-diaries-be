const express = require('express')
const { google } = require('googleapis')
const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())

const readSheet = async (range) => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheetsService = google.sheets({ version: 'v4', auth })

  const sheetsRes = await sheetsService.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  })

  return sheetsRes
}

const appendData = async (range, values) => {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheetsService = google.sheets({ version: 'v4', auth })

  const sheetsRes = await sheetsService.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: 'RAW',
    resource: { values },
  })

  return sheetsRes
}

const getRowData = (arr) =>
  arr.reduce((acc, cur, i, arr) => {
    if (i === 0) return acc
    const rowData = cur.reduce((accu, curr, idx) => ({ ...accu, [arr[0][idx]]: curr }), {})
    return [...acc, rowData]
  }, [])

const getElementsValues = (data) => {
  if (Array.isArray(data)) {
    return data.map(({ name }) => [uuid(), name, new Date(), new Date()])
  }
  return [[uuid(), data.name, new Date(), new Date()]]
}

// fetch topics with their metadata
app.get('/topics', async (_req, res) => {
  try {
    const sheetsRes = await readSheet(`topics!A1:${process.env.TOPICS_LAST_COL}`)

    const data = getRowData(sheetsRes.data.values)

    res.status(200).send({ data })
  } catch (e) {
    res.status(e.code).send({ data: e.response.data.error })
  }
})

// fetch topic elements list
app.get('/elements/:elements_list_id', async (req, res) => {
  try {
    const sheetsRes = await readSheet(
      `${req.params.elements_list_id}!A1:${process.env.ELEMENTS_LAST_COL}`
    )

    const data = getRowData(sheetsRes.data.values)

    res.status(200).send({ data })
  } catch (e) {
    res.status(e.code).send({ data: e.response.data.error })
  }
})

// save new element
app.post('/elements/:elements_list_id', async (req, res) => {
  try {
    const values = getElementsValues(req.body.data)

    const sheetsRes = await appendData(
      `${req.params.elements_list_id}!A1:${process.env.ELEMENTS_LAST_COL}`,
      values
    )

    const { updatedRows, updatedColumns, updatedCells } = sheetsRes.data.updates

    res.status(200).send({ data: { updatedRows, updatedColumns, updatedCells } })
  } catch (e) {
    res.status(e.code).send({ data: e.response.data.error })
  }
})

// fetch topic entries list
app.get('/entries/:entries_list_id', async (req, res) => {
  try {
    const sheetsRes = await readSheet(
      `${req.params.entries_list_id}!A1:${process.env.ENTRIES_LAST_COL}`
    )

    const data = getRowData(sheetsRes.data.values)

    res.status(200).send({ data })
  } catch (e) {
    res.status(e.code).send({ data: e.response.data.error })
  }
})

// save new entry
app.post('/entries/:entries_list_id', async (req, res) => {
  res.status(200).send(`WIP, ${req.params.entries_list_id}, ${req.body.data}`)
})

app.listen(process.env.PORT, () => console.log(`live on port: ${process.env.PORT}`))
