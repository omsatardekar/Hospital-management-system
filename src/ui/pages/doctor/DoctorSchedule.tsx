import { useState } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, 
  Stack, Paper, useTheme, alpha,
  FormControl, InputLabel, Select, MenuItem, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material'
import { Add, Block, Save, MedicalServices, LocalHospital, Close, Settings } from '@mui/icons-material'
import toast from 'react-hot-toast'

const departmentsData: Record<string, { specializations: string[], types: string[] }> = {
  'Cardiology': {
    specializations: ['Heart Surgery', 'Clinical Cardiology', 'Interventional Cardiology', 'Electrophysiology'],
    types: ['Surgeon', 'Specialist', 'Consultant']
  },
  'Neurology': {
    specializations: ['Neurosurgery', 'Stroke Specialist', 'Epilepsy Specialist', 'Neuromuscular'],
    types: ['Surgeon', 'Specialist', 'Consultant']
  },
  'Pediatrics': {
    specializations: ['Neonatology', 'Pediatric Surgery', 'General Pediatrics', 'Pediatric Cardiology'],
    types: ['Specialist', 'Surgeon', 'General Physician']
  },
  'Orthopedics': {
    specializations: ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Trauma Surgery'],
    types: ['Surgeon', 'Specialist']
  },
  'Dermatology': {
    specializations: ['Cosmetic Dermatology', 'Dermatosurgery', 'Pediatric Dermatology'],
    types: ['Specialist', 'Consultant']
  },
  'Oncology': {
    specializations: ['Surgical Oncology', 'Medical Oncology', 'Radiation Oncology'],
    types: ['Surgeon', 'Specialist', 'Consultant']
  },
  'Radiology': {
    specializations: ['Diagnostic Radiology', 'Interventional Radiology', 'Neuroradiology'],
    types: ['Specialist', 'Consultant']
  },
  'Gastroenterology': {
    specializations: ['Hepatology', 'Endoscopy', 'Pediatric Gastroenterology'],
    types: ['Specialist', 'Surgeon', 'Consultant']
  }
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']

export default function DoctorSchedule() {
  const theme = useTheme()
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

  const [openRuleDialog, setOpenRuleDialog] = useState(false)
  const [availabilityRule, setAvailabilityRule] = useState(() => {
    const saved = localStorage.getItem('doctor_schedule_rule')
    return saved ? JSON.parse(saved) : { advanceDays: 7, bufferHours: 2, instructions: 'Ensure your slots are updated weekly.' }
  })

  // Handle Department Change
  const handleDepartmentChange = (dept: string) => {
    const data = departmentsData[dept]
    setDoctorInfo({
      department: dept,
      specialization: data.specializations[0],
      type: data.types[0]
    })
  }

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
    localStorage.setItem('doctor_schedule_rule', JSON.stringify(availabilityRule))
    toast.success('Clinical Schedule Saved Successfully!')
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>Schedule Management</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Define your department and clinical availability.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Save />} 
          onClick={handleSaveSchedule} 
          sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', px: 3 }}
        >
          Save All Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Doctor Info Card */}
        <Grid size={{ xs: 12 }}>
           <Card sx={{ 
             borderRadius: 3, p: 3,
             boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
             background: theme.palette.background.paper,
             border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
           }}>
             <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <MedicalServices sx={{ color: 'primary.main', fontSize: 24 }} /> Clinical Identification
             </Typography>
             <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Department</InputLabel>
                      <Select 
                        value={doctorInfo.department} 
                        label="Department"
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                         {Object.keys(departmentsData).map(dept => (
                           <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                         ))}
                      </Select>
                   </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Specialization</InputLabel>
                      <Select 
                        value={doctorInfo.specialization} 
                        label="Specialization"
                        onChange={(e) => setDoctorInfo({...doctorInfo, specialization: e.target.value})}
                        sx={{ borderRadius: 2 }}
                      >
                         {departmentsData[doctorInfo.department].specializations.map(spec => (
                           <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                         ))}
                      </Select>
                   </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                   <FormControl fullWidth size="small">
                      <InputLabel>Doctor Type</InputLabel>
                      <Select 
                        value={doctorInfo.type} 
                        label="Doctor Type"
                        onChange={(e) => setDoctorInfo({...doctorInfo, type: e.target.value})}
                        sx={{ borderRadius: 2 }}
                      >
                         {departmentsData[doctorInfo.department].types.map(t => (
                           <MenuItem key={t} value={t}>{t}</MenuItem>
                         ))}
                      </Select>
                   </FormControl>
                </Grid>
             </Grid>
           </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ 
            display: 'flex', gap: 2, overflowX: 'auto', py: 1, px: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.divider, 0.2), borderRadius: 2 }
          }}>
            {daysOfWeek.map((day) => (
              <DayCard key={day} day={day} active={selectedDay === day} slots={availability[day]?.length || 0} onClick={() => setSelectedDay(day)} />
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ 
            borderRadius: 3, minHeight: 250,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.04)',
            background: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
             <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedDay} Slots</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button 
                          size="small" 
                          variant="text" 
                          startIcon={<Add />} 
                          onClick={() => toast.success('Batch slots created')}
                          sx={{ fontWeight: 700 }}
                        >
                          Quick Add
                        </Button>
                        <Button 
                          size="small" 
                          variant="text" 
                          color="error" 
                          startIcon={<Block />} 
                          onClick={() => setAvailability({...availability, [selectedDay]: []})}
                          sx={{ fontWeight: 700 }}
                        >
                          Clear All
                        </Button>
                    </Stack>
                </Box>
                <Grid container spacing={2}>
                  {timeSlots.map((slot) => {
                    const active = availability[selectedDay]?.includes(slot)
                    return (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={slot}>
                        <SlotButton time={slot} active={active} onClick={() => toggleSlot(slot)} />
                      </Grid>
                    )
                  })}
                </Grid>
             </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
           <Card 
             onClick={() => setOpenRuleDialog(true)}
             sx={{ 
                 borderRadius: 3, 
                 background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)', 
                 color: 'white', p: { xs: 3, sm: 4 }, textAlign: 'center',
                 boxShadow: '0 10px 30px rgba(8, 145, 178, 0.2)',
                 cursor: 'pointer', transition: 'all 0.2s',
                 position: 'relative', overflow: 'hidden',
                 '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 14px 40px rgba(8, 145, 178, 0.3)' }
           }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, opacity: 0.5 }}><Settings /></Box>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha('#fff', 0.2), border: '2px solid #fff' }}><LocalHospital /></Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Availability Rule</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1, lineHeight: 1.6 }}>
                  Patients can book slots up to <b style={{ fontWeight: 900, color: '#fef08a' }}>{availabilityRule.advanceDays} days</b> in advance. 
                  (Buffer: {availabilityRule.bufferHours}hrs)
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7, fontStyle: 'italic' }}>"{availabilityRule.instructions}"</Typography>
           </Card>
        </Grid>
      </Grid>

      {/* Configuration Dialog for Availability Rule */}
      <Dialog open={openRuleDialog} onClose={() => setOpenRuleDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}><Settings /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Configure Booking Rule</Typography>
            </Box>
            <IconButton onClick={() => setOpenRuleDialog(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 0 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Advance Booking (Days)</Typography>
                    <TextField 
                      fullWidth size="small" type="number"
                      value={availabilityRule.advanceDays}
                      onChange={(e) => setAvailabilityRule({ ...availabilityRule, advanceDays: parseInt(e.target.value) || 0 })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Notice Buffer (Hours)</Typography>
                    <TextField 
                      fullWidth size="small" type="number"
                      value={availabilityRule.bufferHours}
                      onChange={(e) => setAvailabilityRule({ ...availabilityRule, bufferHours: parseInt(e.target.value) || 0 })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Booking Instructions for Patient</Typography>
                    <TextField 
                      fullWidth multiline rows={2}
                      value={availabilityRule.instructions}
                      onChange={(e) => setAvailabilityRule({ ...availabilityRule, instructions: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenRuleDialog(false)} sx={{ fontWeight: 700, px: 3 }}>Cancel</Button>
            <Button 
                variant="contained" 
                onClick={() => { setOpenRuleDialog(false); handleSaveSchedule(); }} 
                sx={{ borderRadius: 2, px: 3, fontWeight: 700, boxShadow: 'none' }}
            >
                Apply Rule
            </Button>
        </DialogActions>
      </Dialog>
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
                minWidth: 100, p: 2, textAlign: 'center', borderRadius: 2, cursor: 'pointer', border: '1px solid',
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
                p: 2, borderRadius: 2, textAlign: 'center', border: '1px solid',
                borderColor: active ? theme.palette.primary.main : 'divider',
                bgcolor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{time}</Typography>
            <Typography variant="caption" sx={{ color: active ? 'primary.main' : 'text.disabled' }}>{active ? 'Available' : 'Unavailable'}</Typography>
        </Paper>
    )
}

