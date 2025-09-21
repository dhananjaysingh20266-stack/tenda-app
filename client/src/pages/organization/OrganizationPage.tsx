import { useAuthStore } from '@/store/authStore'
import { Building, Users, Settings } from 'lucide-react'

const OrganizationPage = () => {
  const { organization } = useAuthStore()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organization</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your organization settings and team members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Organization Details
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue={organization?.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={organization?.description}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief description of your organization..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      defaultValue={organization?.website}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option>Gaming</option>
                      <option>Software</option>
                      <option>Entertainment</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-1000 employees</option>
                    <option>1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    defaultValue={organization?.billingEmail}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="billing@example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Organization Stats */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Members</span>
                  </div>
                  <span className="text-lg font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Active Keys</span>
                  </div>
                  <span className="text-lg font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Subscription</span>
                  </div>
                  <span className="text-sm font-medium text-primary-600 capitalize">
                    {organization?.subscriptionTier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Subscription
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 capitalize">
                  {organization?.subscriptionTier} Plan
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Current plan features
                </div>
                <ul className="text-sm text-gray-600 mt-4 space-y-1 text-left">
                  <li>• Up to 50 team members</li>
                  <li>• Unlimited key generation</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
                <button className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          {/* API Access */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                API Access
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value="sk_live_••••••••••••••••"
                      readOnly
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 bg-gray-50 text-sm"
                    />
                    <button className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100">
                      Copy
                    </button>
                  </div>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Regenerate API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage