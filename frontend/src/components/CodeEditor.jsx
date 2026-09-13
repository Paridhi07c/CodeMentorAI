import React, { useRef, useEffect } from 'react'
import Button from './Button.jsx'
import './CodeEditor.css'

const LANGUAGES = ['JavaScript', 'Python', 'SQL']

const CodeEditor = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onReset,
  onRun,
  isRunning = false,
  supportedLanguages = LANGUAGES,
}) => {
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)

  const lines = code.split('\n')
  const lineCount = Math.max(lines.length, 1)

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      onChange(newCode)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }

  useEffect(() => {
    handleScroll()
  }, [code])

  return (
    <div className="code-editor">
      <div className="code-editor-toolbar">
        <div className="code-editor-toolbar-left">
          <select
            className="code-editor-lang"
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
          >
            {supportedLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <span className="code-editor-filename">
            solution.{language === 'JavaScript' ? 'js' : language === 'Python' ? 'py' : 'sql'}
          </span>
        </div>
        <div className="code-editor-toolbar-right">
          <Button variant="ghost" size="sm" onClick={onReset} disabled={isRunning}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={onRun} loading={isRunning} disabled={isRunning}>
            Run Code
          </Button>
        </div>
      </div>

      <div className="code-editor-body">
        <div className="code-editor-lines" ref={lineNumbersRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="code-editor-line-num">{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="code-editor-textarea"
          value={code}
          onChange={e => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          disabled={isRunning}
        />
      </div>
    </div>
  )
}

export default CodeEditor
