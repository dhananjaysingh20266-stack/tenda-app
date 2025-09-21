import { useAuthStore } from '@/store/authStore'
import { Users, Key, BarChart3, Clock, Plus, TrendingUp, Download, Settings, Activity, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const DashboardPage = () => {
  const { user, organization } = useAuthStore()

  const stats = [
    {
      name: 'Total Members',
      stat: '12',
      icon: Users,
      change: '+4.75%',
      changeType: 'increase',
      color: 'bg-primary-500',
    },
    {
      name: 'Active Keys',
      stat: '156',
      icon: Key,
      change: '+2.02%',
      changeType: 'increase',
      color: 'bg-accent-500',
    },
    {
      name: 'Monthly Usage',
      stat: '2,340',
      icon: BarChart3,
      change: '+10.18%',
      changeType: 'increase',
      color: 'bg-green-500',
    },
    {
      name: 'Avg. Session Time',
      stat: '2.4h',
      icon: Clock,
      change: '-0.15%',
      changeType: 'decrease',
      color: 'bg-orange-500',
    },
  ]

  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'generated 5 PUBG keys',
      time: '2 minutes ago',
      color: 'bg-green-500',
      icon: Key,
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'joined the organization',
      time: '1 hour ago',
      color: 'bg-blue-500',
      icon: Users,
    },
    {
      id: 3,
      user: 'System',
      action: 'exported API key batch',
      time: '3 hours ago',
      color: 'bg-yellow-500',
      icon: Download,
    },
  ]

  const quickActions = [
    {
      name: 'Add Member',
      icon: Plus,
      color: 'btn-primary',
      description: 'Invite new members to your organization',
    },
    {
      name: 'View Analytics',
      icon: TrendingUp,
      color: 'btn-secondary',
      description: 'See detailed usage statistics',
    },
    {
      name: 'Export Data',
      icon: Download,
      color: 'btn-outline',
      description: 'Download reports and data',
    },
    {
      name: 'Settings',
      icon: Settings,
      color: 'btn-outline',
      description: 'Configure organization settings',
    },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card glass-effect p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="mt-2 text-gray-600">
                  Here's what's happening with <span className="text-primary-600 font-semibold">{organization?.name}</span> today.
                </p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden sm:flex items-center space-x-2 text-gray-500"
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="card-elevated p-6 relative overflow-hidden group cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${item.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {item.stat}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`self-center flex-shrink-0 h-4 w-4 ${
                            item.changeType === 'decrease' ? 'rotate-180' : ''
                          }`} />
                          <span className="ml-1">{item.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card-elevated"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary-600" />
                    Recent Activity
                  </h3>
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-600 rounded-full">
                    Live
                  </span>
                </div>
                
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`flex-shrink-0 ${activity.color} rounded-full p-2`}>
                        <activity.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 group-hover:text-gray-700">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="card-elevated"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary-600" />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${action.color} w-full text-left p-4 rounded-lg group relative overflow-hidden`}
                    >
                      <div className="flex items-center">
                        <action.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{action.name}</div>
                          <div className="text-sm opacity-80 mt-1">{action.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage