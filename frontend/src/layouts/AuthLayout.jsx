import React from 'react'
import './AuthLayout.css'
import { Link } from 'react-router-dom'

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <h1>CodeMentorAI</h1>
            <p>Your AI-powered coding mentor</p>
          </Link>
        </div>
        
        <div className="auth-content">
          <div className="auth-card">
            {title && <h2 className="auth-title">{title}</h2>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>
        </div>

        <div className="auth-footer">
          <p>&copy; 2026 CodeMentorAI. MCA Academic Project.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
