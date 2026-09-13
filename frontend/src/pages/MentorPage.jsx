import React, { useState, useRef, useEffect, useCallback } from 'react'
import AppLayout from '../layouts/AppLayout.jsx'
import Button from '../components/Button.jsx'
import MarkdownMessage from '../components/MarkdownMessage.jsx'
import { streamGeminiChat } from '../services/geminiService.js'
import './MentorPage.css'

const QUICK_PROMPTS = [
  { label: 'Explain this code', prompt: 'Can you explain what this code does step by step?' },
  { label: 'Find bugs', prompt: 'Help me find bugs in my React component code' },
  { label: 'Write a Python script', prompt: 'Write a Python script to analyze a CSV file' },
  { label: 'Best practices', prompt: 'What are best practices for writing clean JavaScript?' },
]

const INITIAL_SESSIONS = [
  {
    id: '1',
    title: 'Python Basics',
    messages: [
      { id: 'm1', role: 'user', content: 'What is a list comprehension in Python?' },
      {
        id: 'm2',
        role: 'assistant',
        content: `A **list comprehension** is a concise way to create lists in Python.

**Syntax:** \`[expression for item in iterable if condition]\`

\`\`\`python
# Traditional loop
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension
squares = [x ** 2 for x in range(10)]

# With filter
evens = [x for x in range(20) if x % 2 == 0]
\`\`\`

List comprehensions are faster and more readable for simple transformations!`,
      },
    ],
  },
  {
    id: '2',
    title: 'Debug React State',
    messages: [
      { id: 'm3', role: 'user', content: 'My React state is not updating when I click the button' },
      {
        id: 'm4',
        role: 'assistant',
        content: `This is a common issue! The most likely cause is **direct state mutation**.

\`\`\`javascript
// Wrong — mutating state directly
const handleClick = () => {
  items.push(newItem);
  setItems(items);
};

// Correct — create a new array
const handleClick = () => {
  setItems([...items, newItem]);
};
\`\`\`

React compares state by reference, so mutating the same object won't trigger a re-render.`,
      },
    ],
  },
  {
    id: '3',
    title: 'New Session',
    messages: [],
  },
]

const MentorPage = () => {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState('1')
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const messagesEndRef = useRef(null)
  const cancelStreamRef = useRef(null)

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0]

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeSession?.messages, streamingContent, scrollToBottom])

  useEffect(() => {
    return () => cancelStreamRef.current?.()
  }, [])

  const updateSessionMessages = (sessionId, updater) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, messages: updater(s.messages) } : s
      )
    )
  }

  const handleSend = async (text) => {
    const message = (text || input).trim()
    if (!message || isStreaming) return

    setErrorMessage('')
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: message }
    const updatedMessages = [...activeSession.messages, userMsg]

    updateSessionMessages(activeSessionId, () => updatedMessages)
    setInput('')

    if (activeSession.messages.length === 0) {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, title: message.slice(0, 30) + (message.length > 30 ? '…' : '') }
            : s
        )
      )
    }

    setIsStreaming(true)
    setStreamingContent('')

    cancelStreamRef.current = await streamGeminiChat(
      updatedMessages,
      (partial) => {
        setStreamingContent(partial)
      },
      (finalResponse) => {
        const aiMsg = { id: `a-${Date.now()}`, role: 'assistant', content: finalResponse }
        updateSessionMessages(activeSessionId, msgs => [...msgs, aiMsg])
        setStreamingContent('')
        setIsStreaming(false)
      },
      (error) => {
        setErrorMessage(error.message)
        setIsStreaming(false)
        setStreamingContent('')
      }
    )
  }

  const handleNewChat = () => {
    if (isStreaming) return
    const newSession = {
      id: `s-${Date.now()}`,
      title: 'New Chat',
      messages: [],
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setErrorMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AppLayout>
      <div className="mentor-page">
        <aside className="mentor-sessions">
          <div className="mentor-sessions-header">
            <h2>Chat History</h2>
            <button className="mentor-new-chat" onClick={handleNewChat} disabled={isStreaming}>
              + New
            </button>
          </div>
          <ul className="mentor-session-list">
            {sessions.map(session => (
              <li key={session.id}>
                <button
                  className={`mentor-session-item ${session.id === activeSessionId ? 'mentor-session-item--active' : ''}`}
                  onClick={() => !isStreaming && setActiveSessionId(session.id)}
                  disabled={isStreaming}
                >
                  <span className="mentor-session-icon">💬</span>
                  <span className="mentor-session-title">{session.title}</span>
                  <span className="mentor-session-count">{session.messages.length}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mentor-chat">
          <div className="mentor-chat-header">
            <div>
              <h1>{activeSession.title}</h1>
              <p>Ask anything about programming — your AI mentor is here to help</p>
            </div>
            <div className="mentor-status">
              <span className={`mentor-status-dot ${isStreaming ? 'mentor-status-dot--active' : ''}`} />
              {isStreaming ? 'Thinking…' : 'Ready'}
            </div>
          </div>

          <div className="mentor-messages">
            {activeSession.messages.length === 0 && !isStreaming && (
              <div className="mentor-empty">
                <div className="mentor-empty-icon">🤖</div>
                <h3>Start a conversation</h3>
                <p>Ask a coding question or pick a quick prompt below</p>
              </div>
            )}

            {activeSession.messages.map(msg => (
              <div key={msg.id} className={`mentor-message mentor-message--${msg.role}`}>
                <div className="mentor-message-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="mentor-message-body">
                  {msg.role === 'assistant' ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="mentor-message mentor-message--assistant">
                <div className="mentor-message-avatar">🤖</div>
                <div className="mentor-message-body">
                  {streamingContent ? (
                    <MarkdownMessage content={streamingContent} />
                  ) : (
                    <div className="mentor-typing">
                      <span /><span /><span />
                    </div>
                  )}
                </div>
              </div>
            )}

            {errorMessage && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#f87171', margin: '8px 0' }}>
                ⚠️ {errorMessage}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="mentor-input-area">
            <div className="mentor-quick-prompts">
              {QUICK_PROMPTS.map(({ label, prompt }) => (
                <button
                  key={label}
                  className="mentor-prompt-chip"
                  onClick={() => handleSend(prompt)}
                  disabled={isStreaming}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mentor-input-bar">
              <textarea
                className="mentor-input"
                placeholder="Ask your AI mentor anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                rows={1}
              />
              <Button
                variant="primary"
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                loading={isStreaming}
                className="mentor-send-btn"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default MentorPage
