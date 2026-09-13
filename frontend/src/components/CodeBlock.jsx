import React, { useState } from 'react'
import './CodeBlock.css'

const CodeBlock = ({
  code,
  language = 'javascript',
  title,
  showLineNumbers = true,
  showCopy = true,
  collapsible = false,
  className = '',
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const lines = code.split('\n')

  return (
    <div className={`code-block ${className}`} {...props}>
      {(title || showCopy || collapsible) && (
        <div className="code-block-header">
          {title && <span className="code-block-title">{title}</span>}
          <div className="code-block-actions">
            {collapsible && (
              <button
                className="code-block-action"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? 'Expand code' : 'Collapse code'}
              >
                {isCollapsed ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                )}
              </button>
            )}
            {showCopy && (
              <button
                className="code-block-action"
                onClick={handleCopy}
                aria-label={isCopied ? 'Copied!' : 'Copy code'}
              >
                {isCopied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="code-block-body">
        <div className="code-block-info">
          <span className="code-block-language">{language}</span>
        </div>
        <pre className={`code-block-content ${isCollapsed ? 'code-block-content--collapsed' : ''}`}>
          {showLineNumbers ? (
            <div className="code-block-with-lines">
              <div className="code-block-line-numbers">
                {lines.map((_, index) => (
                  <span key={index} className="code-block-line-number">
                    {index + 1}
                  </span>
                ))}
              </div>
              <code className="code-block-code">{code}</code>
            </div>
          ) : (
            <code className="code-block-code">{code}</code>
          )}
        </pre>
      </div>
    </div>
  )
}

export const InlineCode = ({ children, className = '' }) => (
  <code className={`inline-code ${className}`}>
    {children}
  </code>
)

export default CodeBlock
