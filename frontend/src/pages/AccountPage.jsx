import React, { useState } from 'react'
import AppLayout from '../layouts/AppLayout.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { PROBLEMS } from '../data/practiceProblems.js'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'

const AccountPage = () => {
  const { user, updateProfile, changePassword } = useAuth()

  // Solved problems and growth calculations
  const solvedList = (() => {
    try {
      return JSON.parse(localStorage.getItem('codementor_solved_problems') || '[]')
    } catch {
      return []
    }
  })()

  const totalProblems = PROBLEMS.length
  const solvedCount = solvedList.length
  const completionPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  // Category & Difficulty breakdown
  const easySolved = PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedList.includes(p.id)).length
  const mediumSolved = PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedList.includes(p.id)).length
  const hardSolved = PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedList.includes(p.id)).length

  // Profile update form state
  const [name, setName] = useState(user?.name || '')
  const [profileFeedback, setProfileFeedback] = useState({ text: '', type: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passFeedback, setPassFeedback] = useState({ text: '', type: '' })
  const [savingPassword, setSavingPassword] = useState(false)

  const handleUpdateName = async (e) => {
    e.preventDefault()
    setProfileFeedback({ text: '', type: '' })
    setSavingProfile(true)

    try {
      await updateProfile({ name })
      setProfileFeedback({ text: 'Profile updated successfully!', type: 'success' })
    } catch (err) {
      setProfileFeedback({ text: err.message, type: 'error' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassFeedback({ text: '', type: '' })

    if (newPassword !== confirmPassword) {
      setPassFeedback({ text: 'New passwords do not match.', type: 'error' })
      return
    }

    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setPassFeedback({ text: 'Password changed successfully!', type: 'success' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPassFeedback({ text: err.message, type: 'error' })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '960px', margin: '36px auto', padding: '0 20px', color: '#f8fafc' }}>
        
        {/* Header with Avatar & User Summary */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '24px',
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          marginBottom: '28px'
        }}>
          <div style={{
            fontSize: '2.5rem',
            background: '#1e293b',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #3b82f6'
          }}>
            {user?.avatar || '👤'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{user?.name || 'Developer'}</h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.95rem' }}>{user?.email}</p>
          </div>
        </div>

        {/* Growth & Statistics Section */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: '#e2e8f0' }}>Learning & Growth</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Problems Solved</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>
              {solvedCount} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ {totalProblems}</span>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '8px' }}>
              <span style={{ color: '#34d399' }}>Easy: {easySolved}</span> •
              <span style={{ color: '#fbbf24' }}>Med: {mediumSolved}</span> •
              <span style={{ color: '#f87171' }}>Hard: {hardSolved}</span>
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Platform Progress</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#38bdf8', marginTop: '6px' }}>
              {completionPercentage}%
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: '#334155',
              borderRadius: '3px',
              marginTop: '14px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionPercentage}%`,
                height: '100%',
                background: '#38bdf8',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Account Status</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f1f5f9', marginTop: '10px' }}>
              Member
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '4px' }}>
              Joined: {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Active'}
            </span>
          </div>
        </div>

        {/* Edit Profile Details */}
        <div style={{
          background: '#1e293b',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '28px'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Update Profile</h2>
          <form onSubmit={handleUpdateName} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Email Address (read-only)"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <Input
              label="Display Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {profileFeedback.text && (
              <div style={{
                color: profileFeedback.type === 'error' ? '#f87171' : '#34d399',
                fontSize: '0.88rem',
                fontWeight: 500
              }}>
                {profileFeedback.text}
              </div>
            )}
            <Button type="submit" variant="primary" loading={savingProfile} style={{ width: 'fit-content' }}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div style={{
          background: '#1e293b',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Security & Password</h2>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passFeedback.text && (
              <div style={{
                color: passFeedback.type === 'error' ? '#f87171' : '#34d399',
                fontSize: '0.88rem',
                fontWeight: 500
              }}>
                {passFeedback.text}
              </div>
            )}
            <Button type="submit" variant="primary" loading={savingPassword} style={{ width: 'fit-content' }}>
              Update Password
            </Button>
          </form>
        </div>

      </div>
    </AppLayout>
  )
}

export default AccountPage