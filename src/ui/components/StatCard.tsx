import { Card, CardContent, Box, Typography, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  icon: ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  delay?: number
}

const colorMap = {
  primary: { main: '#0891b2', light: '#22d3ee', bg: 'rgba(8, 145, 178, 0.08)' },
  secondary: { main: '#059669', light: '#34d399', bg: 'rgba(5, 150, 105, 0.08)' },
  success: { main: '#10b981', light: '#34d399', bg: 'rgba(16, 185, 129, 0.08)' },
  warning: { main: '#f59e0b', light: '#fbbf24', bg: 'rgba(245, 158, 11, 0.08)' },
  error: { main: '#ef4444', light: '#f87171', bg: 'rgba(239, 68, 68, 0.08)' },
  info: { main: '#3b82f6', light: '#60a5fa', bg: 'rgba(59, 130, 246, 0.08)' },
}

export function StatCard({ title, value, change, icon, color, delay = 0 }: StatCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: (t) => t.shadows[2],
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: (t) => t.shadows[4],
          },
        }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 1,
                  fontSize: 13,
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: change ? 0.5 : 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </Typography>
              {change && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: change.trend === 'up' ? 'success.main' : 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                    }}
                  >
                    {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    vs last month
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                backgroundColor: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.main,
                flexShrink: 0,
                ml: 2,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
