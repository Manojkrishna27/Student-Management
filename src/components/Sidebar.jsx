import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [localIsOpen, setLocalIsOpen] = useState(false)

  const toggleSidebar = () => {
    setLocalIsOpen(!localIsOpen)
    if (onClose) onClose()
  }

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Add Student', 
      path: '/dashboard/add-student', 
      icon: UserPlus 
    },
    { 
      name: 'View Students', 
      path: '/dashboard/students', 
      icon: Users 
    },
  ]

  const currentOpen = isOpen !== undefined ? isOpen : localIsOpen

  return (
    <>
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        shadow-2xl lg:shadow-none
        ${currentOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SMS
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (onClose) onClose()
                  else setLocalIsOpen(false)
                }}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group hover:shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900'
                }`}
              >
                <Icon size={20} className={`mr-4 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                <span className="font-semibold text-sm lg:text-base">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile overlay */}
      {currentOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => {
            if (onClose) onClose()
            else setLocalIsOpen(false)
          }}
        />
      )}
    </>
  )
}

export default Sidebar

