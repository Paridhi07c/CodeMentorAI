import React from 'react'
import './ProgressBar.css'

const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  showPercentage = false,
  label,
  animated = true,
  striped = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const progressClasses = [
    'progress',
    `progress--${size}`,
    `progress--${variant}`,
    animated && 'progress--animated',
    striped && 'progress--striped',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={progressClasses} {...props}>
      {(showLabel || label) && (
        <div className="progress-label">
          <span className="progress-label-text">{label || 'Progress'}</span>
          {showPercentage && (
            <span className="progress-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

export const CircularProgressBar = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  showPercentage = true,
  label,
  variant = 'default',
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const circleClasses = [
    'circular-progress',
    `circular-progress--${variant}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={circleClasses} {...props}>
      <svg
        width={size}
        height={size}
        className="circular-progress-svg"
      >
        <circle
          className="circular-progress-track"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="circular-progress-fill"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      {(showLabel || showPercentage) && (
        <div className="circular-progress-content">
          {showPercentage && (
            <span className="circular-progress-percentage">
              {Math.round(percentage)}%
            </span>
          )}
          {showLabel && label && (
            <span className="circular-progress-label">{label}</span>
          )}
        </div>
      )}
    </div>
  )
}

export const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="step-progress">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isPending = index > currentStep

        return (
          <div key={index} className="step-progress-item">
            <div
              className={`step-progress-circle ${
                isCompleted ? 'step-progress-circle--completed' : ''
              } ${
                isCurrent ? 'step-progress-circle--current' : ''
              } ${
                isPending ? 'step-progress-circle--pending' : ''
              }`}
            >
              {isCompleted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`step-progress-label ${
                isCurrent ? 'step-progress-label--current' : ''
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`step-progress-line ${
                  isCompleted ? 'step-progress-line--completed' : ''
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
