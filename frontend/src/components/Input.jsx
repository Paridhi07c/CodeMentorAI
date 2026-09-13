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

  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon--left">{icon}</span>
        )}
        <input
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon--right">{icon}</span>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

export default Input
