import { useAuthStore } from '@/store/authStore'
import { Users, Key, BarChart3, Clock } from 'lucide-react'

const DashboardPage = () => {
  const { user, organization } = useAuthStore()

  const stats = [
    {
      name: 'Total Members',
      stat: '12',
      icon: Users,
      change: '+4.75%',
      changeType: 'increase',
    },
    {
      name: 'Active Keys',
      stat: '156',
      icon: Key,
      change: '+2.02%',
      changeType: 'increase',
    },
    {
      name: 'Monthly Usage',
      stat: '2,340',
      icon: BarChart3,
      change: '+10.18%',
      changeType: 'increase',
    },
    {
      name: 'Avg. Session Time',
      stat: '2.4h',
      icon: Clock,
      change: '-0.15%',
      changeType: 'decrease',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with {organization?.name} today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-primary-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    John Doe generated 5 PUBG keys
                  </p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    New member Jane Smith joined
                  </p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    API key batch exported
                  </p>
                  <p className="text-sm text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
                Add Member
              </button>
              <button className="bg-secondary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary-700 transition-colors">
                View Analytics
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Export Data
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage