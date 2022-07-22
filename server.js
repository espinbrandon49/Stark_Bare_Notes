const express = require('express')
const path = require('path')
const fs = require('fs')

const PORT = 3001

// npm package is a web framework for node
const app = express()

// server equipped to read json format
app.use(express.json())
// server equipped to read urls
app.use(express.urlencoded({ extended: true }))

// access everything in the 'public folder'
app.use(express.static('public'))

// access/transfer? the index file to the internet (through PORT?)
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
)



























// Binds and listens for connections on PORT 3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)