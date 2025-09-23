import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { membersApi } from '@/api'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Users, 
  Search, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  Crown,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Member {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  lastActive: string
  joinedAt: string
  avatar?: string
  permissions: string[]
}

const MembersPage = () => {
  const { organization } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        const response = await membersApi.getMembers({
          status: statusFilter === 'all' ? undefined : statusFilter,
          role: roleFilter === 'all' ? undefined : roleFilter,
          search: searchTerm || undefined
        })
        setMembers(response.data)
      } catch (error) {
        console.error('Failed to fetch members:', error)
        toast.error('Failed to load members')
        setMembers([]) // Clear members on error instead of showing mock data
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [statusFilter, roleFilter, searchTerm])

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 'member':
        return <Shield className="h-4 w-4 text-blue-500" />
      case 'viewer':
        return <Users className="h-4 w-4 text-gray-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        )
      default:
        return null
    }
  }

  const InviteModal = () => {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('member')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        setIsSubmitting(true)
        await membersApi.inviteMember({ email, role })
        // Refresh members list
        const response = await membersApi.getMembers()
        setMembers(response.data)
        setShowInviteModal(false)
        setEmail('')
        setRole('member')
      } catch (error) {
        console.error('Failed to invite member:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    if (!showInviteModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Invite New Member</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="member@company.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary"
              >
                {isSubmitting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  const MemberRow = ({ member }: { member: Member }) => (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {member.email}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getRoleIcon(member.role)}
          <span className="ml-2 text-sm text-gray-900 capitalize">{member.role}</span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(member.status)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.lastActive}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(member.joinedAt).toLocaleDateString()}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Edit2 className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 animate-pulse text-primary-600" />
          <span className="text-lg text-gray-600">Loading members...</span>
        </div>
      </div>
    )
  }

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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4"
                >
                  <Users className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
                  <p className="text-gray-600 mt-1">
                    Manage team members and their permissions for {organization?.name}
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInviteModal(true)}
                className="btn-primary flex items-center"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </motion.button>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card-elevated p-6"
          >
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input"
                  />
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex space-x-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input min-w-0"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
                
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="input min-w-0"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</div>
                <div className="text-sm text-green-700">Active Members</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{members.filter(m => m.status === 'pending').length}</div>
                <div className="text-sm text-yellow-700">Pending Invites</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{members.filter(m => m.role === 'admin').length}</div>
                <div className="text-sm text-blue-700">Administrators</div>
              </div>
            </div>
          </motion.div>

          {/* Members Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card-elevated overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by inviting a team member.'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="btn-primary flex items-center mx-auto"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      <InviteModal />
    </div>
  )
}

export default MembersPage