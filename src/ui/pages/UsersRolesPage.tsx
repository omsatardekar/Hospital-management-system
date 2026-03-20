import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  Typography,
  alpha,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  TableChart as TableViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Badge as StaffIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { StatCard } from '../components/StatCard'
import { UserCard } from '../components/UserCard'
import { UsersTable } from '../components/UsersTable'
import { UserForm } from '../components/UserForm'
import { UserDetailsDrawer } from '../components/UserDetailsDrawer'
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal'
import {
  addUser,
  updateUser,
  type SystemUser,
} from '../../features/users/usersSlice'
import { logEvent } from '../../features/audit/auditSlice'
import type { Role } from '../../features/auth/rbac'
import toast from 'react-hot-toast'

export default function UsersRolesPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const currentUser = useAppSelector((state) => state.auth.user)

  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  const [showUserDrawer, setShowUserDrawer] = useState(false)
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuUser, setMenuUser] = useState<SystemUser | null>(null)

  const canDeleteUsers = currentUser?.role === 'ADMIN'

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === 'ACTIVE').length
    const doctorCount = users.filter((u) => u.role === 'DOCTOR').length
    const staffCount = users.filter((u) => ['OPS_MANAGER', 'FINANCE', 'PHARMACY', 'LAB'].includes(u.role)).length
    const adminCount = users.filter((u) => u.role === 'ADMIN').length

    return { totalUsers, activeUsers, doctorCount, staffCount, adminCount }
  }, [users])

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user)
    setShowForm(true)
    handleMenuClose()
  }

  const handleViewUser = (user: SystemUser) => {
    setSelectedUser(user)
    setShowUserDrawer(true)
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, user: SystemUser) => {
    e.stopPropagation()
    setMenuAnchorEl(e.currentTarget)
    setMenuUser(user)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuUser(null)
  }

  const handleToggleStatus = (user: SystemUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    dispatch(updateUser({ id: user.id, changes: { status: newStatus } }))
    dispatch(logEvent({
      actorUserId: currentUser?.id || 'SYSTEM',
      actorName: currentUser?.name || 'System',
      action: 'USER_STATUS_CHANGED',
      entity: 'USER',
      entityId: user.id,
      meta: { oldStatus: user.status, newStatus },
    }))
    toast.success(`User ${newStatus.toLowerCase() === 'active' ? 'activated' : 'suspended'} successfully`)
    handleMenuClose()
  }

  const handleDeleteClick = (user: SystemUser) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
    handleMenuClose()
  }

  const handleFormSubmit = (userData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    if (editingUser) {
      dispatch(updateUser({ id: editingUser.id, changes: userData }))
      dispatch(logEvent({
        actorUserId: currentUser?.id || 'SYSTEM',
        actorName: currentUser?.name || 'System',
        action: 'USER_UPDATED',
        entity: 'USER',
        entityId: editingUser.id,
        meta: { changes: userData },
      }))
      toast.success('User updated successfully')
    } else {
      const newUser: SystemUser = {
        ...userData,
        id: `USER-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      dispatch(addUser(newUser))
      dispatch(logEvent({
        actorUserId: currentUser?.id || 'SYSTEM',
        actorName: currentUser?.name || 'System',
        action: 'USER_CREATED',
        entity: 'USER',
        entityId: newUser.id,
        meta: { role: newUser.role, email: newUser.email },
      }))
      toast.success('User added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  const roleFilters: { value: 'ALL' | Role; label: string; color: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error' }[] = [
    { value: 'ALL', label: 'All', color: 'primary' },
    { value: 'ADMIN', label: 'Admin', color: 'error' },
    { value: 'DOCTOR', label: 'Doctors', color: 'primary' },
    { value: 'OPS_MANAGER', label: 'Staff', color: 'warning' },
    { value: 'FINANCE', label: 'Finance', color: 'info' },
    { value: 'PHARMACY', label: 'Pharmacy', color: 'success' },
    { value: 'LAB', label: 'Lab', color: 'secondary' },
  ]

  return (
    <Box>
      <PageHeader
        title="Users & Role Management"
        subtitle="Manage system users, assign roles, and control access permissions"
        right={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddUser} sx={{ borderRadius: 3, px: 3 }}>
              Add User
            </Button>
          </motion.div>
        }
      />

      {/* KPI Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex' }}>
              <StatCard title="Total Users" value={kpis.totalUsers} icon={<PeopleIcon sx={{ fontSize: 28 }} />} color="primary" delay={0} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex' }}>
              <StatCard title="Active Users" value={kpis.activeUsers} change={{ value: Math.round((kpis.activeUsers / Math.max(kpis.totalUsers, 1)) * 100), trend: 'up' }} icon={<CheckCircleIcon sx={{ fontSize: 28 }} />} color="success" delay={0.1} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex' }}>
              <StatCard title="Doctors" value={kpis.doctorCount} icon={<DoctorIcon sx={{ fontSize: 28 }} />} color="info" delay={0.2} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', display: 'flex' }}>
              <StatCard title="Staff & Others" value={kpis.staffCount + kpis.adminCount} icon={<StaffIcon sx={{ fontSize: 28 }} />} color="warning" delay={0.3} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Controls Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3, 
          mb: 4, 
          alignItems: { xs: 'stretch', md: 'center' }, 
          justifyContent: 'space-between',
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: (t) => t.shadows[1]
        }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
            <TextField
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ 
                minWidth: { xs: '100%', sm: 320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: (t) => alpha(t.palette.action.hover, 0.04)
                }
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            />
            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mr: 1, letterSpacing: 1 }}>
                Filter By:
              </Typography>
              {roleFilters.map((filter) => (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  onClick={() => setRoleFilter(filter.value)}
                  color={roleFilter === filter.value ? filter.color : 'default'}
                  variant={roleFilter === filter.value ? 'filled' : 'outlined'}
                  sx={{ 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    borderRadius: 2,
                    height: 32,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      bgcolor: roleFilter === filter.value ? undefined : 'action.hover',
                      transform: 'translateY(-1px)'
                    } 
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, borderLeft: { md: 1 }, borderColor: { md: 'divider' }, pl: { md: 2 } }}>
            <ToggleButtonGroup value={viewMode} exclusive onChange={(_, newValue) => newValue && setViewMode(newValue)} size="small" sx={{ 
              bgcolor: (t) => alpha(t.palette.action.hover, 0.04),
              p: 0.5,
              borderRadius: 3,
              '& .MuiToggleButton-root': { 
                borderRadius: 2.5, 
                px: 2,
                border: 'none',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  boxShadow: (t) => t.shadows[2],
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }
              } 
            }}>
              <ToggleButton value="grid"><GridViewIcon sx={{ mr: 0.5, fontSize: 18 }} /> Grid</ToggleButton>
              <ToggleButton value="table"><TableViewIcon sx={{ mr: 0.5, fontSize: 18 }} /> Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </motion.div>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredUsers.length} of {users.length} users
      </Typography>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Grid container spacing={3}>
              {filteredUsers.map((user, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id} sx={{ display: 'flex' }}>
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <UserCard user={user} onClick={() => handleViewUser(user)} onMenuClick={(e) => handleMenuOpen(e, user)} index={index} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UsersTable users={filteredUsers} onEdit={handleEditUser} onDelete={(userId) => { const user = users.find((u) => u.id === userId); if (user) handleDeleteClick(user) }} onToggleStatus={(userId, _) => { const user = users.find((u) => u.id === userId); if (user) handleToggleStatus(user) }} />
          </motion.div>
        )}
      </AnimatePresence>

      {filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'action.hover', borderRadius: 3 }}>
          <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No users found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your search or filter criteria</Typography>
        </Box>
      )}

      {/* Menus & Modals */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ sx: { minWidth: 180, borderRadius: 2 } }}>
        <MenuItem onClick={() => menuUser && handleEditUser(menuUser)}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit User</MenuItem>
        {menuUser && (
          <MenuItem onClick={() => menuUser && handleToggleStatus(menuUser)}>
            {menuUser.status === 'ACTIVE' ? <><BlockIcon fontSize="small" sx={{ mr: 1 }} /> Suspend</> : <><CheckCircleIcon fontSize="small" sx={{ mr: 1 }} /> Activate</>}
          </MenuItem>
        )}
        {canDeleteUsers && menuUser && (
          <MenuItem onClick={() => menuUser && handleDeleteClick(menuUser)} disabled={menuUser?.role === 'ADMIN' && menuUser?.email === 'admin@hospital.com'} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <UserDetailsDrawer user={selectedUser} open={showUserDrawer} onClose={() => { setShowUserDrawer(false); setSelectedUser(null) }} onDelete={(user) => handleDeleteClick(user)} />
      <UserForm open={showForm} user={editingUser} onClose={handleFormClose} onSubmit={handleFormSubmit} />
      <DeleteConfirmationModal user={userToDelete} open={showDeleteModal} onClose={() => { setShowDeleteModal(false); setUserToDelete(null) }} onConfirm={() => setUserToDelete(null)} />
    </Box>
  )
}

