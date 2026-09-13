import React, { useEffect, useState } from 'react'
import './Toast.css'

const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
  showClose = true,
  icon,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    )
  }

  const toastClasses = [
    'toast',
    `toast--${type}`,
    `toast--${position}`,
    !isVisible && 'toast--hidden',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={toastClasses} {...props}>
      <div className="toast-icon">
        {icon || icons[type]}
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      {showClose && (
        <button
          className="toast-close"
          onClick={handleClose}
          aria-label="Close toast"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}

export const ToastContainer = ({ toasts, position = 'top-right', onRemove }) => {
  const containerClasses = [
    'toast-container',
    `toast-container--${position}`
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now()
    const toast = {
      id,
      message,
      type,
      ...options
    }
    setToasts((prev) => [...prev, toast])
    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message, options) => addToast(message, 'success', options)
  const error = (message, options) => addToast(message, 'error', options)
  const warning = (message, options) => addToast(message, 'warning', options)
  const info = (message, options) => addToast(message, 'info', options)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

export default Toast
