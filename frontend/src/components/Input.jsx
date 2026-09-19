import React from 'react'
import './Input.css'

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  ...props
}) => {
  const inputClasses = [
    'input',
    error && 'input--error',
    disabled && 'input--disabled',
    icon && 'input--with-icon',
    iconPosition === 'right' && 'input--icon-right',
    className
  ].filter(Boolean).join(' ')

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e)
    }
  }

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-label="required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon--left" aria-hidden="true">{icon}</span>
        )}
        <input
          id={inputId}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon--right" aria-hidden="true">{icon}</span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
