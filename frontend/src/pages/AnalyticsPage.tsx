import React from 'react'
import { TrendingUp, Users, Key, Activity } from 'lucide-react'

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your platform usage and performance metrics.</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Keys Generated</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">89</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Key Activations</p>
              <p className="text-2xl font-semibold text-gray-900">567</p>
              <p className="text-sm text-green-600">+25% from last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Usage Growth</p>
              <p className="text-2xl font-semibold text-gray-900">+34%</p>
              <p className="text-sm text-green-600">Better than last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Generation Over Time</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Chart will be implemented with Recharts</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Chart will be implemented with Recharts</p>
          </div>
        </div>
      </div>

      {/* Top games */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Games</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Cyberpunk 2077</p>
              <p className="text-xs text-gray-500">456 keys generated</p>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">The Witcher 3</p>
              <p className="text-xs text-gray-500">342 keys generated</p>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '58%' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">GTA V</p>
              <p className="text-xs text-gray-500">234 keys generated</p>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}