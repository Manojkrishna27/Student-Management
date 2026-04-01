import { Loader2 } from 'lucide-react'

const Loader = ({ className = 'h-8 w-8', message = 'Loading...' }) => (
  <div className={`flex flex-col items-center space-y-4 p-12 ${className}`}>
    <div className="animate-spin rounded-full border-4 border-blue-200 border-t-blue-500 h-12 w-12"></div>
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
  </div>
)

export default Loader

