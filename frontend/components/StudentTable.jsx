import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'

const StudentTable = ({ 
  students, 
  loading, 
  onDelete, 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm)
  const [debounceTimer, setDebounceTimer] = useState(null)

  // Debounce search update
  useEffect(() => {
    setLocalSearch(searchTerm)
  }, [searchTerm])

  const debouncedSearch = useCallback((value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    const timer = setTimeout(() => {
      setSearchTerm(value)
    }, 300)
    setDebounceTimer(timer)
  }, [setSearchTerm, debounceTimer])

  const handleSort = (field) => {
    const newSort = sortBy === field ? `${field}:desc` : `${field}:asc`
    setSortBy(newSort)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(localSearch)
    } else if (e.key === 'Escape') {
      setLocalSearch('')
      setSearchTerm('')
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-12 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading students...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Search and Filters */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type and press Enter to search (Esc to clear)..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                debouncedSearch(e.target.value)
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <span>Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                sortBy === 'name:asc' || sortBy === 'name:desc' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Name {sortBy === 'name:desc' && <ChevronDown className="inline h-3 w-3 ml-1 -rotate-180" />}
            </button>
            <button
              onClick={() => handleSort('marks')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                sortBy === 'marks:asc' || sortBy === 'marks:desc' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Marks {sortBy === 'marks:desc' && <ChevronDown className="inline h-3 w-3 ml-1 -rotate-180" />}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-8 py-5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Age / Dept
              </th>
              <th className="px-8 py-5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-8 py-5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                Email
              </th>
              <th className="px-8 py-5 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {students?.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                  <div>{student.age}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">{student.department}</div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                    {student.marks}%
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                  {student.email}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/dashboard/students/${student.id}`}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {students?.length === 0 && !loading && (
        <div className="p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No students found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  )
}

export default StudentTable

