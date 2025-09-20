import React from 'react'
import { Users, Key, Activity, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export const OverviewPage: React.FC = () => {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Total Users',
      value: '24',
      icon: Users,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Gaming Keys',
      value: '1,234',
      icon: Key,
      change: '+18%',
      changeType: 'positive',
    },
    {
      name: 'Active Sessions',
      value: '89',
      icon: Activity,
      change: '+7%',
      changeType: 'positive',
    },
    {
      name: 'Security Events',
      value: '3',
      icon: Shield,
      change: '-25%',
      changeType: 'negative',
    },
  ]

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your organization today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-2 w-2 bg-green-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">
                New gaming key generated for <span className="font-medium">Cyberpunk 2077</span>
              </p>
              <span className="ml-auto text-xs text-gray-500">2m ago</span>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">
                User <span className="font-medium">john.doe</span> logged in
              </p>
              <span className="ml-auto text-xs text-gray-500">5m ago</span>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-2 w-2 bg-yellow-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">
                Login approval required for new device
              </p>
              <span className="ml-auto text-xs text-gray-500">10m ago</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-primary">
              Generate New Keys
            </button>
            <button className="w-full btn-secondary">
              Invite Users
            </button>
            <button className="w-full btn-secondary">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}