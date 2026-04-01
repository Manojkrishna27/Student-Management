import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Users, Award, TrendingUp } from 'lucide-react'
import { studentsAPI } from '../services/api'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageMarks: 0,
    topPerformer: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await studentsAPI.getAll()
      const data = response.data.data.students || []
      
      const totalStudents = data.length
      const totalMarks = data.reduce((sum, student) => sum + (parseFloat(student.marks) || 0), 0)
      const averageMarks = totalStudents > 0 ? (totalMarks / totalStudents).toFixed(1) : 0
      const topPerformer = data.length > 0 
        ? data.reduce((top, student) => (parseFloat(student.marks) || 0) > (parseFloat(top.marks) || 0) ? student : top)
        : null

      setStats({
        totalStudents,
        averageMarks,
        topPerformer
      })
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Failed to load dashboard stats')
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${
          color === 'blue' ? 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' : 
          color === 'purple' ? 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30' : 
          'from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30'
        } shadow-lg`}>
          <Icon size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h2>
          <button
            onClick={fetchDashboardStats}
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
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your students.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-student')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
        >
          + Add New Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Average Marks"
          value={`${stats.averageMarks}%`}
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Top Performer"
          value={stats.topPerformer?.name || 'No students'}
          icon={Award}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Student added</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 dark:text-white">Marks updated</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 shadow-lg border border-blue-100/50 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
          <div className="space-y-4 text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</div>
            <p className="text-lg text-gray-600 dark:text-gray-400">Active Students</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((stats.totalStudents / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

