import { useState } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, 
  Stack, Paper, useTheme, alpha,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { Add, Block, Save, MedicalServices, LocalHospital } from '@mui/icons-material'
import toast from 'react-hot-toast'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

export default function DoctorSchedule() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [selectedDay, setSelectedDay] = useState('Monday')
  
  // Doctor Info State
  const [doctorInfo, setDoctorInfo] = useState({
    department: 'Cardiology',
    specialization: 'Heart Surgery',
    type: 'Surgeon'
  })

  const [availability, setAvailability] = useState<any>(() => {
    const saved = localStorage.getItem('doctor_schedule')
    return saved ? JSON.parse(saved) : {
        'Monday': ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
    }
  })

  const toggleSlot = (slot: string) => {
    const current = availability[selectedDay] || []
    if (current.includes(slot)) {
      setAvailability({ ...availability, [selectedDay]: current.filter((s: string) => s !== slot) })
    } else {
      setAvailability({ ...availability, [selectedDay]: [...current, slot] })
    }
  }

  const handleSaveSchedule = () => {
    localStorage.setItem('doctor_schedule', JSON.stringify(availability))
    toast.success('Clinical Schedule Saved Successfully!')
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Schedule Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Define your department and clinical availability.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Save />} onClick={handleSaveSchedule} sx={{ borderRadius: 3 }}>Save All Changes</Button>
      </Box>

      <Grid container spacing={3}>
        {/* Doctor Info Card - REQUIREMENT */}
        <Grid item xs={12}>
           <Card sx={{ 
             borderRadius: 4, p: 3, mb: 1,
             background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
             border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
             boxShadow: theme.shadows[2]
           }}>
             <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
               <MedicalServices color="primary" /> Clinical Identification
             </Typography>
             <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Department</InputLabel>
                      <Select 
                        value={doctorInfo.department} 
                        label="Department"
                        onChange={(e) => setDoctorInfo({...doctorInfo, department: e.target.value})}
                        sx={{ borderRadius: 2 }}
                      >
                         <MenuItem value="Cardiology">Cardiology</MenuItem>
                         <MenuItem value="Dentist">Dentist</MenuItem>
                         <MenuItem value="Neurology">Neurology</MenuItem>
                         <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                      </Select>
                   </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Specialization</InputLabel>
                      <Select 
                        value={doctorInfo.specialization} 
                        label="Specialization"
                        onChange={(e) => setDoctorInfo({...doctorInfo, specialization: e.target.value})}
                        sx={{ borderRadius: 2 }}
                      >
                         <MenuItem value="Heart Surgery">Heart Surgery</MenuItem>
                         <MenuItem value="General Checkup">General Checkup</MenuItem>
                         <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                      </Select>
                   </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Doctor Type</InputLabel>
                      <Select 
                        value={doctorInfo.type} 
                        label="Doctor Type"
                        onChange={(e) => setDoctorInfo({...doctorInfo, type: e.target.value})}
                        sx={{ borderRadius: 2 }}
                      >
                         <MenuItem value="General">General</MenuItem>
                         <MenuItem value="Specialist">Specialist</MenuItem>
                         <MenuItem value="Surgeon">Surgeon</MenuItem>
                      </Select>
                   </FormControl>
                </Grid>
             </Grid>
           </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 2 }}>
            {daysOfWeek.map((day) => (
              <DayCard key={day} day={day} active={selectedDay === day} slots={availability[day]?.length || 0} onClick={() => setSelectedDay(day)} />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 4, minHeight: 400,
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
            boxShadow: theme.shadows[2]
          }}>
             <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedDay} Slots</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button size="small" startIcon={<Add />} onClick={() => toast.success('Batch slots created')}>Quick Add</Button>
                        <Button size="small" color="error" startIcon={<Block />} onClick={() => setAvailability({...availability, [selectedDay]: []})}>Clear All</Button>
                    </Stack>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2 }}>
                  {timeSlots.map((slot) => {
                    const active = availability[selectedDay]?.includes(slot)
                    return (
                      <SlotButton key={slot} time={slot} active={active} onClick={() => toggleSlot(slot)} />
                    )
                  })}
                </Box>
             </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
           <Card sx={{ 
             borderRadius: 4, 
             background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
             color: 'white', p: 4, textAlign: 'center'
           }}>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha('#fff', 0.1) }}><LocalHospital /></Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Availability Rule</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>Patients can book slots up to 7 days in advance for {doctorInfo.department}.</Typography>
           </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

function DayCard({ day, active, slots, onClick }: any) {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    return (
        <Paper 
            elevation={active ? 4 : 0}
            onClick={onClick}
            sx={{ 
                minWidth: 100, p: 2, textAlign: 'center', borderRadius: 4, cursor: 'pointer', border: '1px solid',
                borderColor: active ? theme.palette.primary.main : 'divider', 
                bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : (isDark ? alpha('#fff', 0.02) : '#fff'),
                transition: 'all 0.2s'
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: active ? 800 : 500 }}>{day.slice(0, 3)}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{slots} Slots</Typography>
        </Paper>
    )
}

function SlotButton({ time, active, onClick }: any) {
    const theme = useTheme()
    return (
        <Paper 
            elevation={0} onClick={onClick}
            sx={{ 
                p: 2, borderRadius: 4, textAlign: 'center', border: '1px solid',
                borderColor: active ? theme.palette.primary.main : 'divider',
                bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[1] }
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{time}</Typography>
            <Typography variant="caption" sx={{ color: active ? 'primary.main' : 'text.disabled' }}>{active ? 'Available' : 'Unavailable'}</Typography>
        </Paper>
    )
}

