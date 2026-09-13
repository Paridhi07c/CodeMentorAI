import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Modal from './Modal.jsx'
import Button from './Button.jsx'
import Input from './Input.jsx'
import { ErrorInline } from './Error.jsx'
import './LoginModal.css'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LoginModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false })
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const resetForm = () => {
    setError('')
    setLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginData.email, loginData.password, loginData.rememberMe)
      handleClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register(signupData.name, signupData.email, signupData.password, signupData.confirmPassword)
      handleClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      showCloseButton={true}
      className="login-modal"
    >
      <div className="login-modal-content">
        <div className="login-modal-header">
          <h2 className="login-modal-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="login-modal-subtitle">
            {mode === 'login'
              ? 'Sign in to continue your coding journey'
              : 'Start learning with your AI mentor'}
          </p>
        </div>

        <div className="login-modal-tabs">
          <button
            type="button"
            className={`login-modal-tab ${mode === 'login' ? 'login-modal-tab--active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`login-modal-tab ${mode === 'signup' ? 'login-modal-tab--active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="login-modal-form">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <div className="login-modal-options">
              <label className="login-modal-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={loginData.rememberMe}
                  onChange={handleLoginChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="login-modal-link" onClick={handleClose}>
                Forgot password?
              </Link>
            </div>
            {error && <ErrorInline message={error} />}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="login-modal-form">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              required
            />
            {error && <ErrorInline message={error} />}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>
        )}

        <div className="login-modal-divider">
          <span>or continue with</span>
        </div>

        <div className="login-modal-social">
          <button type="button" className="login-modal-social-btn">
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button type="button" className="login-modal-social-btn">
            <GitHubIcon />
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal
