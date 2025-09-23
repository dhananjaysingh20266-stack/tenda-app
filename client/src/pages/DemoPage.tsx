import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserPlus,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Bell,
  User,
  Monitor,
  Clock,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Demo component to showcase the member invitation with password field
const DemoMemberInvitation = () => {
  const [email, setEmail] = useState('john.doe@company.com')
  const [role, setRole] = useState('member')
  const [password, setPassword] = useState('aK8#mN9$xP2w')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, _setIsSubmitting] = useState(false)

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <UserPlus className="h-5 w-5 mr-2 text-primary-600" />
        Invite New Member
      </h3>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="member@company.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center justify-between">
              <span>Temporary Password</span>
              <motion.button
                type="button"
                onClick={generatePassword}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </motion.button>
            </div>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Auto-generated password"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.button>
              <motion.button
                type="button"
                onClick={copyPassword}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors mr-1"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Member can use this password for individual login. Password can be edited if needed.
          </p>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Invite'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

// Demo component for login approval notifications
const DemoLoginApproval = () => {
  const loginRequests = [
    {
      id: 1,
      userId: 42,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      userId: 38,
      ipAddress: '10.0.2.15',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...',
      createdAt: '2024-01-20T10:25:00Z'
    }
  ]

  const formatTimeAgo = (dateString: string) => {
    const diffMins = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000)
    return diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Login Approval Requests</h3>
              <p className="text-sm text-gray-600">
                {loginRequests.length} pending requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {loginRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        User ID: {request.userId}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(request.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-11 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Monitor className="h-3 w-3 mr-2" />
                      IP: {request.ipAddress}
                    </div>
                    <div className="text-xs">
                      User-Agent: {request.userAgent.substring(0, 60)}...
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Allow
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 flex items-center"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Deny
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Auto-refreshes every 5 seconds • Click outside to close
        </p>
      </div>
    </motion.div>
  )
}

// Demo component for login approval waiting
const DemoLoginWaiting = () => {
  const [elapsedTime, _setElapsedTime] = useState(125) // 2:05

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full"
    >
      <motion.div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 text-center">
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
        </motion.div>

        {/* Main Status Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold mb-4 text-blue-600"
        >
          Waiting for organization approval...
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-6 leading-relaxed"
        >
          Your login request has been sent to the organization administrators. 
          They will receive a notification to approve or deny your access.
        </motion.p>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Security Check</span>
          </div>
          <p className="text-xs text-blue-700">
            This additional approval step helps protect your organization's resources 
            and ensures only authorized members can access services.
          </p>
        </motion.div>

        {/* Time Elapsed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500"
        >
          Time elapsed: <span className="font-mono">{formatTime(elapsedTime)}</span>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-6"
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Auto-refresh note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-xs text-gray-400 mt-4"
      >
        Status updates automatically every 5 seconds
      </motion.p>
    </motion.div>
  )
}

const DemoPage = () => {
  const [activeDemo, setActiveDemo] = useState<'invitation' | 'approval' | 'waiting'>('invitation')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Member Invitation & Login Approval System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhanced member invitation with password generation and copy functionality, 
            plus real-time login approval system for organization security.
          </p>
        </motion.div>

        {/* Demo Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            {[
              { key: 'invitation', label: 'Member Invitation' },
              { key: 'approval', label: 'Login Approval' },
              { key: 'waiting', label: 'Approval Waiting' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveDemo(key as any)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeDemo === key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="flex justify-center">
          {activeDemo === 'invitation' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                Enhanced Member Invitation Modal
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Now includes auto-generated password with copy functionality and manual editing capability.
                The password is sent to the member for individual login access.
              </p>
              <DemoMemberInvitation />
            </div>
          )}

          {activeDemo === 'approval' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                Real-time Login Approval System
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Organization administrators receive real-time notifications for member login requests.
                They can approve or deny access with a single click.
              </p>
              <DemoLoginApproval />
            </div>
          )}

          {activeDemo === 'waiting' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                Login Approval Waiting Screen
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                Individual members see this modern waiting screen while their login request is being reviewed.
                Status updates automatically every 5 seconds with live polling.
              </p>
              <div className="flex justify-center">
                <DemoLoginWaiting />
              </div>
            </div>
          )}
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            New Features Implemented
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Copy className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Password Generation & Copy</h4>
              <p className="text-sm text-gray-600">Auto-generated secure passwords with one-click copy functionality</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Notifications</h4>
              <p className="text-sm text-gray-600">Instant notifications for organization admins with live updates</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Approval Flow</h4>
              <p className="text-sm text-gray-600">Enhanced security with approval-based individual login access</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">5-Second Polling</h4>
              <p className="text-sm text-gray-600">Automatic status updates every 5 seconds for real-time experience</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Individual Member Access</h4>
              <p className="text-sm text-gray-600">Members can login individually after receiving organization approval</p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Modern UI/UX</h4>
              <p className="text-sm text-gray-600">Beautiful, user-friendly interfaces with smooth animations</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DemoPage