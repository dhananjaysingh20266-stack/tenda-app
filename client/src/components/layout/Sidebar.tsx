import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Key, 
  Building, 
  Settings,
  Users,
  BarChart3 
} from 'lucide-react'

interface SidebarProps {
  userType?: 'organization' | 'individual'
}

const Sidebar = ({ userType }: SidebarProps) => {
  const organizationLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/organization', icon: Building, label: 'Organization' },
    { to: '/users', icon: Users, label: 'Members' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  const individualLinks = [
    { to: '/services', icon: Key, label: 'Services' },
    { to: '/services/key-generation', icon: Key, label: 'Generate Keys' },
    { to: '/my-keys', icon: Key, label: 'My Keys' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  const links = userType === 'organization' ? organizationLinks : individualLinks

  return (
    <aside className="w-64 bg-white shadow-sm border-r">
      <nav className="p-4 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar