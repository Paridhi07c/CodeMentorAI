import React from 'react'
import './Loading.css'

const Loading = ({
  size = 'md',
  text,
  fullScreen = false,
  overlay = false,
  className = '',
  ...props
}) => {
  const loaderClasses = [
    'loading',
    `loading--${size}`,
    fullScreen && 'loading--fullscreen',
    overlay && 'loading--overlay',
    className
  ].filter(Boolean).join(' ')

  const content = (
    <div className={loaderClasses} role="status" aria-live="polite" aria-busy="true" {...props}>
      <div className="loading-spinner" aria-hidden="true">
        <div className="loading-spinner-circle"></div>
        <div className="loading-spinner-circle"></div>
        <div className="loading-spinner-circle"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
      {!text && <span className="loading-sr-only">Loading...</span>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    )
  }

  return content
}

export const LoadingDots = ({ size = 'md', className = '' }) => {
  const dotsClasses = [
    'loading-dots',
    `loading-dots--${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={dotsClasses}>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
      <div className="loading-dot"></div>
    </div>
  )
}

export const LoadingBar = ({ width = '100%', height = '4px', className = '' }) => {
  const barClasses = [
    'loading-bar',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={barClasses} style={{ width, height }}>
      <div className="loading-bar-progress"></div>
    </div>
  )
}

export const Skeleton = ({ width = '100%', height = '20px', className = '', variant = 'default' }) => {
  const skeletonClasses = [
    'skeleton',
    `skeleton--${variant}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={skeletonClasses} style={{ width, height }} />
  )
}

export default Loading
