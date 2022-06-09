require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contacts')
morgan.token('type', (req, res) => { return JSON.stringify(req.body) })

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':type :method :url :response-time'))



const dateTime = () => {
  var date_ob = new Date()
  var day = ('0' + date_ob.getDate()).slice(-2)
  var month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
  var year = date_ob.getFullYear()
  var hours = date_ob.getHours()
  var minutes = date_ob.getMinutes()
  var seconds = date_ob.getSeconds()
  var dateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return dateTime
}

app.get('/api/persons', (req, resp) => {
  Contact.find({}).then(notes => {
    resp.json(notes)
  })
})

app.get('/info', (req, resp) => {
  Contact.collection.count({})
    .then(res => {
      resp.send(`<h1>Phonebook has info for ${res} people</h1>
      <h1> ${dateTime()}</h1>`)
    })
})

app.get('/api/persons/:id' , (req, resp, next) => {
  Contact.findById(req.params.id).then(note => {
    if(note) {
      resp.json(note)
    } else {
      resp.status(404).end()
    }
  })
    .catch(error => { next(error) })
})

app.delete('/api/persons/:id', (req,resp) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      resp.status(204).end()
    })
    .catch(error => console.log(error))
})

app.post('/api/persons', (req, resp, next) => {
  const body = req.body

  const newPrs = new Contact ({
    'name': body.name,
    'number': body.number
  })

  newPrs.save()
    .then(saveCont => {
      resp.json(saveCont)
    })
    .catch(error => { next(error) })

})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(upd => {
      res.json(upd)
    })
    .catch(error => { next(error) })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})