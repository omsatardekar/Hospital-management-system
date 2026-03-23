import { Box, Card, CardContent, Typography, Avatar, Chip, alpha, Button, useTheme, Stack } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { motion } from 'framer-motion'
import { 
  People, 
  CalendarToday, 
  Schedule,
  CheckCircle,
  Emergency,
  EditNote,
  Update,
  NotificationsActive,
  BookmarkBorder
} from '@mui/icons-material'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const appointmentData = [
  { time: '09:00 AM', name: 'John Doe', status: 'Done' },
  { time: '10:30 AM', name: 'Sarah Smith', status: 'In Progress' },
  { time: '11:15 AM', name: 'Mike Johnson', status: 'Pending' },
  { time: '12:00 PM', name: 'Emma Wilson', status: 'Pending' },
]

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Medical Dashboard</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Overview of today's clinical activities.</Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Top Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Total Patients" value="1,240" icon={<People />} color={isDark ? '#0ea5e9' : '#0d9488'} data={[4, 7, 5, 9, 8, 12, 10]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Today Appointments" value="18" icon={<CalendarToday />} color={isDark ? '#38bdf8' : '#0891b2'} data={[3, 5, 4, 6, 5, 4, 4]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Upcoming Slots" value="4" icon={<Schedule />} color="#f59e0b" data={[1, 2, 1, 3, 2, 2, 2]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Completed Cases" value="12" icon={<CheckCircle />} color="#10b981" data={[2, 4, 3, 5, 4, 5, 5]} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: theme.shadows[2],
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            backdropFilter: isDark ? 'blur(10px)' : 'none',
            border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                📅 Today's Appointments
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {appointmentData.map((patient, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                        display: 'flex', alignItems: 'center', p: 2, borderRadius: 4, 
                        bgcolor: isDark ? alpha('#fff', 0.03) : '#f8fafc', 
                        border: `1px solid ${isDark ? alpha('#fff', 0.05) : '#f1f5f9'}`, 
                        transition: 'all 0.2s', 
                        '&:hover': { 
                          bgcolor: isDark ? alpha('#fff', 0.06) : '#f1f5f9', 
                          transform: 'translateX(4px)',
                        }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700, width: 80, color: isDark ? 'primary.light' : '#0d9488' }}>{patient.time}</Typography>
                    <Avatar sx={{ mx: 2, bgcolor: isDark ? alpha(theme.palette.primary.main, 0.2) : alpha('#0d9488', 0.1), color: isDark ? 'primary.light' : '#0d9488' }}>{patient.name[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>{patient.name}</Typography>
                    </Box>
                    <Chip 
                        label={patient.status} 
                        size="small" 
                        color={patient.status === 'Done' ? 'success' : (patient.status === 'In Progress' ? 'warning' : 'default')}
                        variant={isDark ? 'outlined' : 'filled'}
                        sx={{ fontWeight: 600, borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Box>
              <Button 
                fullWidth 
                sx={{ mt: 3, textTransform: 'none', fontWeight: 700 }} 
                onClick={() => navigate('/doctor/appointments')}
              >
                View Patient Details & All Appointments
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Sections */}
        <Grid item xs={12} lg={4}>
           {/* Quick Actions */}
           <Card sx={{ 
             borderRadius: 4, 
             boxShadow: theme.shadows[2], 
             mb: 3,
             background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
             backdropFilter: isDark ? 'blur(10px)' : 'none',
             border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
           }}>
              <CardContent sx={{ p: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                   ⚡ Quick Actions
                 </Typography>
                 <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <ActionButton icon={<EditNote />} label="Write Prescription" color={isDark ? '#38bdf8' : '#0369a1'} onClick={() => navigate('/doctor/appointments')} isDark={isDark} />
                    <ActionButton icon={<Update />} label="Update Slots" color={isDark ? '#10b981' : '#0d9488'} onClick={() => navigate('/doctor/schedule')} isDark={isDark} />
                 </Box>
              </CardContent>
           </Card>

           {/* Notifications */}
           <Card sx={{ 
             borderRadius: 4, 
             boxShadow: theme.shadows[2], 
             background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
             backdropFilter: isDark ? 'blur(10px)' : 'none',
             border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
           }}>
              <CardContent sx={{ p: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                   🔔 Notifications
                 </Typography>
                 <Box sx={{ display: 'grid', gap: 2 }}>
                    <NotificationItem icon={<BookmarkBorder />} text="New booking: Robert Miller" time="12 mins ago" color="#0ea5e9" />
                    <NotificationItem icon={<Emergency />} text="Urgent case: Sarah Smith" time="45 mins ago" color="#ef4444" />
                 </Box>
              </CardContent>
           </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

function StatWidget({ title, value, icon, color, data }: any) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  return (
    <Card sx={{ 
      borderRadius: 4, 
      boxShadow: theme.shadows[2],
      background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
      backdropFilter: isDark ? 'blur(10px)' : 'none',
      border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1.2, borderRadius: 3, bgcolor: alpha(color, 0.1), color: color }}>{icon}</Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block' }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{value}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ height: 40, mb: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((v: number, i: number) => ({ v, i }))}>
              <Area type="monotone" dataKey="v" stroke={color} fill={alpha(color, 0.1)} strokeWidth={2} dot={false} isAnimationActive={true} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

function ActionButton({ icon, label, color, onClick, isDark }: any) {
    return (
        <Button 
            fullWidth 
            variant="outlined" 
            startIcon={icon}
            onClick={onClick}
            sx={{ 
                justifyContent: 'flex-start', p: 1.5, borderRadius: 4, 
                borderColor: alpha(color, 0.3), color: color,
                bgcolor: isDark ? alpha(color, 0.02) : 'transparent',
                '&:hover': { 
                  bgcolor: alpha(color, 0.1), 
                  borderColor: color,
                  transform: 'translateX(4px)'
                },
                transition: 'all 0.2s ease'
            }}
        >
            {label}
        </Button>
    )
}

function NotificationItem({ icon, text, time, color }: any) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color, display: 'flex' }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{text}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>{time}</Typography>
            </Box>
        </Box>
    )
}



