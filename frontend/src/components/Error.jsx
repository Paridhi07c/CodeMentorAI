import React from 'react'
import './Error.css'

const Error = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  variant = 'default',
  showRetry = false,
  onRetry,
  showHome = false,
  onHome,
  icon,
  className = '',
  ...props
}) => {
  const errorClasses = [
    'error',
    `error--${variant}`,
    className
  ].filter(Boolean).join(' ')

  const defaultIcon = (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )

  return (
    <div className={errorClasses} {...props}>
      <div className="error-icon">
        {icon || defaultIcon}
      </div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      <div className="error-actions">
        {showRetry && (
          <button className="error-button error-button--retry" onClick={onRetry}>
            Try Again
          </button>
        )}
        {showHome && (
          <button className="error-button error-button--home" onClick={onHome}>
            Go Home
          </button>
        )}
      </div>
    </div>
  )
}

export const ErrorInline = ({ message, onDismiss }) => (
  <div className="error-inline">
    <span className="error-inline-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </span>
    <span className="error-inline-message">{message}</span>
    {onDismiss && (
      <button className="error-inline-dismiss" onClick={onDismiss}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
)

export const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true)
      setError(error)
      console.error('Error caught by boundary:', error, errorInfo)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    if (fallback) {
      return fallback({ error, reset: () => setHasError(false) })
    }
    return (
      <Error
        title="Application Error"
        message="Something went wrong in the application. Please refresh the page."
        showRetry
        onRetry={() => setHasError(false)}
      />
    )
  }

  return children
}

export default Error
