import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.css'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Navbar from '../components/Navbar.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'

const LandingPage = () => {
  const { isDark } = useTheme()

  const navItems = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' }
  ]

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Mentor',
      description: 'Get personalized guidance and explanations from our advanced AI coding mentor.'
    },
    {
      icon: '🔍',
      title: 'Code Explainer',
      description: 'Understand any code with detailed, step-by-step explanations in simple language.'
    },
    {
      icon: '🐛',
      title: 'Smart Debugger',
      description: 'Identify and fix bugs quickly with AI-powered error analysis and solutions.'
    },
    {
      icon: '⚡',
      title: 'Code Generator',
      description: 'Generate clean, efficient code based on your requirements and specifications.'
    },
    {
      icon: '📚',
      title: 'Learning Paths',
      description: 'Follow structured roadmaps designed for beginners to advanced programmers.'
    },
    {
      icon: '🏆',
      title: 'Practice Problems',
      description: 'Sharpen your skills with coding challenges and progressive AI hints.'
    }
  ]

  const languages = [
    { name: 'Python', icon: '🐍', color: '#3776AB' },
    { name: 'JavaScript', icon: '⚡', color: '#F7DF1E' },
    { name: 'Java', icon: '☕', color: '#007396' },
    { name: 'C++', icon: '⚙️', color: '#00599C' },
    { name: 'C', icon: '🔧', color: '#A8B9CC' },
    { name: 'SQL', icon: '🗃️', color: '#336791' },
    { name: 'HTML', icon: '🌐', color: '#E34F26' },
    { name: 'CSS', icon: '🎨', color: '#1572B6' }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Create your free account in seconds'
    },
    {
      step: 2,
      title: 'Choose Your Path',
      description: 'Select a programming language or topic to learn'
    },
    {
      step: 3,
      title: 'Learn & Practice',
      description: 'Follow lessons, solve problems, and get AI help'
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor your growth and achievements'
    }
  ]

  return (
    <div className="landing-page">
      <Navbar
        logo="CodeMentorAI"
        tagline="Your AI-powered coding mentor"
        navItems={navItems}
        showThemeToggle={true}
        showUserMenu={true}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn to Code. Build Skills. Get Mentored by AI.
            </h1>
            <p className="hero-subtitle">
              CodeMentorAI is your personal AI coding mentor that helps you understand code, 
              fix errors, practice problems, and become a better programmer.
            </p>
            <div className="hero-buttons">
              <Link to="/register">
                <Button size="lg" variant="primary">Start Learning</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Try AI Mentor</Button>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Problems</div>
              </div>
              <div className="stat">
                <div className="stat-number">8</div>
                <div className="stat-label">Languages</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <Card className="hero-card">
              <CodeBlock
                code={`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`}
                language="javascript"
                title="AI Explains Code"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Why CodeMentorAI Section */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title">Why CodeMentorAI?</h2>
          <p className="section-subtitle">
            The smartest way to learn programming with personalized AI guidance
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} hoverable className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Start your coding journey in four simple steps
          </p>
          <div className="steps-container">
            {howItWorks.map((item, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {index < howItWorks.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages Section */}
      <section className="section languages-section">
        <div className="container">
          <h2 className="section-title">Supported Languages</h2>
          <p className="section-subtitle">
            Learn the most popular programming languages
          </p>
          <div className="languages-grid">
            {languages.map((lang, index) => (
              <Card key={index} hoverable className="language-card">
                <div 
                  className="language-icon" 
                  style={{ backgroundColor: `${lang.color}20`, color: lang.color }}
                >
                  {lang.icon}
                </div>
                <h3 className="language-name">{lang.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Mentor Preview Section */}
      <section className="section ai-mentor-section">
        <div className="container">
          <div className="ai-mentor-content">
            <div className="ai-mentor-text">
              <h2 className="section-title">Meet Your AI Mentor</h2>
              <p className="section-subtitle">
                Get instant help with coding questions, explanations, and debugging
              </p>
              <ul className="ai-mentor-features">
                <li>✨ Explain complex code in simple terms</li>
                <li>🔍 Debug errors with detailed analysis</li>
                <li>💡 Get hints, not just answers</li>
                <li>📚 Learn at your own pace</li>
                <li>🎯 Personalized learning paths</li>
              </ul>
              <Link to="/login">
                <Button size="lg" variant="primary">Try AI Mentor</Button>
              </Link>
            </div>
            <div className="ai-mentor-demo">
              <Card className="chat-demo">
                <div className="chat-messages">
                  <div className="message message-user">
                    <div className="message-content">
                      Explain this Python code for me
                    </div>
                  </div>
                  <div className="message message-ai">
                    <div className="message-content">
                      <p>This code calculates the factorial of a number using recursion.</p>
                      <p><strong>Line 1:</strong> Function definition with parameter n</p>
                      <p><strong>Line 2:</strong> Base case - returns 1 if n is 0 or 1</p>
                      <p><strong>Line 3:</strong> Recursive case - n * factorial(n-1)</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Coding Practice Section */}
      <section className="section practice-section">
        <div className="container">
          <h2 className="section-title">Coding Practice</h2>
          <p className="section-subtitle">
            Sharpen your skills with curated problems
          </p>
          <div className="practice-cards">
            <Card hoverable className="practice-card">
              <div className="practice-difficulty easy">Easy</div>
              <h3>Two Sum</h3>
              <p>Find two numbers that add up to a target</p>
              <ProgressBar value={65} max={100} showPercentage />
            </Card>
            <Card hoverable className="practice-card">
              <div className="practice-difficulty medium">Medium</div>
              <h3>Reverse Linked List</h3>
              <p>Reverse a singly linked list</p>
              <ProgressBar value={40} max={100} showPercentage />
            </Card>
            <Card hoverable className="practice-card">
              <div className="practice-difficulty hard">Hard</div>
              <h3>Median of Two Sorted Arrays</h3>
              <p>Find median of two sorted arrays</p>
              <ProgressBar value={20} max={100} showPercentage />
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Roadmap Section */}
      <section className="section roadmap-section">
        <div className="container">
          <h2 className="section-title">Learning Roadmaps</h2>
          <p className="section-subtitle">
            Structured paths from beginner to advanced
          </p>
          <Card className="roadmap-card">
            <div className="roadmap-steps">
              <div className="roadmap-step completed">
                <div className="roadmap-step-icon">✓</div>
                <div className="roadmap-step-content">
                  <h4>Programming Basics</h4>
                  <p>Variables, data types, operators</p>
                </div>
              </div>
              <div className="roadmap-step completed">
                <div className="roadmap-step-icon">✓</div>
                <div className="roadmap-step-content">
                  <h4>Control Flow</h4>
                  <p>Conditions, loops, functions</p>
                </div>
              </div>
              <div className="roadmap-step current">
                <div className="roadmap-step-icon">→</div>
                <div className="roadmap-step-content">
                  <h4>Object-Oriented Programming</h4>
                  <p>Classes, objects, inheritance</p>
                </div>
              </div>
              <div className="roadmap-step">
                <div className="roadmap-step-icon">○</div>
                <div className="roadmap-step-content">
                  <h4>Data Structures</h4>
                  <p>Arrays, linked lists, trees, graphs</p>
                </div>
              </div>
              <div className="roadmap-step">
                <div className="roadmap-step-icon">○</div>
                <div className="roadmap-step-content">
                  <h4>Algorithms</h4>
                  <p>Sorting, searching, dynamic programming</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="section progress-section">
        <div className="container">
          <h2 className="section-title">Track Your Progress</h2>
          <p className="section-subtitle">
            Monitor your learning journey with detailed analytics
          </p>
          <div className="progress-cards">
            <Card className="progress-stat-card">
              <div className="progress-stat-icon">🔥</div>
              <div className="progress-stat-value">15</div>
              <div className="progress-stat-label">Day Streak</div>
            </Card>
            <Card className="progress-stat-card">
              <div className="progress-stat-icon">✅</div>
              <div className="progress-stat-value">42</div>
              <div className="progress-stat-label">Problems Solved</div>
            </Card>
            <Card className="progress-stat-card">
              <div className="progress-stat-icon">📖</div>
              <div className="progress-stat-value">8</div>
              <div className="progress-stat-label">Concepts Learned</div>
            </Card>
            <Card className="progress-stat-card">
              <div className="progress-stat-icon">⭐</div>
              <div className="progress-stat-value">85%</div>
              <div className="progress-stat-label">Accuracy</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="section cta-section">
        <div className="container">
          <Card className="cta-card">
            <h2 className="cta-title">Ready to Start Your Coding Journey?</h2>
            <p className="cta-subtitle">
              Join thousands of students learning programming with AI-powered guidance
            </p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button size="lg" variant="primary">Get Started Free</Button>
              </Link>
              <Button size="lg" variant="outline">View Demo</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">CodeMentorAI</h3>
              <p className="footer-description">
                Your AI-powered coding mentor for learning programming
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CodeMentorAI. MCA Academic Project.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
