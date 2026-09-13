import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MentorPage from './pages/MentorPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PracticePage from './pages/PracticePage'
import AppLayout from './layouts/AppLayout.jsx'
import RoadmapPage from './pages/RoadmapPage'
import AccountPage from './pages/AccountPage.jsx'

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;