import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'
import { PROBLEMS } from '../data/practiceProblems.js'
import './Dashboard.css'

const STORAGE_KEY = 'codementor_solved_problems'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Read real solved problem IDs from localStorage
  const solvedProblemIds = useMemo(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }, [])

  // Calculate live statistics
  const totalProblems = PROBLEMS.length
  const solvedCount = solvedProblemIds.length
  const completionPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  const solvedDetails = useMemo(() => {
    return PROBLEMS.filter(p => solvedProblemIds.includes(p.id))
  }, [solvedProblemIds])

  const easySolved = solvedDetails.filter(p => p.difficulty === 'Easy').length
  const mediumSolved = solvedDetails.filter(p => p.difficulty === 'Medium').length
  const hardSolved = solvedDetails.filter(p => p.difficulty === 'Hard').length

  // Find the first unsolved problem to recommend
  const nextUnsolvedProblem = PROBLEMS.find(p => !solvedProblemIds.includes(p.id)) || PROBLEMS[0]

  return (
    <AppLayout>
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p className="dashboard-subtitle">Continue your coding journey</p>
          </div>

          <div className="dashboard-stats">
            <Card className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">5</div>
              <div className="stat-label">Day Streak</div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{solvedCount}/{totalProblems}</div>
              <div className="stat-label">Problems Solved</div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{completionPercentage}%</div>
              <div className="stat-label">Completion</div>
            </Card>

            <Card className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-value">
                {easySolved}E · {mediumSolved}M · {hardSolved}H
              </div>
              <div className="stat-label">Difficulty Split</div>
            </Card>
          </div>

          <div className="dashboard-grid">
            <Card className="dashboard-card primary">
              <h3>Practice Progress</h3>
              <p>{solvedCount === totalProblems ? 'All available problems solved!' : `${totalProblems - solvedCount} problems remaining`}</p>
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <span>{completionPercentage}%</span>
              </div>
              <Button variant="primary" onClick={() => navigate('/practice')}>
                Go to Practice
              </Button>
            </Card>

            <Card className="dashboard-card">
              <h3>Next Recommended Problem</h3>
              <p><strong>{nextUnsolvedProblem.title}</strong> — {nextUnsolvedProblem.difficulty}</p>
              <p className="card-subtitle">{nextUnsolvedProblem.language} Challenge</p>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/practice?problem=${nextUnsolvedProblem.id}`)}
              >
                {solvedProblemIds.includes(nextUnsolvedProblem.id) ? 'Review Problem' : 'Solve Next'}
              </Button>
            </Card>

            <Card className="dashboard-card">
              <h3>AI Mentor</h3>
              <p>Get help with coding questions</p>
              <p className="card-subtitle">Ask anything about programming</p>
              <Button variant="outline" onClick={() => navigate('/mentor')}>
                Chat with AI
              </Button>
            </Card>
          </div>

          <Card className="dashboard-card">
            <h3>Recently Solved Problems</h3>
            <div className="activity-list">
              {solvedDetails.length > 0 ? (
                solvedDetails.slice(-3).reverse().map(problem => (
                  <div key={problem.id} className="activity-item">
                    <span className="activity-icon">✅</span>
                    <div className="activity-content">
                      <p>Solved "{problem.title}" ({problem.language})</p>
                      <span className="activity-time">{problem.difficulty}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <span className="activity-icon">💡</span>
                  <div className="activity-content">
                    <p>No problems completed yet. Start practicing today!</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default Dashboard