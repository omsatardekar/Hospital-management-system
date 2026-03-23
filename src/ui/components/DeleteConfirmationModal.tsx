import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  alpha,
} from '@mui/material'
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { deleteUser, type SystemUser } from '../../features/users/usersSlice'
import { logEvent } from '../../features/audit/auditSlice'
import type { Role } from '../../features/auth/rbac'
import toast from 'react-hot-toast'

interface DeleteConfirmationModalProps {
  user: SystemUser | null
  open: boolean
  onClose: () => void
  onConfirm?: () => void
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

export function DeleteConfirmationModal({ user, open, onClose, onConfirm }: DeleteConfirmationModalProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((s) => s.auth.user)
  
  if (!user) return null

  const role = roleConfig[user.role]
  const isActive = user.status === 'ACTIVE'
  const avatarColor = getAvatarColor(user.name)
  const isProtectedUser = user.role === 'ADMIN' && user.email === 'admin@hospital.com'
  const isCurrentUser = currentUser?.id === user.id

  const handleConfirmDelete = () => {
    if (isProtectedUser) {
      toast.error('Cannot delete the main administrator account')
      onClose()
      return
    }

    if (isCurrentUser) {
      toast.error('You cannot delete your own account')
      onClose()
      return
    }

    // Delete the user
    dispatch(deleteUser(user.id))

    // Log audit event
    dispatch(logEvent({
      actorUserId: currentUser?.id || 'SYSTEM',
      actorName: currentUser?.name || 'System',
      action: 'USER_DELETED',
      entity: 'USER',
      entityId: user.id,
      meta: { 
        deletedUserName: user.name,
        deletedUserEmail: user.email,
        deletedUserRole: user.role,
      },
    }))

    toast.success('User deleted successfully')
    onConfirm?.()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Warning Header */}
        <Box
          sx={{
            bgcolor: (t) => alpha(t.palette.error.main, 0.08),
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'error.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
              Delete User Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          {/* User Info Card */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: avatarColor,
                fontWeight: 600,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Chip
                  label={role.label}
                  size="small"
                  color={role.color}
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
                <Chip
                  label={isActive ? 'Active' : 'Suspended'}
                  size="small"
                  color={isActive ? 'success' : 'default'}
                  icon={<CircleIcon sx={{ fontSize: 6 }} />}
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Warning Messages */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Deleting this user will:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: 'text.secondary' }}>
              <Typography component="li" variant="body2">
                Permanently remove the user account
              </Typography>
              <Typography component="li" variant="body2">
                Remove all associated permissions and access rights
              </Typography>
              {(user.role === 'DOCTOR') && (
                <Typography component="li" variant="body2">
                  Doctor will be removed from the Doctors module
                </Typography>
              )}
              {(user.role === 'OPS_MANAGER') && (
                <Typography component="li" variant="body2">
                  Associated patient records may become orphaned
                </Typography>
              )}
            </Box>

            {isProtectedUser && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: (t) => alpha(t.palette.warning.main, 0.08),
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'warning.main',
                }}
              >
                <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                  This is the main administrator account and cannot be deleted for system security reasons.
                </Typography>
              </Box>
            )}

            {isCurrentUser && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: (t) => alpha(t.palette.warning.main, 0.08),
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'warning.main',
                }}
              >
                <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
                  You cannot delete your own account while logged in.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={isProtectedUser || isCurrentUser}
          >
            Delete User
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
