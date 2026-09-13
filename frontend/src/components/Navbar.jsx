import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext.jsx'
import LoginModal from './LoginModal.jsx'
import './Navbar.css'

const Navbar = ({
  logo = 'CodeMentorAI',
  tagline = 'Your AI-powered coding mentor',
  navItems = [],
  showThemeToggle = true,
  showUserMenu = false,
  user = null,
  onLogin,
  onLogout,
  className = '',
  ...props
}) => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin()
    } else {
      setIsLoginModalOpen(true)
    }
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  return (
    <nav className={`navbar ${className}`} {...props}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h1 className="navbar-logo">{logo}</h1>
          {tagline && <p className="navbar-tagline">{tagline}</p>}
        </div>

        <div className={`navbar-nav ${isMobileMenuOpen ? 'navbar-nav--open' : ''}`}>
          <ul className="navbar-menu">
            {navItems.map((item, index) => (
              <li key={index} className="navbar-item">
                {item.href?.startsWith('/') ? (
                  <Link
                    to={item.href}
                    className="navbar-link"
                    onClick={() => {
                      item.onClick?.()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.icon && <span className="navbar-link-icon">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="navbar-link"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault()
                        item.onClick()
                      }
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {item.icon && <span className="navbar-link-icon">{item.icon}</span>}
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-actions">
          {showThemeToggle && (
            <button
              className="navbar-action navbar-action--theme"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          {showUserMenu && (
            <div className="navbar-user">
              {user ? (
                <button
                  className="navbar-action navbar-action--user"
                  onClick={toggleUserMenu}
                >
                  <span className="navbar-user-name">{user.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              ) : (
                <button className="navbar-action navbar-action--login" onClick={handleLoginClick}>
                  <span className="navbar-login-text">Login</span>
                </button>
              )}

              {isUserMenuOpen && user && (
                <div className="navbar-dropdown">
                  <button className="navbar-dropdown-item" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="navbar-action navbar-action--mobile"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  )
}

export default Navbar
