const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')})
  .catch((error) => {
    console.log('error connecting to Mongo: ', error.message)})

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        if(v.includes('-')){  return /\d{3}-/.test(v) || /\d{2}-/.test(v)}
        else {
          return true
        }
      },
      message: props => `${props.value} is not a valid phone number!` },
    minLength: 8,
    required: true } })

contactSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v} })

module.exports = mongoose.model('Contact', contactSchema)