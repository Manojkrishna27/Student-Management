import { useState, useEffect } from 'react'
import { User, Mail, Hash, Award, Building2 } from 'lucide-react'

// Extract FormField as standalone component to fix "Element type is invalid"
const FormField = ({ label, name, icon: Icon, type = "text", value, onChange, error }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-gray-400" />
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-400 ring-1 ring-red-400/30 bg-red-50/50 dark:bg-red-900/20' : 'hover:border-gray-400'
      }`}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
  </div>
)

const StudentForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  title = "Add Student",
  submitLabel = "Add Student"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    department: '',
    marks: '',
    email: '',
    ...initialData
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || '',
        age: initialData.age || '',
        department: initialData.department || '',
        marks: initialData.marks || '',
        email: initialData.email || ''
      })
      setErrors({})
    }
  }, [initialData?.id || initialData?.name]) // Stable deps prevent loop

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters'

    if (!formData.age || formData.age < 16 || formData.age > 100) {
      newErrors.age = 'Age must be between 16-100'
    }

    if (!formData.department.trim()) newErrors.department = 'Department is required'

    if (!formData.marks || formData.marks < 0 || formData.marks > 100) {
      newErrors.marks = 'Marks must be between 0-100'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form Data:', formData); // DEBUG
      const submitData = {
        name: formData.name.trim(),
        age: parseInt(formData.age) || 0,
        department: formData.department.trim(),
        marks: parseFloat(formData.marks) || 0,
        email: formData.email.trim().toLowerCase()
      }
      console.log('Submit Payload:', submitData); // DEBUG
      onSubmit(submitData)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 mb-8 text-center">
          {title}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <FormField
              label="Age"
              name="age"
              type="number"
              icon={Hash}
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Department"
              name="department"
              icon={Building2}
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
            />
            <FormField
              label="Marks (0-100)"
              name="marks"
              type="number"
              step="0.1"
              icon={Award}
              value={formData.marks}
              onChange={handleChange}
              error={errors.marks}
            />
          </div>

          <FormField
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{title.includes('Update') ? 'Updating...' : 'Adding...'}</span>
              </>
            ) : (
              <span>{submitLabel}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentForm

