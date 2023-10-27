const dotenv = require('dotenv')
dotenv.config()

const Airtable = require('airtable-node')
const nodemailer = require('nodemailer')

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table(process.env.AIRTABLE_TABLE)

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'adamadiouf2017@gmail.com',
    pass: process.env.EMAIL_PASSPORT,
  },
})

exports.handler = async (event, context, cb) => {
  try {
    const formData = JSON.parse(event.body)
    const {emailName, name, message } = formData

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'adamadiouf2017@gmail.com', // Replace with the email address you want to send to
      subject: 'Your Subject Here',
      text: `Hello I'am ${name},my emal: ${emailName}\n\nMessage: ${message}\n`,
    }

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error)
      } else {
        console.log('Email sent:', info.response)
      }
    })

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
