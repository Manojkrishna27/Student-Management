import { useState, useEffect, useCallback } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const login = useCallback((token) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  },[] )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
},[])

  return { isAuthenticated, loading, login, logout }
}

