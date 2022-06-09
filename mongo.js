const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.xeqfx5u.mongodb.net/?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
  name: String,
  number: String 
})

const Contact = mongoose.model('Contact', contactSchema)

mongoose .connect(url)
  .then(() => {
    console.log('connected')

    const contact = new Contact({
      name: process.argv[3],
      number: process.argv[4]
    })

    return contact.save()})
  .then(() => {
    Contact.find({})
      .then(res => {
        res.forEach(cnt => console.log(cnt))
        return mongoose.connection.close()})})
  .catch((err) => console.log(err))