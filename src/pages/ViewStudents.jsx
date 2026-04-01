import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import StudentTable from '../components/StudentTable'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import { studentsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const ViewStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  const fetchStudents = useCallback(async (page = 1, search = '', sort = 'name') => {
    try {
      setLoading(true)
      setError(null)
      const params = { 
        page, 
        search: search || '',
        sort: `${sort}:asc`
      }
      const response = await studentsAPI.getAll(params)
      const data = response.data.data
      setStudents(data.students || [])
      setCurrentPage(data.pagination?.page || page)
      setTotalPages(data.pagination?.total_pages || 1)
    } catch (error) {
      console.error('Students error:', error)
      setError('Failed to load students')
      toast.error('Failed to load students')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents(1, searchTerm, sortBy)
  }, [fetchStudents, searchTerm, sortBy, currentPage])

  const handleDelete = async (studentId) => {
    try {
      await studentsAPI.delete(studentId)
      toast.success('Student deleted successfully!')
      setDeleteModal(null)
      fetchStudents(currentPage, searchTerm, sortBy)
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (error && !loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
          <button
            onClick={() => fetchStudents(1, searchTerm, sortBy)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your students - View, edit, and delete student records
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-student')}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all whitespace-nowrap flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Student</span>
        </button>
      </div>

      <StudentTable
        students={students}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDelete={(id) => setDeleteModal(id)}
      />

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Student"
        onConfirm={() => handleDelete(deleteModal)}
        confirmLabel="Delete Student"
        size="sm"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9.75L14.25 12m0 0l1.5 1.5M14.25 12l1.5-1.5M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a8.294 8.294 0 1111.23 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Are you sure?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This action cannot be undone. This will permanently delete the student record.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default ViewStudents

