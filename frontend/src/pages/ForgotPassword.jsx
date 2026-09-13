import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import './ForgotPassword.css'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { ErrorInline } from '../components/Error.jsx'
import Card from '../components/Card.jsx'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout 
        title="Check Your Email"
        subtitle="We've sent password reset instructions"
      >
        <Card className="forgot-success-card">
          <div className="forgot-success-icon">✉️</div>
          <h3>Email Sent!</h3>
          <p>
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <p className="forgot-success-info">
            Please check your email and follow the instructions to reset your password.
          </p>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
          <p className="forgot-resend">
            Didn't receive the email?{' '}
            <button 
              className="forgot-resend-link"
              onClick={() => {
                setSuccess(false)
                handleSubmit(new Event('submit'))
              }}
            >
              Resend
            </button>
          </p>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Forgot Password"
      subtitle="Reset your password to regain access"
    >
      <form onSubmit={handleSubmit} className="forgot-form">
        <p className="forgot-instructions">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
        />

        {error && <ErrorInline message={error} />}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Send Reset Instructions
        </Button>

        <p className="forgot-back">
          Remember your password?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
