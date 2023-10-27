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
    user: 'adamadiouf2017@gmail.com', // Your Gmail address
    pass: process.env.EMAIL_PASSPORT,
  },
})

exports.handler = async (event, context, cb) => {
  try {
    // Parse the form data from the event object (modify this part based on your form submission)
    const formData = JSON.parse(event.body)
    const { name, email, date, time, guests, phoneNumber } = formData

    // Check if 'email' is a valid recipient email address
    if (email && isValidEmail(email)) {
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'khadiscuisine1@gmail.com ',
        subject: 'Your Subject Here',
        text: `Hello I'am ${name},\n\nYour reservation details:\nDate: ${date}\nTime: ${time}\nMessage: \nGuests: ${guests}\nPhoneNumber: ${phoneNumber}\n`,
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

    // You can choose to save the form data to Airtable here if needed
    // Example: await airtable.create({ fields: { name, email, date, time, guests, status } });

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
