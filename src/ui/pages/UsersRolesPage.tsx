import { useState } from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Add as AddIcon, People as PeopleIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { UsersTable } from '../components/UsersTable'
import { UserForm } from '../components/UserForm'
import { addUser, updateUser, deleteUser, type SystemUser } from '../../features/users/usersSlice'
import toast from 'react-hot-toast'

export default function UsersRolesPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)

  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
      toast.success('User deleted successfully')
    }
  }

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    dispatch(updateUser({ 
      id: userId, 
      changes: { status: newStatus as 'ACTIVE' | 'SUSPENDED' } 
    }))
    toast.success(`User ${newStatus.toLowerCase()} successfully`)
  }

  const handleFormSubmit = (userData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    if (editingUser) {
      dispatch(updateUser({ 
        id: editingUser.id, 
        changes: userData 
      }))
      toast.success('User updated successfully')
    } else {
      const newUser: SystemUser = {
        ...userData,
        id: `USER-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      dispatch(addUser(newUser))
      toast.success('User added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'ADMIN').length
  const doctorCount = users.filter(u => u.role === 'DOCTOR').length
  const activeCount = users.filter(u => u.status === 'ACTIVE').length

  return (
    <Box>
      <PageHeader
        title="Users & Role Management"
        subtitle="Manage system users, assign roles, and control access permissions"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              sx={{ borderRadius: 2 }}
            >
              Add User
            </Button>
          </motion.div>
        }
      />
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <AdminIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                {adminCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrators
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'info.main', mb: 1 }}>👨‍⚕️</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {doctorCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doctors
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'success.main', mb: 1 }}>✓</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {activeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      <UsersTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />

      <UserForm
        open={showForm}
        user={editingUser}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}

