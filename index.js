const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('type', (req, res) => { return JSON.stringify(req.body) })

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':type :method :url :response-time'))

let note = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const genId = () => {
  const maxId = note.length > 0 ? Math.max(...note.map(note => note.id)) : 0

  return maxId + 1;
}

const dateTime = () => {
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();
 
  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();
  
  var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return dateTime
}

app.get('/api/persons', (req, resp) => {
    resp.json(note)
})

app.get('/info', (req, resp) =>{
  resp.send(`<h1>Phonebook has info for ${note.length} people</h1>
  <h1> ${dateTime()}</h1>`)
})

app.get('/api/persons/:id' , (req,resp) => {
  id = Number(req.params.id)
  const prs = note.find(note => note.id === id) 
  resp.json(prs)
})

app.delete('/api/persons/:id', (req,resp) => {
  id = Number(req.params.id)
  note = note.filter(note => note.id !== id)

  resp.status(204).end()
})

app.post('/api/persons', (req, resp) => {
  const body = req.body
 
  if (!body.name || !body.number) {
    return resp.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  
  const check = note.every(note => note.name !== body.name)
  if(!check) {
    return resp.status(400).json({ 
      error: 'name already exist' 
    })
  }

  const newPrs = {
    "id": genId(),
    "name": body.name, 
    "number": body.number
  }

  note = note.concat(newPrs)

  resp.json(note)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})