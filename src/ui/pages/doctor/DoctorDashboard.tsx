import { Box, Card, CardContent, Typography, Avatar, Chip, alpha, Button, useTheme, Stack, Grid, Divider } from '@mui/material'
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

const appointmentData = [
  { time: '09:00 AM', name: 'John Doe', status: 'Done' },
  { time: '10:30 AM', name: 'Sarah Smith', status: 'In Progress' },
  { time: '11:15 AM', name: 'Mike Johnson', status: 'Pending' },
  { time: '12:00 PM', name: 'Emma Wilson', status: 'Pending' },
]

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const theme = useTheme()

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
           <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>Medical Dashboard</Typography>
           <Typography variant="body1" sx={{ color: 'text.secondary' }}>Here's what's happening with your practice today.</Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Top Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatWidget title="Total Patients" value="1,240" icon={<People />} color="#0891b2" data={[4, 7, 5, 9, 8, 12, 10]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatWidget title="Today Appointments" value="18" icon={<CalendarToday />} color="#0ea5e9" data={[3, 5, 4, 6, 5, 4, 4]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatWidget title="Upcoming Slots" value="4" icon={<Schedule />} color="#f59e0b" data={[1, 2, 1, 3, 2, 2, 2]} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatWidget title="Completed Cases" value="12" icon={<CheckCircle />} color="#10b981" data={[2, 4, 3, 5, 4, 5, 5]} />
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)',
              overflow: 'hidden',
              background: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarToday sx={{ color: 'primary.main', fontSize: 24 }} /> Today's Appointment Queue
                  </Typography>
                  <Button size="small" variant="text" sx={{ fontWeight: 700 }} onClick={() => navigate('/doctor/appointments')}>View Full List</Button>
                </Box>

                <Stack spacing={2}>
                  {appointmentData.map((patient, idx) => (
                    <Box 
                      key={idx} 
                      sx={{ 
                          display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, 
                          bgcolor: alpha(theme.palette.action.hover, 0.04),
                          border: `1px solid ${alpha(theme.palette.divider, 0.05)}`, 
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            transform: 'translateX(4px)',
                            borderColor: alpha(theme.palette.primary.main, 0.1)
                          }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 800, width: { xs: 60, sm: 80 }, color: 'primary.main' }}>{patient.time}</Typography>
                      <Avatar sx={{ mr: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 40, height: 40, fontSize: 16, fontWeight: 700 }}>{patient.name[0]}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Next: Clinical Review</Typography>
                      </Box>
                      <Chip 
                          label={patient.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 800, 
                            fontSize: 10,
                            borderRadius: 1,
                            bgcolor: patient.status === 'Done' ? alpha('#10b981', 0.1) : (patient.status === 'In Progress' ? alpha('#f59e0b', 0.1) : alpha(theme.palette.text.secondary, 0.1)),
                            color: patient.status === 'Done' ? '#10b981' : (patient.status === 'In Progress' ? '#f59e0b' : 'text.secondary'),
                          }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3, height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Emergency sx={{ color: 'error.main', fontSize: 20 }} /> Core Operations
                            </Typography>
                            <Stack spacing={1.5}>
                                <ActionButton icon={<EditNote />} label="Clinical Orders" onClick={() => navigate('/doctor/appointments')} color="primary" />
                                <ActionButton icon={<Update />} label="Time Availability" onClick={() => navigate('/doctor/schedule')} color="secondary" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 3, height: '100%', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <NotificationsActive sx={{ color: 'warning.main', fontSize: 20 }} /> Clinical Alerts
                            </Typography>
                            <Stack spacing={2}>
                                <NotificationItem icon={<BookmarkBorder />} text="3 Critical patients today" time="Urgent" color="#ef4444" />
                                <NotificationItem icon={<People />} text="Patient records updated" time="2h ago" color="#10b981" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
          </Stack>
        </Grid>

        {/* Sidebar Sections */}
        <Grid size={{ xs: 12, lg: 4 }}>
           <Stack spacing={3}>
              {/* Future Scheduler Calendar */}
              <Card sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 3 }}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CalendarToday sx={{ color: 'secondary.main', fontSize: 24 }} /> Future Schedule
                        </Typography>
                        <Chip label="MAR 2026" size="small" variant="filled" color="secondary" sx={{ fontWeight: 900, fontSize: 10, height: 20 }} />
                   </Box>
                   
                   {/* Custom Mini Calendar View */}
                   <Box 
                    sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(7, 1fr)', 
                        gap: 1.5, 
                        mb: 3,
                        textAlign: 'center'
                    }}
                   >
                       {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                           <Typography key={`${d}-${i}`} variant="caption" sx={{ fontWeight: 900, color: 'text.disabled' }}>{d}</Typography>
                       ))}
                       {Array.from({ length: 31 }).map((_, i) => {
                           const day = i + 1;
                           const hasAppt = [24, 25, 28, 30].includes(day);
                           const isToday = day === 24;
                           return (
                               <Box 
                                key={i} 
                                sx={{ 
                                    p: 0.5, 
                                    borderRadius: 1.5, 
                                    bgcolor: isToday ? 'primary.main' : (hasAppt ? alpha(theme.palette.secondary.main, 0.1) : 'transparent'),
                                    color: isToday ? '#fff' : (hasAppt ? 'secondary.main' : 'text.primary'),
                                    fontWeight: (hasAppt || isToday) ? 800 : 500,
                                    fontSize: 12,
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: isToday ? 'primary.dark' : alpha(theme.palette.divider, 0.1) }
                                }}
                               >
                                   {day}
                               </Box>
                           )
                       })}
                   </Box>

                   <Divider sx={{ mb: 2.5, borderStyle: 'dotted' }} />
                   
                   <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontSize: 13, color: 'text.secondary' }}>UPCOMING HIGHLIGHTS</Typography>
                   <Stack spacing={2}>
                        {[
                            { date: 'Mar 25', task: 'Review Patient Records', type: 'Clinical' },
                            { date: 'Mar 28', task: 'Follow-up (Michael)', type: 'Consult' }
                        ].map((s, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{ width: 45, p: 0.8, borderRadius: 1.5, bgcolor: alpha(theme.palette.divider, 0.1), textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', lineHeight: 1 }}>{s.date.split(' ')[0]}</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{s.date.split(' ')[1]}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{s.task}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{s.type}</Typography>
                                </Box>
                            </Box>
                        ))}
                   </Stack>
                   
                   <Button fullWidth variant="outlined" color="secondary" sx={{ mt: 3, borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none' }}>View Future Planner</Button>
                </CardContent>
              </Card>
           </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

function StatWidget({ title, value, icon, color, data }: any) {
  const theme = useTheme()
  
  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
      background: theme.palette.background.paper,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      overflow: 'hidden',
      height: '100%'
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>{title.toUpperCase()}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, my: 0.5 }}>{value}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
        <Box sx={{ height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((v: number) => {
              const val = typeof v === 'number' ? v : 0;
              return { value: val };
            })}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill={`url(#gradient-${title.replace(/\s+/g, '-')})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

function ActionButton({ icon, label, onClick, color }: any) {
    const theme = useTheme()
    return (
        <Button
            fullWidth
            onClick={onClick}
            sx={{
                justifyContent: 'flex-start',
                p: 1.8,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette[color as 'primary' | 'secondary'].main, 0.05),
                color: theme.palette[color as 'primary' | 'secondary'].main,
                textTransform: 'none',
                gap: 2,
                '&:hover': {
                    bgcolor: alpha(theme.palette[color as 'primary' | 'secondary'].main, 0.1),
                    transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
            }}
        >
            <Avatar sx={{ bgcolor: '#fff', color: theme.palette[color as 'primary' | 'secondary'].main, width: 32, height: 32 }}>
                {icon}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{label}</Typography>
        </Button>
    )
}

function NotificationItem({ icon, text, time, color }: any) {
    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 36, height: 36 }}>
                {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{text}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{time}</Typography>
            </Box>
        </Box>
    )
}
