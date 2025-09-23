import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { analyticsApi } from '@/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Key, 
  Activity,
  Download,
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeKeys: number
    totalUsage: number
    avgSessionTime: string
  }
  usage: {
    daily: Array<{ date: string; keys: number; users: number }>
    weekly: Array<{ week: string; keys: number; users: number }>
    monthly: Array<{ month: string; keys: number; users: number }>
  }
  topGames: Array<{ name: string; usage: number; change: number }>
  recentActivity: Array<{ 
    id: number
    user: string
    action: string
    time: string
    type: 'success' | 'warning' | 'info'
  }>
}

const AnalyticsPage = () => {
  const { organization } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all analytics data
        const [overviewResponse, usageResponse, gamesResponse, activityResponse] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getUsageData(timeRange),
          analyticsApi.getTopGames(),
          analyticsApi.getRecentActivity()
        ])
        
        setAnalyticsData({
          overview: overviewResponse.data,
          usage: usageResponse.data,
          topGames: gamesResponse.data,
          recentActivity: activityResponse.data
        })
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
        toast.error('Failed to load analytics data')
        // Set empty data on error instead of mock data
        setAnalyticsData({
          overview: {
            totalUsers: 0,
            activeKeys: 0,
            totalUsage: 0,
            avgSessionTime: 'N/A'
          },
          usage: {
            daily: [],
            weekly: [],
            monthly: []
          },
          topGames: [],
          recentActivity: []
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ]

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color} rounded-lg p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? (
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                )}
                <span className="sr-only">{changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </motion.div>
  )

  const UsageChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
        <div className="flex space-x-2">
          <button className="text-sm px-3 py-1 bg-primary-100 text-primary-700 rounded-md">Keys</button>
          <button className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md">Users</button>
        </div>
      </div>
      
      {/* Simple chart visualization */}
      <div className="space-y-4">
        {analyticsData?.usage.daily.map((item) => (
          <div key={item.date} className="flex items-center">
            <div className="w-16 text-sm text-gray-600">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div className="flex-1 ml-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(item.keys / 80) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.keys}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const TopGamesCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Games</h3>
      <div className="space-y-4">
        {analyticsData?.topGames.map((game, index) => (
          <div key={game.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{game.name}</p>
                <p className="text-sm text-gray-600">{game.usage}% usage</p>
              </div>
            </div>
            <div className={`flex items-center text-sm ${
              game.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {game.change > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(game.change)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const ActivityFeed = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">View all</button>
      </div>
      <div className="space-y-4">
        {analyticsData?.recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-2 ${
              activity.type === 'success' ? 'bg-green-500' :
              activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

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
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-4"
                >
                  <BarChart3 className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600 mt-1">
                    Insights and usage statistics for {organization?.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {timeRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-secondary flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Members"
              value={analyticsData?.overview.totalUsers}
              change="+4.75%"
              changeType="increase"
              icon={Users}
              color="bg-primary-500"
            />
            <StatCard
              title="Active Keys"
              value={analyticsData?.overview.activeKeys}
              change="+2.02%"
              changeType="increase"
              icon={Key}
              color="bg-accent-500"
            />
            <StatCard
              title="Total Usage"
              value={analyticsData?.overview.totalUsage?.toLocaleString()}
              change="+10.18%"
              changeType="increase"
              icon={Activity}
              color="bg-green-500"
            />
            <StatCard
              title="Avg. Session"
              value={analyticsData?.overview.avgSessionTime}
              change="-0.15%"
              changeType="decrease"
              icon={Clock}
              color="bg-orange-500"
            />
          </div>

          {/* Charts and Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Usage Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <UsageChart />
            </motion.div>

            {/* Top Games */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TopGamesCard />
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <ActivityFeed />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsPage