import React from 'react'
import './Card.css'

const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    hoverable && 'card--hoverable',
    clickable && 'card--clickable',
    className
  ].filter(Boolean).join(' ')

  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
