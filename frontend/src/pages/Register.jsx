import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import './Register.css'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { ErrorInline } from '../components/Error.jsx'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      )
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Start your coding journey today"
    >
      <form onSubmit={handleSubmit} className="register-form">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
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
          Create Account
        </Button>

        <div className="register-divider">
          <span>or</span>
        </div>

        <div className="register-social">
          <Button variant="secondary" fullWidth>
            Sign up with Google
          </Button>
          <Button variant="secondary" fullWidth>
            Sign up with GitHub
          </Button>
        </div>

        <p className="register-signin">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>

        <p className="register-terms">
          By creating an account, you agree to our{' '}
          <Link to="/terms">Terms of Service</Link> and{' '}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
