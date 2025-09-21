import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  isOn: boolean
  onToggle: () => void
  leftLabel: string
  rightLabel: string
  className?: string
}

const ToggleSwitch = ({ isOn, onToggle, leftLabel, rightLabel, className = '' }: ToggleSwitchProps) => {
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Left Label */}
      <motion.div
        className={`text-sm font-medium transition-colors duration-200 ${
          !isOn ? 'text-primary-600' : 'text-gray-500'
        }`}
        animate={{ scale: !isOn ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {leftLabel}
      </motion.div>

      {/* Toggle Switch */}
      <motion.div
        className={`relative w-14 h-7 rounded-full cursor-pointer shadow-inner ${
          isOn ? 'bg-primary-600' : 'bg-primary-600'
        }`}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
        animate={{
          backgroundColor: isOn ? '#0284c7' : '#0284c7'
        }}
        transition={{ duration: 0.2 }}
        role="switch"
        aria-checked={isOn}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        {/* Switch Handle */}
        <motion.div
          className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            x: isOn ? 28 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Inner highlight for visual feedback */}
          <motion.div
            className="w-3 h-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full"
            animate={{
              scale: isOn ? 0.8 : 1,
              opacity: isOn ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </motion.div>

      {/* Right Label */}
      <motion.div
        className={`text-sm font-medium transition-colors duration-200 ${
          isOn ? 'text-primary-600' : 'text-gray-500'
        }`}
        animate={{ scale: isOn ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {rightLabel}
      </motion.div>
    </div>
  )
}

export default ToggleSwitch