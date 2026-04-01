import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import StudentForm from '../components/StudentForm'
import { studentsAPI } from '../services/api'

const AddStudent = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (studentData) => {
    try {
      console.log('Creating student:', studentData) // DEBUG
      setLoading(true)
      await studentsAPI.create(studentData)
      toast.success('Student added successfully!')
      navigate('/dashboard/students')
    } catch (error) {
      console.error('Create error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <StudentForm
          onSubmit={handleSubmit}
          loading={loading}
          title="Add New Student"
          submitLabel="Add Student"
        />
      </div>
    </div>
  )
}

export default AddStudent

