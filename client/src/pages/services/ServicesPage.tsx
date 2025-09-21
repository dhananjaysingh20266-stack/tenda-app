import { Link } from 'react-router-dom'
import { Key, Clock, Shield, Zap } from 'lucide-react'

const ServicesPage = () => {
  const services = [
    {
      id: 'key-generation',
      name: 'Key Generation',
      description: 'Generate gaming access keys with device limits and duration controls',
      icon: Key,
      features: ['Custom key names', 'Bulk generation', 'Device limiting', 'Time-based expiry'],
      path: '/services/key-generation',
    },
    {
      id: 'session-management',
      name: 'Session Management',
      description: 'Manage user sessions and device fingerprinting',
      icon: Shield,
      features: ['Device tracking', 'Session limits', 'Auto-logout', 'Security monitoring'],
      path: '/services/sessions',
      comingSoon: true,
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Track key usage and performance metrics',
      icon: Clock,
      features: ['Usage statistics', 'Performance metrics', 'Custom reports', 'Real-time data'],
      path: '/services/analytics',
      comingSoon: true,
    },
    {
      id: 'automation',
      name: 'API Automation',
      description: 'Automate key generation and management via API',
      icon: Zap,
      features: ['REST API', 'Webhooks', 'Batch operations', 'Integration tools'],
      path: '/services/automation',
      comingSoon: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="mt-1 text-sm text-gray-600">
          Choose from our available services to enhance your gaming platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {service.name}
                    {service.comingSoon && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Coming Soon
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <ul className="text-sm text-gray-600 space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="h-1.5 w-1.5 bg-primary-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                {service.comingSoon ? (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <Link
                    to={service.path}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Zap className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Need a custom solution?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Contact our team to discuss custom integrations, enterprise features,
                or specialized gaming platform requirements.
              </p>
            </div>
            <div className="mt-4">
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage