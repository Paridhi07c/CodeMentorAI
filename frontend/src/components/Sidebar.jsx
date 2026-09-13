import React, { useState } from 'react'
import './Sidebar.css'

const Sidebar = ({
  isOpen,
  onClose,
  position = 'left',
  width = '300px',
  children,
  showOverlay = true,
  closeOnOverlayClick = true,
  className = '',
  ...props
}) => {
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const sidebarClasses = [
    'sidebar',
    `sidebar--${position}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <>
      {showOverlay && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
        />
      )}
      <aside
        className={sidebarClasses}
        style={{ width }}
        {...props}
      >
        <div className="sidebar-header">
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="sidebar-content">
          {children}
        </div>
      </aside>
    </>
  )
}

export const SidebarItem = ({ icon, label, active = false, onClick, href }) => {
  const itemClasses = [
    'sidebar-item',
    active && 'sidebar-item--active'
  ].filter(Boolean).join(' ')

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <a
      href={href}
      className={itemClasses}
      onClick={handleClick}
    >
      {icon && <span className="sidebar-item-icon">{icon}</span>}
      <span className="sidebar-item-label">{label}</span>
    </a>
  )
}

export const SidebarSection = ({ title, children }) => (
  <div className="sidebar-section">
    {title && <h4 className="sidebar-section-title">{title}</h4>}
    <div className="sidebar-section-content">
      {children}
    </div>
  </div>
)

export default Sidebar
