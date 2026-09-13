import React, { useState } from 'react'
import './ComponentTest.css'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Modal from '../components/Modal.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading, { LoadingDots, LoadingBar, Skeleton } from '../components/Loading.jsx'
import Error, { ErrorInline } from '../components/Error.jsx'
import Toast, { useToast, ToastContainer } from '../components/Toast.jsx'
import CodeBlock, { InlineCode } from '../components/CodeBlock.jsx'
import ProgressBar, { CircularProgressBar, StepProgress } from '../components/ProgressBar.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'

const ComponentTest = () => {
  const { isDark, toggleTheme } = useTheme()
  const { toasts, addToast, removeToast, success, error, warning, info } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <div className="component-test">
      <Navbar
        logo="CodeMentorAI"
        tagline="Your AI-powered coding mentor"
        navItems={navItems}
        showThemeToggle={true}
      />

      <div className="container" style={{ padding: '40px 20px' }}>
        <h1>Design System Components Test</h1>
        <p>Testing all reusable components</p>

        {/* Theme Toggle */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Theme Toggle</h3>
          <p>Current theme: {isDark ? 'Dark' : 'Light'}</p>
          <Button onClick={toggleTheme}>Toggle Theme</Button>
        </Card>

        {/* Buttons */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Buttons</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Card>

        {/* Cards */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Cards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <Card variant="default">
              <h4>Default Card</h4>
              <p>Standard card component</p>
            </Card>
            <Card variant="primary">
              <h4>Primary Card</h4>
              <p>Primary variant card</p>
            </Card>
            <Card variant="success">
              <h4>Success Card</h4>
              <p>Success variant card</p>
            </Card>
            <Card hoverable>
              <h4>Hoverable Card</h4>
              <p>Hover over me!</p>
            </Card>
          </div>
        </Card>

        {/* Inputs */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Inputs</h3>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={inputValue}
            onChange={setInputValue}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error="This field is required"
          />
          <Input
            label="Disabled Input"
            placeholder="Disabled input"
            disabled
          />
        </Card>

        {/* Modal */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Modal</h3>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Test Modal"
            size="md"
          >
            <p>This is a test modal component.</p>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </Modal>
        </Card>

        {/* Loading States */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Loading States</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Loading size="sm" />
            <Loading size="md" />
            <Loading size="lg" />
            <LoadingDots />
            <LoadingBar width="200px" />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Skeleton width="100px" height="100px" variant="circle" />
            <Skeleton width="200px" height="20px" />
            <Skeleton width="150px" height="20px" />
          </div>
        </Card>

        {/* Error States */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Error States</h3>
          <ErrorInline message="This is an inline error" />
          <div style={{ marginTop: '20px' }}>
            <Error
              title="Test Error"
              message="This is a test error component"
              showRetry
              onRetry={() => console.log('Retry clicked')}
            />
          </div>
        </Card>

        {/* Toast Notifications */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Toast Notifications</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button onClick={() => success('Success message!')}>Success</Button>
            <Button onClick={() => error('Error message!')}>Error</Button>
            <Button onClick={() => warning('Warning message!')}>Warning</Button>
            <Button onClick={() => info('Info message!')}>Info</Button>
          </div>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </Card>

        {/* Code Blocks */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Code Blocks</h3>
          <CodeBlock
            code={`function hello() {
  console.log("Hello, World!");
}`}
            language="javascript"
            title="Example Code"
          />
          <p style={{ marginTop: '10px' }}>
            This is <InlineCode>inline code</InlineCode> example.
          </p>
        </Card>

        {/* Progress Bars */}
        <Card style={{ marginBottom: '20px' }}>
          <h3>Progress Bars</h3>
          <ProgressBar value={65} max={100} showPercentage />
          <ProgressBar value={40} max={100} variant="success" showPercentage />
          <ProgressBar value={80} max={100} variant="warning" showPercentage />
          <ProgressBar value={25} max={100} variant="danger" showPercentage />
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center' }}>
            <CircularProgressBar value={75} size={120} showPercentage />
            <CircularProgressBar value={50} size={100} variant="success" showPercentage />
            <CircularProgressBar value={90} size={80} variant="warning" showPercentage />
          </div>

          <div style={{ marginTop: '20px' }}>
            <StepProgress steps={['Step 1', 'Step 2', 'Step 3', 'Step 4']} currentStep={2} />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ComponentTest
