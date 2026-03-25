import {
  Box,
  Tooltip,
} from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from './nav'
import { navIcon } from './icons'
import { useAppSelector } from '../../app/hooks'
import { hasPermission } from '../../features/auth/rbac'
import { motion } from 'framer-motion'

export function Sidebar() {
  const role = useAppSelector((s) => s.auth.user?.role ?? null)
  const location = useLocation()

  const visibleItems = NAV_ITEMS.filter((i) => hasPermission(role, i.permission))

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 16,
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
        {/* Medical Capsule - Fixed Width, Icons Only */}
        <Box
          sx={{
            width: 64,
            borderRadius: 32,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(8, 145, 178, 0.35), 0 8px 24px rgba(0,0,0,0.2)',
            border: '3px solid rgba(255,255,255,0.5)',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 12%, #0891b2 12%, #0e7490 88%, #f1f5f9 88%, #ffffff 100%)',
          }}
        >
          {/* TOP WHITE CAP - Logo */}
          <Box
            sx={{
              p: 2,
              pt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.5)',
                border: '2px solid #fff',
              }}
            >
              <LocalHospitalIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
          </Box>

          {/* MIDDLE TEAL BODY - Navigation Icons */}
          <Box
            sx={{
              py: 1.5,
              px: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.6,
              maxHeight: 'calc(100vh - 240px)',
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: 0 },
            }}
          >
            {visibleItems.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
              const icon = navIcon(item.icon)

              return (
                <Tooltip
                  key={item.key}
                  title={item.label}
                  placement="right"
                  arrow
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#1e293b',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                      }
                    },
                    arrow: {
                      sx: {
                        color: '#1e293b',
                      }
                    }
                  }}
                >
                  <Box
                    component={item.disabled ? 'div' : NavLink}
                    to={item.disabled ? undefined : item.to}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 0.875,
                      px: 0.75,
                      borderRadius: 10,
                      color: active ? '#0891b2' : 'rgba(255,255,255,0.95)',
                      background: active ? '#ffffff' : 'rgba(255,255,255,0.12)',
                      boxShadow: active ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      border: active ? '2px solid #22d3ee' : '2px solid transparent',
                      minHeight: 40,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      opacity: item.disabled ? 0.4 : 1,
                      '&:hover': {
                        background: active ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        color: active ? '#0891b2' : '#fff',
                        transform: item.disabled ? 'none' : 'scale(1.1)',
                      },
                    }}
                    onClick={(e: React.MouseEvent) => {
                      if (item.disabled) {
                        e.preventDefault()
                      }
                    }}
                  >
                    <Box sx={{ color: 'inherit', display: 'flex', alignItems: 'center', fontSize: 20 }}>
                      {icon}
                    </Box>
                  </Box>
                </Tooltip>
              )
            })}
          </Box>

          {/* BOTTOM WHITE CAP - User */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 56,
            }}
          >
            <Tooltip
              title="Admin User - Super Admin"
              placement="right"
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1e293b',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                  }
                },
                arrow: {
                  sx: {
                    color: '#1e293b',
                  }
                }
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: 12,
                  flexShrink: 0,
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                AD
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>
    </Box>
  )
}
