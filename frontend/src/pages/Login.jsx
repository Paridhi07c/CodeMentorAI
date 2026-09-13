import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import './Login.css'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { ErrorInline } from '../components/Error.jsx'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData.email, formData.password, formData.rememberMe)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Welcome Back"
      subtitle="Sign in to continue your coding journey"
    >
      <form onSubmit={handleSubmit} className="login-form">
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="login-options">
          <label className="login-checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="login-forgot">
            Forgot password?
          </Link>
        </div>

        {error && <ErrorInline message={error} />}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Sign In
        </Button>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-social">
          <Button variant="secondary" fullWidth>
            Continue with Google
          </Button>
          <Button variant="secondary" fullWidth>
            Continue with GitHub
          </Button>
        </div>

        <p className="login-signup">
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
