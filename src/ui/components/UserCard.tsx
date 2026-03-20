import { Card, CardContent, Box, Typography, Chip, IconButton, Avatar, alpha } from '@mui/material'
import { MoreVert as MoreVertIcon, Circle as CircleIcon } from '@mui/icons-material'
import { motion, type Variants } from 'framer-motion'
import type { SystemUser } from '../../features/users/usersSlice'
import type { Role } from '../../features/auth/rbac'

interface UserCardProps {
  user: SystemUser
  onClick: () => void
  onMenuClick: (e: React.MouseEvent<HTMLElement>) => void
  index?: number
}

const roleConfig: Record<Role, { label: string; color: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error'; bgColor: string }> = {
  ADMIN: { label: 'Admin', color: 'error', bgColor: 'rgba(239, 68, 68, 0.08)' },
  OPS_MANAGER: { label: 'Operations', color: 'warning', bgColor: 'rgba(245, 158, 11, 0.08)' },
  DOCTOR: { label: 'Doctor', color: 'primary', bgColor: 'rgba(8, 145, 178, 0.08)' },
  FINANCE: { label: 'Finance', color: 'info', bgColor: 'rgba(59, 130, 246, 0.08)' },
  PHARMACY: { label: 'Pharmacy', color: 'success', bgColor: 'rgba(16, 185, 129, 0.08)' },
  LAB: { label: 'Lab Tech', color: 'secondary', bgColor: 'rgba(5, 150, 105, 0.08)' },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
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

function formatLastSeen(dateString?: string): string {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function UserCard({ user, onClick, onMenuClick, index = 0 }: UserCardProps) {
  const role = roleConfig[user.role]
  const isActive = user.status === 'ACTIVE'
  const avatarColor = getAvatarColor(user.name)

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.2, ease: 'easeOut' } 
      }}
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={onClick}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          boxShadow: (t) => t.shadows[2],
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover': {
            boxShadow: (t) => t.shadows[4],
          },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          {/* Menu Button */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onMenuClick(e)
            }}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'text.secondary',
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          {/* Avatar and Name */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: avatarColor,
                fontSize: '1.5rem',
                fontWeight: 600,
                mb: 2,
                boxShadow: `0 4px 12px ${alpha(avatarColor, 0.3)}`,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                color: 'text.primary',
                mb: 0.5,
                letterSpacing: '-0.01em',
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                mb: 1.5,
              }}
            >
              {user.email}
            </Typography>

            {/* Role Badge */}
            <Chip
              label={role.label}
              size="small"
              color={role.color}
              sx={{
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                bgcolor: role.bgColor,
                borderRadius: 1.5,
              }}
            />
          </Box>

          {/* Status and Last Seen */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CircleIcon
                sx={{
                  fontSize: 8,
                  color: isActive ? 'success.main' : 'text.disabled',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: isActive ? 'success.main' : 'text.secondary',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                }}
              >
                {isActive ? 'Active' : 'Suspended'}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
            >
              {formatLastSeen(user.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
