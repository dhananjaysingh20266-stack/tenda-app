import React from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'

export const GamingKeysPage: React.FC = () => {
  const gamingKeys = [
    {
      id: 1,
      keyCode: 'XXXX-XXXX-XXXX-1234',
      game: 'Cyberpunk 2077',
      service: 'Steam',
      status: 'Active',
      assignedTo: 'john.doe',
      createdAt: '2024-01-15',
      expiresAt: '2024-12-31',
    },
    {
      id: 2,
      keyCode: 'XXXX-XXXX-XXXX-5678',
      game: 'The Witcher 3',
      service: 'GOG',
      status: 'Generated',
      assignedTo: null,
      createdAt: '2024-01-14',
      expiresAt: '2024-12-31',
    },
    {
      id: 3,
      keyCode: 'XXXX-XXXX-XXXX-9012',
      game: 'GTA V',
      service: 'Epic Games',
      status: 'Expired',
      assignedTo: 'jane.smith',
      createdAt: '2023-12-01',
      expiresAt: '2024-01-01',
    },
  ]

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gaming Keys</h1>
          <p className="text-gray-600">Manage and track your gaming key inventory.</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Generate Keys
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search keys..."
            className="input-field pl-10"
          />
        </div>
        <select className="input-field w-auto">
          <option>All Games</option>
          <option>Cyberpunk 2077</option>
          <option>The Witcher 3</option>
          <option>GTA V</option>
        </select>
        <select className="input-field w-auto">
          <option>All Status</option>
          <option>Generated</option>
          <option>Active</option>
          <option>Expired</option>
        </select>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </button>
      </div>

      {/* Gaming keys table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gamingKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {key.keyCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {key.game}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {key.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      key.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : key.status === 'Generated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.assignedTo || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.expiresAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      View
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                      Assign
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}