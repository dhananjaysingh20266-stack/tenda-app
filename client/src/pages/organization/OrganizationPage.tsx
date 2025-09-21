import { useAuthStore } from '@/store/authStore'
import { Building, Users, Settings, Key, Copy, RefreshCw, Crown, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const OrganizationPage = () => {
  const { organization } = useAuthStore()

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
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-12 w-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg mr-4"
              >
                <Building className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
                <p className="text-gray-600 mt-1">
                  Manage your organization settings and team members.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="card-elevated p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary-600" />
                  Organization Details
                </h3>
                
                <form className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue={organization?.name}
                      className="input"
                      placeholder="Enter organization name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={organization?.description}
                      className="input min-h-[80px] resize-none"
                      placeholder="Brief description of your organization..."
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        defaultValue={organization?.website}
                        className="input"
                        placeholder="https://example.com"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <select className="input">
                        <option>Gaming</option>
                        <option>Software</option>
                        <option>Entertainment</option>
                        <option>Technology</option>
                        <option>Other</option>
                      </select>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Size
                      </label>
                      <select className="input">
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201-1000 employees</option>
                        <option>1000+ employees</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Email
                      </label>
                      <input
                        type="email"
                        defaultValue={organization?.billingEmail}
                        className="input"
                        placeholder="billing@example.com"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 }}
                    className="pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn-primary"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Save Changes
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Organization Stats */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Users, label: 'Members', value: '12', color: 'text-blue-600' },
                    { icon: Key, label: 'Active Keys', value: '156', color: 'text-green-600' },
                    { icon: Shield, label: 'Subscription', value: organization?.subscriptionTier || 'Pro', color: 'text-purple-600' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <stat.icon className={`h-5 w-5 ${stat.color} mr-3`} />
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Subscription Info */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                  Subscription
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-bold mb-2">
                    <Crown className="h-4 w-4 mr-1" />
                    {organization?.subscriptionTier || 'Pro'} Plan
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Current plan features</p>
                  <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                    {[
                      'Up to 50 team members',
                      'Unlimited key generation',
                      'Advanced analytics',
                      'Priority support'
                    ].map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        className="flex items-center"
                      >
                        <div className="h-1.5 w-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary w-full"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </motion.button>
                </div>
              </div>

              {/* API Access */}
              <div className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-green-600" />
                  API Access
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <input
                        type="text"
                        value="sk_live_••••••••••••••••"
                        readOnly
                        className="flex-1 py-2 px-3 bg-gray-50 text-sm border-0 focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Regenerate API Key
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrganizationPage