import { Link } from 'react-router-dom'
import { Key, Clock, Shield, Zap, ArrowRight, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const ServicesPage = () => {
  const services = [
    {
      id: 'key-generation',
      name: 'Key Generation',
      description: 'Generate gaming access keys with device limits and duration controls',
      icon: Key,
      features: ['Custom key names', 'Bulk generation', 'Device limiting', 'Time-based expiry'],
      path: '/services/key-generation',
      gradient: 'from-blue-500 to-blue-600',
      featured: true,
    },
    {
      id: 'session-management',
      name: 'Session Management',
      description: 'Manage user sessions and device fingerprinting',
      icon: Shield,
      features: ['Device tracking', 'Session limits', 'Auto-logout', 'Security monitoring'],
      path: '/services/sessions',
      gradient: 'from-green-500 to-green-600',
      comingSoon: true,
    },
    {
      id: 'analytics',
      name: 'Usage Analytics',
      description: 'Track key usage and performance metrics',
      icon: Clock,
      features: ['Usage statistics', 'Performance metrics', 'Custom reports', 'Real-time data'],
      path: '/services/analytics',
      gradient: 'from-purple-500 to-purple-600',
      comingSoon: true,
    },
    {
      id: 'automation',
      name: 'API Automation',
      description: 'Automate key generation and management via API',
      icon: Zap,
      features: ['REST API', 'Webhooks', 'Batch operations', 'Integration tools'],
      path: '/services/automation',
      gradient: 'from-orange-500 to-orange-600',
      comingSoon: true,
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
            className="text-center card glass-effect p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg mb-6"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gaming Services
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools and services to enhance your gaming platform with 
              <span className="text-primary-600 font-semibold"> advanced key management</span>, 
              analytics, and automation.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`card-elevated relative overflow-hidden group ${
                  service.comingSoon ? 'opacity-90' : ''
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Featured Badge */}
                {service.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </motion.div>
                )}
                
                {/* Coming Soon Badge */}
                {service.comingSoon && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                  >
                    Coming Soon
                  </motion.div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`flex-shrink-0 h-14 w-14 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <service.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors"
                      >
                        <div className={`h-2 w-2 bg-gradient-to-r ${service.gradient} rounded-full mr-3 flex-shrink-0`} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    {service.comingSoon ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled
                        className="w-full bg-gray-200 text-gray-500 px-6 py-3 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center justify-center"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Coming Soon
                      </motion.button>
                    ) : (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to={service.path}
                          className={`w-full bg-gradient-to-r ${service.gradient} text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center group-hover:shadow-xl`}
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card glass-effect p-8 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full blur-2xl opacity-10" />
            
            <div className="relative flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg mb-6 md:mb-0 md:mr-6"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Need a custom solution? 🚀
                </h3>
                <p className="text-gray-600 mb-6">
                  Contact our team to discuss custom integrations, enterprise features,
                  or specialized gaming platform requirements. We're here to help you build something amazing.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Contact Sales
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ServicesPage