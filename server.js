const express = require('express')
const path = require('path')
const fs = require('fs')
let notes = require('./db/db.json')
const uuid = require('./helpers/uuid')

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// access the front-end files
app.use(express.static('public'))

// create HTML GET route to return index.html file from public
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
)

// create HTML GET route to return the `notes.html` file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

//GET NOTES
// create GET route to read the `db.json` file and return saved notes as JSON
app.get('/api/notes', (req, res) => {
  // send a message to the client

  //msg 1: notes as a console.log in terminal
  console.log(notes)

  //msg 2: as a json format for the index.js
  res.json(notes)

  console.info(`${req.method} request received to get notes`)
})

//POST A NOTE
app.post('/api/notes', (req, res) => {
  //1) log that a post request (new note) was received
  console.info(`${req.method} request received to add a new note`)

  //2) save the note on the request body 
    //Destructure assignment for the items in the req.body
  const { title, text } = req.body;

    //If all the parameters are present
  if (title && text) {
    //variable for the new note
    const newNote = {
      title,
      text,
      id: uuid(),
    }

  //3) Add new note to the db.json file
    //retrieve the current notes file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
      //if error in retrieval
      if (err) {
        console.error(err)
      } else {
        //convert string into JSON object
        const parsedNotes = JSON.parse(data)
        //adds the new note
        parsedNotes.push(newNote)
        //saves the object with the new note as the current notes
        notes = parsedNotes
    //rewrite the notes file with the new note added
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully added a new note!')
        )
      }
    });

//4) return the new note to the client
    const response = {
      status: 'success',
      body: newNote,
    }
    res.json(response);
  } else {
    //throws err if the note did not post
    res.json('Error in posting note')
  }
})

//* DELETE A NOTE
app.delete('/api/notes/:id', async (req, res) => {
  //defines target to delete
  const deleteId = req.params.id
  //validates delete request
  console.info(`${req.method} request received to delete a note`)
  //iterates through each note from db/db.json
  await notes.map((note, index) => {
    if (deleteId == note.id) {
      //removes targeted note 
      notes.splice(index, 1)
    }
  })
  //writes new db/db.json with an updated object 
  fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
    if (err) throw err;
    res.json(notes)
  })
})

// Binds and listens for connections on PORT
app.listen(PORT, () =>
  console.info(`App listening at http://localhost:${PORT}`)
)