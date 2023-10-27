import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Message sent successfully!')
        setFormData({
          name: '',
          emailName: '',
          message: '',
        })
      } else {
        const errorData = await response.json()
        setMessage(`Failed to send message. ${errorData.message || ''}`)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    }

    setIsSubmitting(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={formData.emailName}
          onChange={(e) =>
            setFormData({ ...formData, emailName: e.target.value })
          }
          required
        />
        <textarea
          placeholder='Message'
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
        />
        <button type='submit' disabled={isSubmitting}>
          Send Message
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Contact
