import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const MentorPage = lazy(() => import('./pages/MentorPage'))
const PracticePage = lazy(() => import('./pages/PracticePage'))
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))

// Load layout component normally (it's used as a wrapper)
import AppLayout from './layouts/AppLayout'

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<Loading fullScreen text="Loading..." />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/mentor"
              element={<ProtectedRoute><MentorPage /></ProtectedRoute>}
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoadmapPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;