import { useState, useMemo } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Chip, Stack, alpha, useTheme,
  Grid, Divider, IconButton, Paper, Button, List, ListItem, ListItemAvatar,
  ListItemText, Menu, MenuItem, LinearProgress, Tooltip,
  AvatarGroup,
  CircularProgress
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, PendingActions, CheckCircle, Warning,
  LocalPharmacy, ArrowForward, MoreVert, Science,
  NotificationsActive, Inventory, ReceiptLong, AddShoppingCart,
  TrendingUp, TrendingDown, AccessTime, Autorenew, 
  Group, CalendarToday, Search,
  History,
  InfoOutlined,
  PriorityHigh,
  NavigateNext
} from '@mui/icons-material'
import { 
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, 
  Bar, BarChart, Cell, Pie, PieChart 
} from 'recharts'
import { useNavigate } from 'react-router-dom'

// ----------------------------------------------------------------------
// Mock Data
// ----------------------------------------------------------------------

const orderTrends = [
  { name: 'Mon', orders: 45, value: 12000 },
  { name: 'Tue', orders: 52, value: 15600 },
  { name: 'Wed', orders: 38, value: 11200 },
  { name: 'Thu', orders: 65, value: 19800 },
  { name: 'Fri', orders: 48, value: 14400 },
  { name: 'Sat', orders: 70, value: 21000 },
  { name: 'Sun', orders: 35, value: 9800 },
]

const stockSpread = [
  { name: 'Antibiotics', value: 450, color: '#0ea5e9' },
  { name: 'Analgesics', value: 300, color: '#f59e0b' },
  { name: 'Cardiology', value: 150, color: '#10b981' },
  { name: 'Other', value: 200, color: '#6366f1' },
]

const criticalStock = [
  { name: 'Amoxicillin 500mg', stock: 12, min: 50, trend: 'Down' },
  { name: 'Cetirizine 10mg', stock: 3, min: 25, trend: 'Stable' },
  { name: 'Pantoprazole 40mg', stock: 8, min: 40, trend: 'Down' },
]

const recentOrders = [
  { id: 'ORD-8821', patient: 'Sarah Jennings', meds: 4, status: 'Pending', time: '10:42 AM', amount: 1240 },
  { id: 'ORD-8822', patient: 'Marcus Chen', meds: 2, status: 'Preparing', time: '11:15 AM', amount: 450 },
  { id: 'ORD-8823', patient: 'Emma Watson', meds: 5, status: 'Completed', time: '09:30 AM', amount: 3100 },
]

const activityLog = [
  { id: 1, text: 'Inventory restocked: Metformin (200 units)', time: '40m ago', type: 'success' },
  { id: 2, text: 'New prescription from Dr. Emily Carter', time: '1h ago', type: 'info' },
  { id: 3, text: 'System backup completed successfully', time: '2h ago', type: 'system' },
]

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

export default function PharmacistDashboard() {
  const theme = useTheme()
  const navigate = useNavigate()
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const stats = [
    { label: 'Total Orders', value: '142', sub: '+12% from yesterday', icon: <ShoppingBag />, color: '#0ea5e9', chartData: [4, 6, 5, 8, 7, 9, 11] },
    { label: 'Revenue', value: '₹14,250', sub: 'Projected ₹18k', icon: <TrendingUp />, color: '#10b981', chartData: [3, 4, 3, 5, 4, 6, 5] },
    { label: 'Active Queue', value: '24', sub: 'Avg wait 12 mins', icon: <AccessTime />, color: '#f59e0b', chartData: [8, 7, 9, 6, 8, 7, 9] },
    { label: 'Critical Stock', value: '08', sub: 'Needs attention', icon: <PriorityHigh />, color: '#ef4444', chartData: [2, 3, 2, 4, 3, 5, 4] },
  ]

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. WELCOME HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
           <Box>
             <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', mb: 0.5 }}>Command Dashboard</Typography>
             <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>Welcome back, Chief Pharmacist.</Typography>
                <Chip label="ONLINE" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900, bgcolor: alpha('#10b981', 0.1), color: '#10b981', borderRadius: 1 }} />
             </Stack>
           </Box>
           <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Button 
                variant="outlined" 
                startIcon={<Inventory />} 
                onClick={() => navigate('/pharmacist/inventory')}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1, textTransform: 'none', color: '#64748b', border: '2px solid #e2e8f0' }}
              >
                Manage Stock
              </Button>
              <Button 
                variant="contained" 
                startIcon={<LocalPharmacy />} 
                onClick={() => navigate('/pharmacist/orders')}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1, bgcolor: '#0ea5e9', textTransform: 'none', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.25)' }}
              >
                New Dispensation
              </Button>
           </Stack>
        </Box>
      </motion.div>

      {/* 2. STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
              <StatWidget stat={stat} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 3. MAIN CONTENT GRID */}
      <Grid container spacing={3}>
        
        {/* LEFT COLUMN: TRENDS & QUEUE */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            
            {/* TRENDS CHART */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" fontWeight={800} color="#1e293b">Weekly Operational Insights</Typography>
                    <Typography variant="body2" color="#64748b">Dispensation volume matched against estimated revenue</Typography>
                  </Box>
                  <Tooltip title="View Detailed Report">
                    <IconButton size="small" sx={{ bgcolor: '#f1f5f9' }}><History /></IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ px: 4, pb: 4, height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={orderTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600, fontSize: 12 }} dy={10} />
                      <ChartTooltip 
                         contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '12px' }}
                         itemStyle={{ fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </motion.div>

            {/* LIVE QUEUE FEED */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                  <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LocalPharmacy color="primary" /> Disruptive Queue Feed
                  </Typography>
                  <Button endIcon={<NavigateNext />} size="small" sx={{ fontWeight: 700, textTransform: 'none' }} onClick={() => navigate('/pharmacist/orders')}>Manage All</Button>
                </Box>
                <Box sx={{ p: 1 }}>
                  {recentOrders.map((order, idx) => (
                    <OrderRow key={idx} order={order} />
                  ))}
                </Box>
              </Card>
            </motion.div>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: INVENTORY & LOGS */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            
            {/* INVENTORY INSIGHT CARD */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                   <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Inventory sx={{ fontSize: 20, color: '#f59e0b' }} /> Inventory Health
                   </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                   <Typography variant="body2" color="#64748b" sx={{ mb: 2, fontWeight: 600 }}>Critical Stock Needs Refill</Typography>
                   <Stack spacing={2}>
                      {criticalStock.map((item, i) => (
                        <Box key={i} sx={{ p: 2, bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 2 }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" fontWeight={800} color="#991b1b">{item.name}</Typography>
                              <Chip label={`${item.stock} left`} size="small" sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 900, height: 20, fontSize: '0.6rem' }} />
                           </Box>
                           <LinearProgress 
                            variant="determinate" 
                            value={(item.stock / item.min) * 100} 
                            sx={{ height: 4, borderRadius: 2, bgcolor: alpha('#ef4444', 0.1), '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} 
                           />
                        </Box>
                      ))}
                   </Stack>
                   <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Autorenew />}
                    onClick={() => navigate('/pharmacist/inventory')}
                    sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: 800, textTransform: 'none', bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                   >
                     Initiate Restock Protocol
                   </Button>
                </Box>
              </Card>
            </motion.div>

            {/* RECENT ACTIVITY LOG */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
              <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                   <Typography variant="subtitle1" fontWeight={800} color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <History sx={{ fontSize: 20, color: '#6366f1' }} /> Activity Stream
                   </Typography>
                </Box>
                <List disablePadding>
                   {activityLog.map((log, i) => (
                     <ListItem key={log.id} sx={{ py: 2, px: 3, borderBottom: i < activityLog.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                        <ListItemAvatar>
                           <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', fontSize: 14 }}>
                              <NotificationsActive sx={{ fontSize: 16 }} />
                           </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={log.text} 
                          secondary={log.time} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 700, color: '#475569' }}
                          secondaryTypographyProps={{ variant: 'caption', fontWeight: 600, color: '#94a3b8' }}
                        />
                     </ListItem>
                   ))}
                </List>
              </Card>
            </motion.div>

          </Stack>
        </Grid>

      </Grid>
    </Box>
  )
}

// ----------------------------------------------------------------------
// Subcomponents
// ----------------------------------------------------------------------

function StatWidget({ stat }: { stat: any }) {
  const theme = useTheme()
  return (
    <Card sx={{ 
      p: 2.5, 
      borderRadius: 4, 
      border: '1px solid #e2e8f0', 
      boxShadow: 'none', 
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Avatar sx={{ bgcolor: alpha(stat.color, 0.1), color: stat.color, borderRadius: 2, width: 44, height: 44 }}>
          {stat.icon}
        </Avatar>
        <Box sx={{ textAlign: 'right' }}>
           <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>{stat.value}</Typography>
           <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 0.5 }}>{stat.label.toUpperCase()}</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 'auto', pt: 1 }}>
         <Typography variant="caption" sx={{ color: stat.color === '#ef4444' ? stat.color : '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
           {stat.color === '#ef4444' ? <PriorityHigh sx={{ fontSize: 14 }} /> : <Autorenew sx={{ fontSize: 14 }} />}
           {stat.sub}
         </Typography>
         <Box sx={{ height: 40, mt: 1, overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stat.chartData.map((d: number) => ({ val: d }))}>
                  <Area type="monotone" dataKey="val" stroke={stat.color} strokeWidth={2} fill={alpha(stat.color, 0.1)} />
               </AreaChart>
            </ResponsiveContainer>
         </Box>
      </Box>
    </Card>
  )
}

function OrderRow({ order }: { order: any }) {
  const navigate = useNavigate()
  const statusColors: any = {
    'Completed': { bg: '#dcfce7', text: '#16a34a' },
    'Preparing': { bg: '#e0f2fe', text: '#0284c7' },
    'Pending': { bg: '#fef3c7', text: '#d97706' },
  }
  const color = statusColors[order.status] || { bg: '#f1f5f9', text: '#64748b' }

  return (
    <Box 
      onClick={() => navigate('/pharmacist/orders')}
      sx={{ 
        p: 2, 
        mb: 1, 
        borderRadius: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(4px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ bgcolor: alpha('#0ea5e9', 0.1), color: '#0ea5e9', fontWeight: 800, fontSize: 14 }}>{order.patient.charAt(0)}</Avatar>
        <Box>
           <Typography variant="body2" fontWeight={800}>{order.patient}</Typography>
           <Typography variant="caption" color="#94a3b8" fontWeight={600}>{order.id} • {order.time}</Typography>
        </Box>
      </Stack>
      
      <Stack direction="row" spacing={3} alignItems="center">
         <Box sx={{ display: 'none', md: 'block' }}>
            <Typography variant="caption" color="#94a3b8" fontWeight={700} display="block">TOTAL BILL</Typography>
            <Typography variant="body2" fontWeight={800} color="#1e293b">₹{order.amount}</Typography>
         </Box>
         <Chip 
          label={order.status} 
          size="small" 
          sx={{ 
            bgcolor: color.bg, 
            color: color.text, 
            fontWeight: 800, 
            fontSize: '0.65rem', 
            height: 20, 
            minWidth: 80,
            borderRadius: 1 
          }} 
        />
         <IconButton size="small"><NavigateNext sx={{ fontSize: 18 }} /></IconButton>
      </Stack>
    </Box>
  )
}
