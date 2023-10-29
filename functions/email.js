const nodemailer = require('nodemailer')

exports.handler = async (event, context, cb) => {
  const method = event.httpMethod

  if (method !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST requests allowed',
    }
  }

  const { name, email, subject, message } = JSON.parse(event.body)

  if (!name || !email || !subject || !message) {
    return { statusCode: 400, body: 'Please provide all values' }
  }

  // Set up nodemailer with the transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASSPORT,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_EMAIL, // Your email
    to: process.env.EMAIL_EMAIL, // Your email where you want to receive the emails
    subject: `Contact form submission from ${name}: ${subject}`,
    text: `Message from: ${email}\n\n${message}`,
  }
  try {
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      body: 'Email sent successfully',
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `Failed to send email: ${error.message}`,
    }
  }
}
