import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoadmapPage.css';

const STORAGE_KEY = 'codementor_solved_problems';
const ROADMAP_OVERRIDES_KEY = 'codementor_roadmap_overrides';

const ROADMAP_DATA = {
  frontend: {
    title: 'Frontend Developer',
    description: 'Master the building blocks of the web from HTML/CSS to advanced React ecosystems.',
    steps: [
      { id: 'fe-1', title: 'HTML & CSS Fundamentals', desc: 'Semantic HTML, Flexbox, CSS Grid, Responsive Design, Tailwind CSS', requiredProblems: [] },
      { id: 'fe-2', title: 'JavaScript Essentials & Arrays', desc: 'ES6+ syntax, Two-pointer algorithms, in-place array transformations', requiredProblems: ['reverse-string', 'two-sum'] },
      { id: 'fe-3', title: 'Data Structures in JS', desc: 'Linked lists, pointer traversal, node manipulation, memory patterns', requiredProblems: ['reverse-linked-list'] },
      { id: 'fe-4', title: 'Fullstack APIs & Auth', desc: 'REST APIs, JWT handling, Axios, backend endpoints', requiredProblems: [] },
      { id: 'fe-5', title: 'Advanced Algorithms & Edge Cases', desc: 'Divide and conquer, binary search patterns, sorted arrays', requiredProblems: ['median-sorted-arrays'] },
    ]
  },
  backend: {
    title: 'Backend & Systems Engineer',
    description: 'Build scalable APIs, handle high-throughput databases, and design resilient systems.',
    steps: [
      { id: 'be-1', title: 'Python Foundations & Control Flow', desc: 'Conditionals, string formatting, iteration algorithms', requiredProblems: ['fizzbuzz'] },
      { id: 'be-2', title: 'Python Data Structures & Hash Maps', desc: 'Dictionary lookup complexity, two-sum logic, stacks and parsers', requiredProblems: ['two-sum-py', 'valid-parentheses'] },
      { id: 'be-3', title: 'Relational Databases & SQL Queries', desc: 'Filtering, alphabetical ordering, projections, single-table queries', requiredProblems: ['select-employees'] },
      { id: 'be-4', title: 'SQL Aggregations & Grouping', desc: 'GROUP BY, HAVING clauses, multi-row arithmetic, sorting aggregates', requiredProblems: ['department-averages'] },
      { id: 'be-5', title: 'Systems & Cloud Architecture', desc: 'FastAPI microservices, Docker, CI/CD, rate limiting', requiredProblems: [] },
    ]
  },
  fullstack: {
    title: 'Fullstack AI Practitioner',
    description: 'Bridge modern web applications with cutting-edge LLMs and AI agent workflows.',
    steps: [
      { id: 'fs-1', title: 'Core Multi-Language Fluency', desc: 'JavaScript algorithms and Python scripting fundamentals', requiredProblems: ['two-sum', 'fizzbuzz'] },
      { id: 'fs-2', title: 'Data Structures & Storage Engine', desc: 'In-memory relational schemas, linked lists, SQL aggregations', requiredProblems: ['reverse-linked-list', 'department-averages'] },
      { id: 'fs-3', title: 'Algorithmic Optimization & Robust Parsing', desc: 'Bracket validation stacks, median of sorted arrays', requiredProblems: ['valid-parentheses', 'median-sorted-arrays'] },
      { id: 'fs-4', title: 'Generative AI & Hint Pipelines', desc: 'Gemini API integration, system prompts, automated code reviews', requiredProblems: [] },
      { id: 'fs-5', title: 'Production Deployment', desc: 'FastAPI backend hosting, SQLite sandboxing, React production builds', requiredProblems: [] },
    ]
  }
};

export default function RoadmapPage() {
  const [activeTrack, setActiveTrack] = useState('fullstack');

  // Load solved problems from practice tests
  const [solvedProblemIds, setSolvedProblemIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track user manual overrides
  const [overrides, setOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_OVERRIDES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_OVERRIDES_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.error(e);
    }
  }, [overrides]);

  const currentData = ROADMAP_DATA[activeTrack];

  // Resolve status based on practice completion and manual toggles
  const stepsWithStatus = useMemo(() => {
    return currentData.steps.map((step) => {
      if (overrides[step.id] !== undefined) {
        return { ...step, status: overrides[step.id] ? 'completed' : 'pending' };
      }

      if (step.requiredProblems.length > 0) {
        const allRequiredDone = step.requiredProblems.every(id => solvedProblemIds.includes(id));
        const someRequiredDone = step.requiredProblems.some(id => solvedProblemIds.includes(id));
        const status = allRequiredDone ? 'completed' : someRequiredDone ? 'in-progress' : 'pending';
        return { ...step, status };
      }

      return { ...step, status: 'pending' };
    });
  }, [currentData, solvedProblemIds, overrides]);

  const toggleStep = (stepId, currentStatus) => {
    setOverrides(prev => ({
      ...prev,
      [stepId]: currentStatus !== 'completed'
    }));
  };

  const completedCount = stepsWithStatus.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stepsWithStatus.length) * 100);

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <div>
          <h1 className="roadmap-title">Interactive Learning Roadmap</h1>
          <p className="roadmap-subtitle">Track your mastery, unlock skills, and test yourself with guided practice.</p>
        </div>
        <div className="roadmap-actions">
          <Link to="/practice" className="roadmap-btn primary">Go to Practice Challenges</Link>
          <Link to="/mentor" className="roadmap-btn secondary">Ask AI Mentor</Link>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="track-tabs">
        <button
          className={`track-tab ${activeTrack === 'fullstack' ? 'active' : ''}`}
          onClick={() => setActiveTrack('fullstack')}
        >
          🚀 Fullstack & AI
        </button>
        <button
          className={`track-tab ${activeTrack === 'frontend' ? 'active' : ''}`}
          onClick={() => setActiveTrack('frontend')}
        >
          💻 Frontend Dev
        </button>
        <button
          className={`track-tab ${activeTrack === 'backend' ? 'active' : ''}`}
          onClick={() => setActiveTrack('backend')}
        >
          ⚙️ Backend & Systems
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="progress-card">
        <div className="progress-info">
          <div>
            <h3>{currentData.title}</h3>
            <p>{currentData.description}</p>
          </div>
          <div className="progress-metric">
            <span className="percent-val">{progressPercent}%</span>
            <span className="percent-label">{completedCount} of {stepsWithStatus.length} milestones complete</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="roadmap-timeline">
        {stepsWithStatus.map((step, idx) => {
          const isDone = step.status === 'completed';
          const firstTargetProblem = step.requiredProblems[0];

          return (
            <div key={step.id} className={`timeline-card ${isDone ? 'done' : ''}`}>
              <div
                className="timeline-node"
                onClick={() => toggleStep(step.id, step.status)}
                title="Click to toggle status"
                style={{ cursor: 'pointer' }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="timeline-content">
                <div className="timeline-top">
                  <h4 className="step-title">{step.title}</h4>
                  <span className={`status-badge ${step.status}`}>{step.status}</span>
                </div>
                <p className="step-desc">{step.desc}</p>

                {step.requiredProblems.length > 0 && (
                  <div style={{ margin: '8px 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Linked Problems: {step.requiredProblems.map((probId, i) => {
                      const isProbDone = solvedProblemIds.includes(probId);
                      return (
                        <span key={probId} style={{ marginRight: '6px' }}>
                          <Link 
                            to={`/practice?problem=${probId}`} 
                            style={{ color: isProbDone ? '#10b981' : '#a855f7', textDecoration: 'underline' }}
                          >
                            {probId}
                          </Link>
                          {isProbDone ? ' (✓)' : ''}
                          {i < step.requiredProblems.length - 1 ? ',' : ''}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="step-footer">
                  <button className="toggle-btn" onClick={() => toggleStep(step.id, step.status)}>
                    {isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                  </button>
                  {firstTargetProblem ? (
                    <Link to={`/practice?problem=${firstTargetProblem}`} className="practice-link">
                      Practice Problem →
                    </Link>
                  ) : (
                    <Link to="/practice" className="practice-link">
                      Open Practice →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}