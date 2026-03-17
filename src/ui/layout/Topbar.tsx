import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  alpha,
  Drawer,
  List,
  ListItem,
  TextField,
  InputAdornment,
} from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import SuccessIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/WarningAmberRounded'
import ErrorIcon from '@mui/icons-material/Error'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout, setRole } from '../../features/auth/authSlice'
import { markAllNotificationsRead, markNotificationRead, setThemeMode, type UiNotification } from '../../features/ui/uiSlice'
import type { Role } from '../../features/auth/rbac'

export function Topbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const themeMode = useAppSelector((s) => s.ui.themeMode)
  const unread = useAppSelector((s) => s.ui.notifications.filter((n) => !n.read).length)

  const initials = useMemo(() => {
    const name = user?.name ?? 'User'
    return name
      .split(' ')
      .slice(0, 2)
      .map((x) => x[0]?.toUpperCase())
      .join('')
  }, [user?.name])

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const open = Boolean(anchor)

  const notifications = useAppSelector((s) => s.ui.notifications)

  const getSeverityIcon = (severity: UiNotification['severity']) => {
    switch (severity) {
      case 'success':
        return <SuccessIcon sx={{ color: 'success.main', fontSize: 20 }} />
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
      default:
        return <InfoIcon sx={{ color: 'info.main', fontSize: 20 }} />
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Box
        sx={{
          background: (t) => t.palette.background.paper,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          width: '100%',
          position: 'static',
        }}
      >
        <Toolbar sx={{ gap: 2, px: { xs: 2, md: 3 }, py: 1 }}>
          {/* Left - Greeting */}
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
              {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Monitor hospital operations and performance
            </Typography>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
              sx={{
                minWidth: 280,
                display: { xs: 'none', md: 'flex' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  backgroundColor: (t) => alpha(t.palette.background.paper, 0.8),
                  backdropFilter: 'blur(8px)',
                  border: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
                  '& fieldset': { border: 'none' },
                  '&:hover': {
                    backgroundColor: (t) => t.palette.background.paper,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Theme Toggle */}
            <IconButton
              onClick={() => dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'))}
              aria-label="toggle theme"
              sx={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: (t) => alpha(t.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
                '&:hover': {
                  backgroundColor: (t) => t.palette.background.paper,
                },
              }}
            >
              {themeMode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>

            {/* Notifications */}
            <IconButton
              aria-label="notifications"
              onClick={() => setNotifOpen(true)}
              sx={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: (t) => alpha(t.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
                '&:hover': {
                  backgroundColor: (t) => t.palette.background.paper,
                },
              }}
            >
              <Badge color="error" badgeContent={unread} max={99}>
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>

            {/* Profile Section */}
            <Box
              onClick={(e) => setAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                pl: 1.5,
                pr: 1,
                py: 0.75,
                borderRadius: 14,
                backgroundColor: (t) => alpha(t.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                border: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: (t) => t.palette.background.paper,
                  boxShadow: (t) => t.shadows[2],
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  fontWeight: 600,
                  fontSize: 14,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {user?.name ?? 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                  {user?.role ?? '—'}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </Box>
          </Box>
        </Toolbar>
      </Box>
      <Toaster position="top-right" />

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            background: (t) => t.palette.background.paper,
            borderLeft: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: (t) => `1px solid ${alpha(t.palette.divider, 0.5)}`,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {unread} unread messages
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {unread > 0 && (
                <Button
                  size="small"
                  onClick={() => {
                    dispatch(markAllNotificationsRead())
                    toast.success('All notifications marked as read')
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Mark all read
                </Button>
              )}
              <IconButton size="small" onClick={() => setNotifOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Notification List */}
          <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '40px 20px',
                  }}
                >
                  <NotificationsRoundedIcon
                    sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                    No notifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                    You're all caught up! New notifications will appear here.
                  </Typography>
                </motion.div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: 'easeOut',
                    }}
                  >
                    <ListItem
                      sx={{
                        p: 2,
                        borderBottom: (t) => `1px solid ${alpha(t.palette.divider, 0.3)}`,
                        backgroundColor: notification.read
                          ? 'transparent'
                          : (t) => alpha(t.palette.primary.main, 0.04),
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: (t) => alpha(t.palette.action.hover, 0.5),
                        },
                      }}
                      onClick={() => {
                        if (!notification.read) {
                          dispatch(markNotificationRead(notification.id))
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                        <Box sx={{ mt: 0.5 }}>{getSeverityIcon(notification.severity)}</Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.read ? 500 : 700,
                              color: 'text.primary',
                              mb: 0.5,
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.4 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {formatTime(notification.createdAt)}
                          </Typography>
                        </Box>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              mt: 1,
                            }}
                          />
                        )}
                      </Box>
                    </ListItem>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </List>
        </motion.div>
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 3,
            minWidth: 200,
            boxShadow: (t) => t.shadows[4],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: 'text.primary' }}>
              {user?.name ?? 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user?.role ?? '—'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const next: Role = user?.role === 'ADMIN' ? 'OPS_MANAGER' : 'ADMIN'
            dispatch(setRole(next))
            toast('Role switched (mock)')
            setAnchor(null)
          }}
          sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
        >
          Switch Role (mock)
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logout())
            setAnchor(null)
            navigate('/login', { replace: true })
          }}
          sx={{ borderRadius: 2, mx: 1, my: 0.5, color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

