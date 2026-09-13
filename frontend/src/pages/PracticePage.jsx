import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import AppLayout from '../layouts/AppLayout.jsx'
import CodeEditor from '../components/CodeEditor.jsx'
import { InlineCode } from '../components/CodeBlock.jsx'
import { PROBLEMS, DIFFICULTIES, LANGUAGES } from '../data/practiceProblems.js'
import { runCode } from '../utils/mockCodeRunner.js'
import { getPracticeHint, analyzeCodeComplexity } from '../services/geminiService.js'
import './PracticePage.css'

const difficultyClass = (d) => d.toLowerCase()
const STORAGE_KEY = 'codementor_solved_problems'

const PracticePage = () => {
  const [searchParams] = useSearchParams()
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [languageFilter, setLanguageFilter] = useState('All')
  const [activeProblemId, setActiveProblemId] = useState('two-sum')
  const [editorLanguage, setEditorLanguage] = useState('JavaScript')
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState(null)
  const [consoleOpen, setConsoleOpen] = useState(true)

  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [aiHint, setAiHint] = useState('')
  const [isHintLoading, setIsHintLoading] = useState(false)

  const [complexityAnalysis, setComplexityAnalysis] = useState(null)
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] = useState(false)

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(p => {
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false
      if (languageFilter !== 'All' && p.language !== languageFilter) return false
      return true
    })
  }, [difficultyFilter, languageFilter])

  const activeProblem = PROBLEMS.find(p => p.id === activeProblemId) || PROBLEMS[0]

  useEffect(() => {
    const paramId = searchParams.get('problem')
    if (paramId && PROBLEMS.find(p => p.id === paramId)) {
      setActiveProblemId(paramId)
    }
  }, [searchParams])

  useEffect(() => {
    setEditorLanguage(activeProblem.language)
    setCode(activeProblem.templates[activeProblem.language] || '')
    setRunResult(null)
    setAiHint('')
    setComplexityAnalysis(null)
  }, [activeProblemId, activeProblem.language, activeProblem.templates])

  const handleLanguageChange = (lang) => {
    setEditorLanguage(lang)
    setCode(activeProblem.templates[lang] || '')
    setRunResult(null)
    setAiHint('')
    setComplexityAnalysis(null)
  }

  const handleReset = () => {
    setCode(activeProblem.templates[editorLanguage] || '')
    setRunResult(null)
    setAiHint('')
    setComplexityAnalysis(null)
  }

  const markProblemSolved = (problemId) => {
    setSolvedProblems(prev => {
      if (prev.includes(problemId)) return prev
      const updated = [...prev, problemId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const handleRun = async () => {
    setIsRunning(true)
    setRunResult(null)
    setAiHint('')
    setComplexityAnalysis(null)
    setConsoleOpen(true)

    try {
      const result = await runCode(activeProblem, code, editorLanguage)
      setRunResult(result)

      if (result?.summary?.allPassed) {
        markProblemSolved(activeProblem.id)
      }
    } catch (err) {
      setRunResult({
        summary: { total: 1, passed: 0, allPassed: false, runtime: '0 ms' },
        results: [{
          input: 'Execution failed',
          expected: 'Execution completed',
          actual: null,
          passed: false,
          error: err.message
        }],
        logs: [`Client runner error: ${err.message}`]
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSelectProblem = (problem) => {
    setActiveProblemId(problem.id)
    setRunResult(null)
    setAiHint('')
    setComplexityAnalysis(null)
  }

  const handleGetHint = async () => {
    setIsHintLoading(true)
    const firstError = runResult?.results?.find(r => !r.passed)?.error || runResult?.logs?.[0] || null
    const hint = await getPracticeHint({
      problem: activeProblem,
      code,
      language: editorLanguage,
      error: firstError,
      testResults: runResult?.results || []
    })
    setAiHint(hint)
    setIsHintLoading(false)
  }

  const handleAnalyzeComplexity = async () => {
    setIsAnalyzingComplexity(true)
    const analysis = await analyzeCodeComplexity({
      problem: activeProblem,
      code,
      language: editorLanguage
    })
    setComplexityAnalysis(analysis)
    setIsAnalyzingComplexity(false)
  }

  const supportedLanguages = [activeProblem.language]

  return (
    <AppLayout>
      <div className="practice-page">
        <aside className="practice-sidebar">
          <div className="practice-sidebar-header">
            <h2>Problems</h2>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              {solvedProblems.length}/{PROBLEMS.length} Solved
            </span>
          </div>

          <div className="practice-filters">
            <div className="practice-filter-group">
              <label>Difficulty</label>
              <div className="practice-filter-chips">
                <button
                  className={`practice-filter-chip ${difficultyFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setDifficultyFilter('All')}
                >
                  All
                </button>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    className={`practice-filter-chip practice-filter-chip--${difficultyClass(d)} ${difficultyFilter === d ? 'active' : ''}`}
                    onClick={() => setDifficultyFilter(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="practice-filter-group">
              <label>Language</label>
              <div className="practice-filter-chips">
                <button
                  className={`practice-filter-chip ${languageFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setLanguageFilter('All')}
                >
                  All
                </button>
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    className={`practice-filter-chip ${languageFilter === l ? 'active' : ''}`}
                    onClick={() => setLanguageFilter(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ul className="practice-problem-list">
            {filteredProblems.map(problem => {
              const isSolved = solvedProblems.includes(problem.id)
              return (
                <li key={problem.id}>
                  <button
                    className={`practice-problem-item ${problem.id === activeProblemId ? 'active' : ''}`}
                    onClick={() => handleSelectProblem(problem)}
                  >
                    <div className="practice-problem-item-top">
                      <span className="practice-problem-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSolved && (
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                        )}
                        {problem.title}
                      </span>
                      <span className={`practice-difficulty-badge ${difficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <span className="practice-problem-lang">{problem.language}</span>
                  </button>
                </li>
              )
            })}
            {filteredProblems.length === 0 && (
              <li className="practice-no-results">No problems match your filters.</li>
            )}
          </ul>
        </aside>

        <div className="practice-main">
          <div className="practice-workspace">
            <div className="practice-problem-panel">
              <div className="practice-problem-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1>{activeProblem.title}</h1>
                  {solvedProblems.includes(activeProblem.id) && (
                    <span style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      ✓ Solved
                    </span>
                  )}
                </div>
                <span className={`practice-difficulty-badge ${difficultyClass(activeProblem.difficulty)}`}>
                  {activeProblem.difficulty}
                </span>
              </div>

              <div className="practice-problem-body">
                <section>
                  <h3>Description</h3>
                  {activeProblem.description.split('\n').map((line, i) => (
                    <p key={i}>{line.split(/(`[^`]+`)/).map((part, j) =>
                      part.startsWith('`') ? <InlineCode key={j}>{part.slice(1, -1)}</InlineCode> : part
                    )}</p>
                  ))}
                </section>

                <section>
                  <h3>Constraints</h3>
                  <ul>
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3>Test Cases</h3>
                  <div className="practice-test-cases">
                    {activeProblem.testCases.map((tc, i) => (
                      <div key={i} className="practice-test-case">
                        <div className="practice-test-case-label">Example {i + 1}</div>
                        <div className="practice-test-case-row">
                          <span className="practice-test-case-key">Input:</span>
                          <code>{tc.input}</code>
                        </div>
                        <div className="practice-test-case-row">
                          <span className="practice-test-case-key">Expected:</span>
                          <code>{typeof tc.expected === 'object' ? JSON.stringify(tc.expected) : String(tc.expected)}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="practice-editor-panel">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={editorLanguage}
                onLanguageChange={handleLanguageChange}
                onReset={handleReset}
                onRun={handleRun}
                isRunning={isRunning}
                supportedLanguages={supportedLanguages}
              />
            </div>
          </div>

          <div className={`practice-console ${consoleOpen ? 'open' : 'collapsed'}`}>
            <button
              className="practice-console-toggle"
              onClick={() => setConsoleOpen(!consoleOpen)}
            >
              <span className="practice-console-toggle-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Console
                {runResult && (
                  <span className={`practice-console-badge ${runResult.summary.allPassed ? 'passed' : 'failed'}`}>
                    {runResult.summary.passed}/{runResult.summary.total}
                  </span>
                )}
              </span>
              <svg
                className={`practice-console-chevron ${consoleOpen ? 'open' : ''}`}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {consoleOpen && (
              <div className="practice-console-body">
                {isRunning && (
                  <div className="practice-console-running">
                    <span className="practice-console-spinner" />
                    Running tests…
                  </div>
                )}

                {!isRunning && !runResult && (
                  <div className="practice-console-empty">
                    Click <strong>Run Code</strong> to execute your solution against sample test cases.
                  </div>
                )}

                {!isRunning && runResult && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className={`practice-console-summary ${runResult.summary.allPassed ? 'passed' : 'failed'}`}>
                          {runResult.summary.allPassed
                            ? `✓ All ${runResult.summary.total} test cases passed!`
                            : `✗ ${runResult.summary.passed}/${runResult.summary.total} test cases passed`}
                        </div>
                        {runResult.summary?.runtime && (
                          <span style={{
                            background: '#1e293b',
                            color: '#94a3b8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontFamily: 'monospace'
                          }}>
                            ⏱ {runResult.summary.runtime}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!runResult.summary.allPassed && (
                          <button
                            onClick={handleGetHint}
                            disabled={isHintLoading}
                            style={{
                              background: '#7c3aed',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: isHintLoading ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {isHintLoading ? 'Analyzing code…' : '💡 Ask AI Hint'}
                          </button>
                        )}

                        {runResult.summary.allPassed && (
                          <button
                            onClick={handleAnalyzeComplexity}
                            disabled={isAnalyzingComplexity}
                            style={{
                              background: '#059669',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              cursor: isAnalyzingComplexity ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            {isAnalyzingComplexity ? 'Calculating Big-O…' : '⚡ Analyze Complexity'}
                          </button>
                        )}
                      </div>
                    </div>

                    {complexityAnalysis && (
                      <div style={{
                        background: '#064e3b',
                        borderLeft: '4px solid #10b981',
                        padding: '14px 18px',
                        borderRadius: '0 8px 8px 0',
                        marginBottom: '16px',
                        color: '#ecfdf5',
                        fontSize: '0.92rem',
                        lineHeight: '1.5'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#a7f3d0' }}>
                            ⚡ Complexity & Code Review
                          </span>
                          <span style={{
                            background: '#047857',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontFamily: 'monospace',
                            fontWeight: 700
                          }}>
                            Time: {complexityAnalysis.timeComplexity}
                          </span>
                          <span style={{
                            background: '#047857',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontFamily: 'monospace',
                            fontWeight: 700
                          }}>
                            Space: {complexityAnalysis.spaceComplexity}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 8px 0' }}>{complexityAnalysis.explanation}</p>
                        {complexityAnalysis.optimizationTip && (
                          <div style={{ fontSize: '0.85rem', color: '#a7f3d0', fontStyle: 'italic' }}>
                            💡 Tip: {complexityAnalysis.optimizationTip}
                          </div>
                        )}
                      </div>
                    )}

                    {aiHint && (
                      <div style={{
                        background: '#2e1065',
                        borderLeft: '4px solid #a855f7',
                        padding: '14px 18px',
                        borderRadius: '0 8px 8px 0',
                        marginBottom: '16px',
                        color: '#f3e8ff',
                        fontSize: '0.95rem',
                        lineHeight: '1.6'
                      }}>
                        <div style={{ fontWeight: 'bold', color: '#e9d5ff', marginBottom: '8px', fontSize: '1rem' }}>
                          🤖 AI Mentor Hint
                        </div>
                        <div className="practice-hint-markdown">
                          <ReactMarkdown>{aiHint}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {runResult.logs.map((log, i) => (
                      <div key={i} className="practice-console-log">{log}</div>
                    ))}

                    <div className="practice-console-results">
                      {runResult.results.map((result, i) => (
                        <div key={i} className={`practice-result-row ${result.passed ? 'passed' : 'failed'}`}>
                          <span className="practice-result-status">
                            {result.passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                          <div className="practice-result-details">
                            <div><strong>Input:</strong> {result.input}</div>
                            <div><strong>Expected:</strong> {typeof result.expected === 'object' ? JSON.stringify(result.expected) : String(result.expected)}</div>
                            {result.actual != null && (
                              <div><strong>Actual:</strong> {typeof result.actual === 'object' ? JSON.stringify(result.actual) : String(result.actual)}</div>
                            )}
                            {result.error && (
                              <div className="practice-result-error"><strong>Error:</strong> {result.error}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default PracticePage