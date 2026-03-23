import {
  Box,
  Tooltip,
  useTheme,
  alpha,
  Badge,
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import { NavLink, useLocation } from 'react-router-dom'
import { DOCTOR_NAV_ITEMS, PHARMACIST_NAV_ITEMS, ADMIN_NAV_ITEMS, NAV_ITEMS as DEFAULT_NAV } from './nav'
import { navIcon } from './icons'
import { useAppSelector } from '../../app/hooks'
import { hasPermission } from '../../features/auth/rbac'
import { motion } from 'framer-motion'

export function Sidebar() {
  const user = useAppSelector((s) => s.auth.user)
  const role = user?.role ?? null
  const location = useLocation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  // Select navigation items based on role
  let navItems = DEFAULT_NAV
  if (role === 'DOCTOR') navItems = DOCTOR_NAV_ITEMS
  if (role === 'PHARMACY') navItems = PHARMACIST_NAV_ITEMS
  if (role === 'ADMIN') navItems = ADMIN_NAV_ITEMS

  const visibleItems = navItems.filter((i) => hasPermission(role, i.permission))

  // Dynamic theme colors
  const primaryColor = role === 'DOCTOR' ? (isDark ? '#0ea5e9' : '#0d9488') : (role === 'ADMIN' ? (isDark ? '#0891b2' : '#0891b2') : (isDark ? '#38bdf8' : '#0891b2'))
  const secondaryColor = role === 'DOCTOR' ? (isDark ? '#2563eb' : '#0f766e') : (role === 'ADMIN' ? (isDark ? '#0e7490' : '#0e7490') : (isDark ? '#0284c7' : '#0e7490'))

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1200,
      }}
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Box
          sx={{
            width: 72,
            borderRadius: 36,
            overflow: 'hidden',
            boxShadow: isDark
              ? `0 20px 60px ${alpha(theme.palette.common.black, 0.5)}, 0 8px 24px ${alpha(primaryColor, 0.2)}`
              : `0 20px 60px ${alpha(primaryColor, 0.35)}, 0 8px 24px rgba(0,0,0,0.2)`,
            border: `3px solid ${isDark ? alpha(theme.palette.divider, 0.2) : 'rgba(255,255,255,0.7)'}`,
            display: 'flex',
            flexDirection: 'column',
            background: isDark
              ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 12%, ${alpha(primaryColor, 0.9)} 12%, ${alpha(secondaryColor, 0.9)} 88%, ${alpha(theme.palette.background.paper, 0.95)} 88%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(180deg, #ffffff 0%, #f1f5f9 12%, ${primaryColor} 12%, ${secondaryColor} 88%, #f1f5f9 88%, #ffffff 100%)`,
            backdropFilter: isDark ? 'blur(10px)' : 'none',
          }}
        >
          {/* Logo Cap */}
          <Box sx={{ p: 2, pt: 3.5, pb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${alpha(primaryColor, 0.5)}`,
                border: `2px solid ${isDark ? alpha('#fff', 0.8) : '#fff'}`,
                cursor: 'pointer',
                '&:hover': { transform: 'rotate(15deg) scale(1.1)' },
                transition: 'all 0.3s ease'
              }}
            >
              <LocalHospitalIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
          </Box>

          {/* Nav Items */}
          <Box
            sx={{
              py: 2, px: 1, display: 'flex', flexDirection: 'column', gap: 1,
              maxHeight: 'calc(100vh - 280px)', overflow: 'auto',
              '&::-webkit-scrollbar': { width: 0 },
            }}
          >
            {visibleItems.map((item) => {
              const active = (location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
              const icon = navIcon(item.icon)

              return (
                <Tooltip key={item.key} title={item.label} placement="right" arrow>
                  <Box
                    component={NavLink}
                    to={item.to}
                    sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      py: 1, px: 1, borderRadius: '50%',
                      color: active ? primaryColor : 'rgba(255,255,255,0.95)',
                      background: active ? '#fff' : 'rgba(255,255,255,0.12)',
                      boxShadow: active ? `0 4px 12px ${alpha('#000', 0.2)}` : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textDecoration: 'none',
                      border: active ? `2px solid ${alpha('#fff', 0.5)}` : '2px solid transparent',
                      minHeight: 48, minWidth: 48, cursor: 'pointer',
                      '&:hover': {
                        background: active ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        color: active ? primaryColor : '#fff',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', fontSize: 24 }}>
                      {icon}
                    </Box>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>

          {/* User Cap */}
          <Box sx={{ p: 2, pt: 2, pb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: '50%',
                background: isDark ? `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.common.black} 100%)` : 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#fff', fontSize: 14, border: `2px solid ${isDark ? alpha('#fff', 0.8) : '#fff'}`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer',
                '&:hover': { transform: 'scale(1.15)', boxShadow: '0 6px 15px rgba(0,0,0,0.3)' },
                transition: 'all 0.2s ease',
              }}
            >
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  )
}
