import { Box, Card, CardContent, Typography, Avatar, LinearProgress, Chip, alpha } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { useMemo } from 'react'
import { useAppSelector } from '../../app/hooks'
import { StatCard } from '../components/StatCard'
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'
import { 
  People, 
  MedicalServices, 
  CalendarToday, 
  AttachMoney,
  TrendingUp,
  TrendingDown,
  LocalHospital,
  MoreVert,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Bed,
  Emergency,
} from '@mui/icons-material'

const COLORS = ['#0891b2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export default function DashboardPage() {
  const doctors = useAppSelector((s) => s.doctors.items)
  const patients = useAppSelector((s) => s.patients.items)
  const appointments = useAppSelector((s) => s.appointments.items)
  const invoices = useAppSelector((s) => s.billing.invoices)
  const audit = useAppSelector((s) => s.audit.events)

  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()

  // KPI Calculations
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.startAt >= startOfToday && a.startAt < endOfToday && a.status !== 'CANCELLED').length
  }, [appointments, startOfToday, endOfToday])

  const totalRevenue = useMemo(() => invoices.reduce((sum, i) => sum + i.paid, 0), [invoices])
  const pendingRevenue = useMemo(() => invoices.filter(i => i.status === 'DUE' || i.status === 'PARTIAL').reduce((sum, i) => sum + (i.total - i.paid), 0), [invoices])
  
  const activePatients = useMemo(() => patients.filter(p => p.status === 'ACTIVE' || p.status === 'IN_TREATMENT').length, [patients])
  const availableDoctors = useMemo(() => doctors.filter(d => d.status === 'ACTIVE').length, [doctors])

  // Appointment status breakdown
  const appointmentStats = useMemo(() => {
    const scheduled = appointments.filter(a => a.status === 'SCHEDULED').length
    const completed = appointments.filter(a => a.status === 'COMPLETED').length
    const cancelled = appointments.filter(a => a.status === 'CANCELLED').length
    const total = appointments.length
    return {
      scheduled: { count: scheduled, percentage: total ? Math.round((scheduled / total) * 100) : 0 },
      completed: { count: completed, percentage: total ? Math.round((completed / total) * 100) : 0 },
      cancelled: { count: cancelled, percentage: total ? Math.round((cancelled / total) * 100) : 0 },
    }
  }, [appointments])

  // Chart Data
  const apptTrend = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - idx))
      return { 
        day: d.toLocaleDateString('en', { weekday: 'short' }), 
        fullDate: d.toISOString().slice(0, 10),
        appointments: 0,
        revenue: 0
      }
    })
    const map = new Map(days.map((d) => [d.fullDate, d]))
    
    appointments.forEach((a) => {
      const dateKey = new Date(a.startAt).toISOString().slice(0, 10)
      const bucket = map.get(dateKey)
      if (bucket) bucket.appointments += 1
    })
    
    invoices.forEach((inv) => {
      const dateKey = new Date(inv.createdAt).toISOString().slice(0, 10)
      const bucket = map.get(dateKey)
      if (bucket) bucket.revenue += inv.paid
    })
    
    return days
  }, [appointments, invoices])

  const revenueTrend = useMemo(() => {
    const months = Array.from({ length: 6 }).map((_, idx) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - idx))
      return { month: d.toLocaleDateString('en', { month: 'short' }), revenue: 0, target: 500000 }
    })
    const map = new Map(months.map((m) => [m.month, m]))
    invoices.forEach((inv) => {
      const m = new Date(inv.createdAt).toLocaleDateString('en', { month: 'short' })
      const bucket = map.get(m)
      if (bucket) bucket.revenue += inv.paid
    })
    return months
  }, [invoices])

  const deptDist = useMemo(() => {
    const counts = new Map<string, number>()
    doctors.forEach((d) => counts.set(d.department, (counts.get(d.department) ?? 0) + 1))
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }))
  }, [doctors])

  // Recent activities
  const recentActivities = useMemo(() => {
    return audit.slice(0, 5).map(event => ({
      ...event,
      timeAgo: getTimeAgo(event.createdAt)
    }))
  }, [audit])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* KPI Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Patients"
              value={patients.length.toLocaleString()}
              change={{ value: 12, trend: 'up' }}
              icon={<People sx={{ fontSize: 24 }} />}
              color="primary"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Doctors"
              value={availableDoctors.toString()}
              change={{ value: 8, trend: 'up' }}
              icon={<MedicalServices sx={{ fontSize: 24 }} />}
              color="success"
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Today's Appointments"
              value={todayAppointments.toString()}
              change={{ value: 5, trend: 'down' }}
              icon={<CalendarToday sx={{ fontSize: 24 }} />}
              color="warning"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Revenue"
              value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
              change={{ value: 18, trend: 'up' }}
              icon={<AttachMoney sx={{ fontSize: 24 }} />}
              color="info"
              delay={0.3}
            />
          </Grid>
        </Grid>

        {/* Additional Stats Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2] }}>
                <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 3, 
                    backgroundColor: (t) => alpha(t.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main'
                  }}>
                    <Bed sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      185/240
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Beds Occupied
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2] }}>
                <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 3, 
                    backgroundColor: (t) => alpha(t.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'error.main'
                  }}>
                    <Emergency sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      3 Active
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Emergency Cases
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2] }}>
                <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 3, 
                    backgroundColor: (t) => alpha(t.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'info.main'
                  }}>
                    <Pending sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      ₹{(pendingRevenue / 100000).toFixed(1)}L
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Pending Revenue
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2] }}>
                <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 3, 
                    backgroundColor: (t) => alpha(t.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'warning.main'
                  }}>
                    <LocalHospital sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {activePatients}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Active Patients
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Appointments Trend */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2], height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Appointments & Revenue Trend
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Last 7 days performance
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label="Weekly" 
                        sx={{ backgroundColor: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.main' }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={apptTrend}>
                        <defs>
                          <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={(t) => alpha('#000', 0.05)} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'background.paper', 
                            border: 'none',
                            borderRadius: 12,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          }} 
                        />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="appointments" 
                          stroke="#0891b2" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorAppointments)" 
                        />
                        <Area 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Department Distribution */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2], height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                    Department Distribution
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Doctors by department
                  </Typography>
                  <Box sx={{ height: 200, mb: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={deptDist} 
                          dataKey="value" 
                          nameKey="name" 
                          innerRadius={50} 
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {deptDist.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'background.paper', 
                            border: 'none',
                            borderRadius: 12,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {deptDist.slice(0, 4).map((dept, index) => (
                      <Box key={dept.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 10, height: 10, backgroundColor: COLORS[index], borderRadius: 1.5 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {dept.name} ({dept.value})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Bottom Row */}
        <Grid container spacing={3}>
          {/* Revenue Analytics */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2], height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                    Revenue Analytics
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Monthly financial performance
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke={(t) => alpha('#000', 0.05)} vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'background.paper', 
                            border: 'none',
                            borderRadius: 12,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          }} 
                          formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Revenue']}
                        />
                        <Bar dataKey="revenue" fill="#0891b2" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Appointment Status */}
          <Grid item xs={12} md={6} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2], height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                    Appointment Status
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Breakdown by status
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Pending sx={{ color: 'warning.main', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            Scheduled
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {appointmentStats.scheduled.count}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={appointmentStats.scheduled.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: (t) => alpha(t.palette.warning.main, 0.15),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'warning.main',
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        {appointmentStats.scheduled.percentage}% of total
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            Completed
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {appointmentStats.completed.count}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={appointmentStats.completed.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: (t) => alpha(t.palette.success.main, 0.15),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'success.main',
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        {appointmentStats.completed.percentage}% of total
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Cancel sx={{ color: 'error.main', fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                            Cancelled
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {appointmentStats.cancelled.count}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={appointmentStats.cancelled.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: (t) => alpha(t.palette.error.main, 0.15),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'error.main',
                            borderRadius: 4,
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                        {appointmentStats.cancelled.percentage}% of total
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 4, boxShadow: (t) => t.shadows[2], height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Recent Activities
                    </Typography>
                    <Chip 
                      label="Live" 
                      size="small" 
                      sx={{ 
                        backgroundColor: (t) => alpha(t.palette.success.main, 0.1), 
                        color: 'success.main',
                        fontWeight: 600,
                        '& .MuiChip-label': { px: 1.5 }
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              backgroundColor: (t) => alpha(t.palette.primary.main, 0.1),
                              color: 'primary.main',
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            {activity.actorName.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.25 }}>
                              {activity.action.replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {activity.actorName} • {activity.timeAgo}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
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

