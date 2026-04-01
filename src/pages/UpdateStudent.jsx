import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import StudentForm from '../components/StudentForm'
import Loader from '../components/Loader'
import { studentsAPI } from '../services/api'

const UpdateStudent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      setLoading(true)
      const response = await studentsAPI.getById(id)
      setStudent(response.data.data)
    } catch (error) {
      console.error('Error fetching student:', error)
      toast.error('Student not found')
      navigate('/dashboard/students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (studentData) => {
    try {
      setUpdating(true)
      await studentsAPI.update(id, studentData)
      toast.success('Student updated successfully!')
      navigate('/dashboard/students')
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error('Failed to update student')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Loader />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Student Not Found</h2>
          <button
            onClick={() => navigate('/dashboard/students')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Students
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/students')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-colors mb-6"
          >
            ← Back to Students
          </button>
        </div>
        
        <StudentForm
          initialData={student}
          onSubmit={handleSubmit}
          loading={updating}
          title="Update Student"
          submitLabel="Update Student"
        />
      </div>
    </div>
  )
}

export default UpdateStudent

