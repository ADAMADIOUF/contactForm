const dotenv = require('dotenv')
dotenv.config()
console.log('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY)
console.log('AIRTABLE_BASE:', process.env.AIRTABLE_BASE)
console.log('AIRTABLE_TABLE:', process.env.AIRTABLE_TABLE)

const Airtable = require('airtable-node')
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table(process.env.AIRTABLE_TABLE)

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASSPORT,
  },
})

exports.handler = async (event, context, cb) => {
  try {
    const formData = JSON.parse(event.body)
    const { country, name, email, phoneNumber, titles, totalPrice } = formData

    // Check if 'email' is a valid recipient email address
    if (email && isValidEmail(email)) {
      // Check if 'titles' is defined before calling 'join'
      const titlesText = titles ? titles.join(', ') : '' // Join titles if defined, otherwise set to an empty string

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Subject Here',
        text: `Hello I'm ${name} ,\n\nton commande \nPays: ${country}\nMessage: ${phoneNumber}\Nom du produits: ${titlesText}\nPrix Total: ${totalPrice}CFA\n`,
      }

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error)
        } else {
          console.log('Email sent:', info.response)
        }
      })
    } else {
      console.log('Invalid or missing email address')
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: 'There was an error',
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
