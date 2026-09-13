import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import Sidebar, { SidebarItem, SidebarSection } from '../components/Sidebar.jsx'
import './AppLayout.css'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'AI Mentor', href: '/mentor', icon: '🤖' },
  { label: 'Practice', href: '/practice', icon: '💻' },
  { label: 'Roadmap', href: '/roadmap', icon: '🗺️' },
  { label: 'Account', href: '/account', icon: '⚙️' },
]

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = NAV_ITEMS.map(item => ({
    ...item,
    onClick: () => navigate(item.href),
  }))

  return (
    <div className="app-layout">
      <Navbar
        logo="CodeMentorAI"
        tagline="Your AI-powered coding mentor"
        navItems={navItems}
        showThemeToggle={true}
        showUserMenu={true}
        user={user}
        onLogout={handleLogout}
        onAccountClick={() => navigate('/account')}
      />

      <div className="app-layout-body">
        <aside className="app-sidebar">
          <div className="app-sidebar-inner">
            <SidebarSection title="Navigation">
              {NAV_ITEMS.map(item => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={location.pathname === item.href}
                  onClick={() => navigate(item.href)}
                />
              ))}
            </SidebarSection>
          </div>
        </aside>

        <button
          className="app-sidebar-toggle"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} width="280px">
          <SidebarSection title="Navigation">
            {NAV_ITEMS.map(item => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
                onClick={() => {
                  navigate(item.href)
                  setIsSidebarOpen(false)
                }}
              />
            ))}
          </SidebarSection>
        </Sidebar>

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout