import React from 'react'
import CodeBlock, { InlineCode } from './CodeBlock.jsx'
import './MarkdownMessage.css'

const parseInline = (text) => {
  const parts = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      parts.push(<InlineCode key={match.index}>{token.slice(1, -1)}</InlineCode>)
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length ? parts : [text]
}

const MarkdownMessage = ({ content }) => {
  if (!content) return null

  const blocks = []
  const lines = content.split('\n')
  let i = 0
  let blockKey = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'javascript'
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push(
        <CodeBlock
          key={blockKey++}
          code={codeLines.join('\n')}
          language={lang}
          showLineNumbers={true}
        />
      )
      i++
      continue
    }

    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      blocks.push(
        <p key={blockKey++} className="md-paragraph md-bold-line">
          <strong>{line.slice(2, -2)}</strong>
        </p>
      )
      i++
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items = []
      while (i < lines.length && (/^\d+\.\s/.test(lines[i]) || lines[i].trim() === '')) {
        if (/^\d+\.\s/.test(lines[i])) {
          items.push(
            <li key={i}>{parseInline(lines[i].replace(/^\d+\.\s/, ''))}</li>
          )
        }
        i++
      }
      blocks.push(<ol key={blockKey++} className="md-list">{items}</ol>)
      continue
    }

    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].trim() === '')) {
        if (lines[i].startsWith('- ')) {
          items.push(
            <li key={i}>{parseInline(lines[i].slice(2))}</li>
          )
        }
        i++
      }
      blocks.push(<ul key={blockKey++} className="md-list">{items}</ul>)
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    blocks.push(
      <p key={blockKey++} className="md-paragraph">
        {parseInline(line)}
      </p>
    )
    i++
  }

  return <div className="markdown-message">{blocks}</div>
}

export default MarkdownMessage
