import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const USERS_STORAGE_KEY = 'codementor_registered_users'

const DEFAULT_USERS = [
  {
    id: 'demo-1',
    name: 'Demo User',
    email: 'demo@codementor.ai',
    password: 'password123',
    avatar: '👤',
    joinedDate: new Date().toISOString()
  }
]

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize registered users list in localStorage if missing
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
      }
    } catch (e) {
      console.error('Failed to initialize users registry:', e)
    }
  }, [])

  // Restore existing session
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedAuth = localStorage.getItem('isAuthenticated')
      
      if (storedUser && storedAuth === 'true') {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }
    } catch (e) {
      console.error('Failed to restore auth session:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const getRegisteredUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY)
      return users ? JSON.parse(users) : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  }

  const login = async (email, password, rememberMe = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email?.trim().toLowerCase()
        const cleanPassword = password?.trim()

        if (!cleanEmail || !cleanPassword) {
          return reject(new Error('Please enter both email and password.'))
        }

        const registeredUsers = getRegisteredUsers()
        const foundUser = registeredUsers.find(
          u => u.email.toLowerCase() === cleanEmail
        )

        if (!foundUser) {
          return reject(new Error('No account found with this email address.'))
        }

        if (foundUser.password !== cleanPassword) {
          return reject(new Error('Incorrect password. Please try again.'))
        }

        const sessionUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          avatar: foundUser.avatar || '👤',
          joinedDate: foundUser.joinedDate
        }

        setUser(sessionUser)
        setIsAuthenticated(true)

        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(sessionUser))
          localStorage.setItem('isAuthenticated', 'true')
        }

        resolve(sessionUser)
      }, 400)
    })
  }

  const register = async (name, email, password, confirmPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanName = name?.trim()
        const cleanEmail = email?.trim().toLowerCase()
        const cleanPassword = password?.trim()

        if (!cleanName || !cleanEmail || !cleanPassword) {
          return reject(new Error('All fields are required.'))
        }

        if (cleanPassword !== confirmPassword?.trim()) {
          return reject(new Error('Passwords do not match.'))
        }

        if (cleanPassword.length < 6) {
          return reject(new Error('Password must be at least 6 characters.'))
        }

        const registeredUsers = getRegisteredUsers()
        const emailExists = registeredUsers.some(
          u => u.email.toLowerCase() === cleanEmail
        )

        if (emailExists) {
          return reject(new Error('An account with this email already exists.'))
        }

        const newUser = {
          id: Date.now().toString(),
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          avatar: '👤',
          joinedDate: new Date().toISOString()
        }

        const updatedUsers = [...registeredUsers, newUser]
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          joinedDate: newUser.joinedDate
        }

        setUser(sessionUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(sessionUser))
        localStorage.setItem('isAuthenticated', 'true')

        resolve(sessionUser)
      }, 400)
    })
  }

  const updateProfile = async ({ name, avatar }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name?.trim()) {
          return reject(new Error('Name cannot be blank.'))
        }

        const registeredUsers = getRegisteredUsers()
        const updatedUsers = registeredUsers.map(u => {
          if (u.id === user?.id) {
            return { ...u, name: name.trim(), avatar: avatar || u.avatar }
          }
          return u
        })

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))

        const updatedSession = { ...user, name: name.trim(), avatar: avatar || user?.avatar }
        setUser(updatedSession)
        localStorage.setItem('user', JSON.stringify(updatedSession))

        resolve(updatedSession)
      }, 300)
    })
  }

  const changePassword = async (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentPassword || !newPassword) {
          return reject(new Error('Please fill out all password fields.'))
        }
        if (newPassword.length < 6) {
          return reject(new Error('New password must be at least 6 characters.'))
        }

        const registeredUsers = getRegisteredUsers()
        const targetUser = registeredUsers.find(u => u.id === user?.id)

        if (!targetUser || targetUser.password !== currentPassword.trim()) {
          return reject(new Error('Current password does not match.'))
        }

        const updatedUsers = registeredUsers.map(u => {
          if (u.id === user?.id) {
            return { ...u, password: newPassword.trim() }
          }
          return u
        })

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))
        resolve({ message: 'Password updated successfully!' })
      }, 300)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    localStorage.removeItem('isAuthenticated')
  }

  const forgotPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email?.trim().toLowerCase()
        if (!cleanEmail) {
          return reject(new Error('Email is required.'))
        }

        const registeredUsers = getRegisteredUsers()
        const exists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)

        if (!exists) {
          return reject(new Error('No account found with this email address.'))
        }

        resolve({ message: 'Password reset link sent to your email.' })
      }, 400)
    })
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
    changePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}