/**
 * Auth Context (Simplified)
 * Minimal authentication context using localStorage
 * Placeholder for future authentication features - currently no actual auth required
 */

import React, { createContext, useState, useContext, useEffect } from 'react'

// Create authentication context
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // User authentication state
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false)
  const [authError, setAuthError] = useState(null)
  
  // App configuration settings
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: 'audiowatch',
    public_settings: {}
  })

  // Check authentication state on mount
  useEffect(() => {
    checkAppState()
  }, [])

  // Verify app state and user authentication on initialization
  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true)
      setAuthError(null)
      
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        await checkUserAuth()
      } else {
        setIsLoadingAuth(false)
        setIsAuthenticated(false)
      }
      
      setIsLoadingPublicSettings(false)
    } catch (error) {
      console.error('Unexpected error:', error)
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      })
      setIsLoadingPublicSettings(false)
      setIsLoadingAuth(false)
    }
  }

  // Validate user authentication from localStorage
  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true)
      
      // Simple localStorage-based auth check
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const currentUser = JSON.parse(storedUser)
        setUser(currentUser)
        setIsAuthenticated(true)
      }
      
      setIsLoadingAuth(false)
    } catch (error) {
      console.error('User auth check failed:', error)
      setIsLoadingAuth(false)
      setIsAuthenticated(false)
    }
  }

  // Store user data and mark as authenticated
  const login = (userData) => {
    // Simple login function - stores user in localStorage
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Clear user data and authentication state
  const logout = (shouldRedirect = false) => {
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    
    if (shouldRedirect) {
      window.location.href = '/'
    }
  }

  // Redirect to login/home page
  const navigateToLogin = () => {
    // For standalone app, just redirect to home
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      login,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
