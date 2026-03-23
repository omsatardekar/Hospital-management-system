import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Circle as CircleIcon,
  PersonAdd as PersonAddIcon,
  Update as UpdateIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { type SystemUser, updateUser } from '../../features/users/usersSlice'
import { logEvent } from '../../features/audit/auditSlice'
import type { Role } from '../../features/auth/rbac'
import toast from 'react-hot-toast'

interface UserDetailsDrawerProps {
  user: SystemUser | null
  open: boolean
  onClose: () => void
  onDelete: (user: SystemUser) => void
}

interface TimelineEvent {
  id: string
  type: 'created' | 'updated' | 'status_changed' | 'role_changed' | 'deleted' | 'login'
  description: string
  timestamp: string
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'error' | 'info'
}

const roleConfig: Record<Role, { label: string; color: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error' }> = {
  ADMIN: { label: 'Administrator', color: 'error' },
  OPS_MANAGER: { label: 'Operations Manager', color: 'warning' },
  DOCTOR: { label: 'Doctor', color: 'primary' },
  FINANCE: { label: 'Finance Manager', color: 'info' },
  PHARMACY: { label: 'Pharmacy Staff', color: 'success' },
  LAB: { label: 'Lab Technician', color: 'secondary' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  const colors = ['#0891b2', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function UserDetailsDrawer({ user, open, onClose, onDelete }: UserDetailsDrawerProps) {
  const dispatch = useAppDispatch()
  const auditEvents = useAppSelector((s) => s.audit.events)
  const currentUser = useAppSelector((s) => s.auth.user)
  const [activeTab, setActiveTab] = useState(0)
  const [editForm, setEditForm] = useState<Partial<SystemUser>>({})

  // Generate timeline events from audit log
  const timelineEvents = useMemo(() => {
    if (!user) return []
    
    const events: TimelineEvent[] = [
      // User creation
      {
        id: `created-${user.id}`,
        type: 'created',
        description: `User account created with ${roleConfig[user.role].label} role`,
        timestamp: user.createdAt,
        icon: <PersonAddIcon />,
        color: 'success',
      },
    ]

    // Find related audit events
    const userAuditEvents = auditEvents.filter(
      (e) => e.entityId === user.id || e.meta?.userId === user.id
    )

    userAuditEvents.forEach((event) => {
      switch (event.action) {
        case 'USER_UPDATED':
          events.push({
            id: event.id,
            type: 'updated',
            description: `Profile updated by ${event.actorName}`,
            timestamp: event.createdAt,
            icon: <UpdateIcon />,
            color: 'primary',
          })
          break
        case 'USER_STATUS_CHANGED':
          events.push({
            id: event.id,
            type: 'status_changed',
            description: `Status changed to ${event.meta?.newStatus || 'unknown'}`,
            timestamp: event.createdAt,
            icon: event.meta?.newStatus === 'ACTIVE' ? <CheckCircleIcon /> : <BlockIcon />,
            color: event.meta?.newStatus === 'ACTIVE' ? 'success' : 'warning',
          })
          break
        case 'USER_ROLE_CHANGED':
          events.push({
            id: event.id,
            type: 'role_changed',
            description: `Role changed to ${event.meta?.newRole || 'unknown'}`,
            timestamp: event.createdAt,
            icon: <BadgeIcon />,
            color: 'info',
          })
          break
        case 'USER_DELETED':
          events.push({
            id: event.id,
            type: 'deleted',
            description: 'User account deleted',
            timestamp: event.createdAt,
            icon: <DeleteForeverIcon />,
            color: 'error',
          })
          break
      }
    })

    // Sort by timestamp descending
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [user, auditEvents])

  const handleEditClick = () => {
    if (!user) return
    setEditForm({ ...user })
    setActiveTab(1)
  }

  const handleCancelEdit = () => {
    setActiveTab(0)
    if (user) setEditForm({ ...user })
  }

  const handleSaveEdit = () => {
    if (!user || !editForm.name || !editForm.email) return

    const changes: Partial<SystemUser> = {}
    if (editForm.name !== user.name) changes.name = editForm.name
    if (editForm.email !== user.email) changes.email = editForm.email
    if (editForm.role !== user.role) changes.role = editForm.role
    if (editForm.status !== user.status) changes.status = editForm.status

    if (Object.keys(changes).length > 0) {
      dispatch(updateUser({ id: user.id, changes }))
      
      // Log audit event
      dispatch(logEvent({
        actorUserId: currentUser?.id || 'SYSTEM',
        actorName: currentUser?.name || 'System',
        action: 'USER_UPDATED',
        entity: 'USER',
        entityId: user.id,
        meta: { changes },
      }))

      toast.success('User updated successfully')
    }

    setActiveTab(0)
  }

  const handleToggleStatus = () => {
    if (!user) return
    
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
  }

  const handleDelete = () => {
    if (!user) return
    onDelete(user)
    onClose()
  }

  if (!user) return null

  const role = roleConfig[user.role]
  const isActive = user.status === 'ACTIVE'
  const avatarColor = getAvatarColor(user.name)
  const isProtectedUser = user.role === 'ADMIN' && user.email === 'admin@hospital.com'

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          bgcolor: 'background.default',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Profile Header */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: avatarColor,
              fontSize: '2rem',
              fontWeight: 600,
              mx: 'auto',
              mb: 2,
              boxShadow: `0 8px 24px ${avatarColor}40`,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Chip
              label={role.label}
              color={role.color}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={isActive ? 'Active' : 'Suspended'}
              color={isActive ? 'success' : 'default'}
              size="small"
              icon={<CircleIcon sx={{ fontSize: 8 }} />}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color={isActive ? 'warning' : 'success'}
              startIcon={isActive ? <BlockIcon /> : <CheckCircleIcon />}
              onClick={handleToggleStatus}
              disabled={isProtectedUser}
            >
              {isActive ? 'Suspend' : 'Activate'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={isProtectedUser}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Edit" />
          <Tab label="Activity" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3, minHeight: 300 }}>
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                  User Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{user.name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email Address</Typography>
                      <Typography variant="body1">{user.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BadgeIcon sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Role</Typography>
                      <Typography variant="body1">{role.label}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircleIcon sx={{ color: isActive ? 'success.main' : 'text.disabled' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Typography variant="body1">{isActive ? 'Active' : 'Suspended'}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 4, color: 'text.secondary' }}>
                  Account Statistics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">User ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {user.id}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Created</Typography>
                    <Typography variant="body2">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Edit Tab */}
            {activeTab === 1 && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    variant="outlined"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={editForm.role || ''}
                      label="Role"
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value as Role })}
                    >
                      <MenuItem value="ADMIN">Administrator</MenuItem>
                      <MenuItem value="OPS_MANAGER">Operations Manager</MenuItem>
                      <MenuItem value="DOCTOR">Doctor</MenuItem>
                      <MenuItem value="FINANCE">Finance</MenuItem>
                      <MenuItem value="PHARMACY">Pharmacy</MenuItem>
                      <MenuItem value="LAB">Lab Technician</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editForm.status || ''}
                      label="Status"
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'ACTIVE' | 'SUSPENDED' })}
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="SUSPENDED">Suspended</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSaveEdit}
                      disabled={!editForm.name || !editForm.email}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeTab === 2 && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3, color: 'text.secondary' }}>
                  Activity Timeline
                </Typography>
                {timelineEvents.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {timelineEvents.map((event, index) => (
                      <Box key={event.id} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                        {/* Timeline line */}
                        {index < timelineEvents.length - 1 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 20,
                              top: 40,
                              bottom: -16,
                              width: 2,
                              bgcolor: 'divider',
                            }}
                          />
                        )}
                        {/* Timeline dot */}
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: `${event.color}.main`,
                            color: 'white',
                            flexShrink: 0,
                            zIndex: 1,
                          }}
                        >
                          {event.icon}
                        </Box>
                        {/* Content */}
                        <Box sx={{ pb: 3, pt: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {event.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(event.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No activity recorded yet
                    </Typography>
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Drawer>
  )
}
