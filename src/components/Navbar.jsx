import { useState, useEffect, useCallback } from 'react'
import { 
  Bell, 
  Sun, Moon, 
  LogOut, 
  UserCircle, 
  ChevronDown, 
  Menu 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from 'react-router-dom'

const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setDarkMode(savedTheme === 'dark')
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleDarkMode = useCallback(() => {
    const newTheme = darkMode ? 'light' : 'dark'
    setDarkMode(!darkMode)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }, [darkMode])

  const handleLogout = useCallback(() => {
    logout()
    setUserMenuOpen(false)
  }, [logout])

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('add-student')) return 'Add Student'
    if (path.includes('students')) return 'Students'
    return 'Dashboard'
  }

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 supports-[backdrop-filter:blur()]:bg-white/90">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Mobile hamburger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-200">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all hover:scale-105 shadow-sm"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-500" />}
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all hover:scale-105 shadow-sm group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Admin
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-xl font-bold text-white">A</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Admin User</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors rounded-xl mx-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

