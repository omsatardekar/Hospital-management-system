import { useState, useMemo } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, TextField, 
  IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, InputAdornment, Dialog, DialogTitle, DialogContent, 
  DialogActions, Stack, useTheme, alpha, Tooltip,
  Divider, Tabs, Tab, Drawer, Grid
} from '@mui/material'
import { 
  Search, FilterList, Visibility, Block,
  Close, EditNote,
  MedicalServices,
  ReceiptLong,
  History,
  PlayArrow,
  CheckCircleOutline,
  Check,
  Clear,
  ArrowForward,
  Description,
  Payments,
  CalendarMonth,
  Add
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const initialAppointments = [
  { 
    id: '1', name: 'John Doe', age: 45, gender: 'Male', reason: 'Routine Checkup', 
    status: 'Completed', time: '09:00 AM', date: '2026-03-24', 
    symptoms: 'Mild headache, fatigue', isFirstVisit: false, fees: 1200,
    medicalHistory: 'Hypertension, Sleep Apnea',
    reports: ['blood_report_jan.pdf']
  },
  { 
    id: '2', name: 'Sarah Smith', age: 32, gender: 'Female', reason: 'Chest Pain', 
    status: 'Ongoing', time: '10:30 AM', date: '2026-03-24', 
    symptoms: 'Sharp pain in upper chest, shortness of breath', isFirstVisit: true, fees: 1500,
    medicalHistory: 'No prior heart conditions',
    reports: ['ecg_report.jpg']
  },
  { 
    id: '3', name: 'Michael Brown', age: 58, gender: 'Male', reason: 'Diabetes Follow-up', 
    status: 'Incoming', time: '11:15 AM', date: '2026-03-24', 
    symptoms: 'Blurred vision, frequent urination', isFirstVisit: false, fees: 1200,
    medicalHistory: 'Type 2 Diabetes (10 years)',
    reports: []
  },
  { 
    id: '4', name: 'Emily Davis', age: 29, gender: 'Female', reason: 'Post-Surgery Review', 
    status: 'Incoming', time: '12:00 PM', date: '2026-03-24', 
    symptoms: 'Slight redness at incision site', isFirstVisit: false, fees: 2000,
    medicalHistory: 'Appendectomy (2 weeks ago)',
    reports: ['post_op_scan.png']
  },
  { 
    id: '5', name: 'Robert Miller', age: 72, gender: 'Male', reason: 'Hypertension Consultation', 
    status: 'Accepted', time: '02:30 PM', date: '2026-03-24', 
    symptoms: 'Frequent dizziness, high BP readings', isFirstVisit: true, fees: 1200,
    medicalHistory: 'Stroke (2020)',
    reports: []
  },
]

export default function DoctorPatientManagement() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState(initialAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  
  const [openPrescription, setOpenPrescription] = useState(false)
  const [openInvoice, setOpenInvoice] = useState(false)
  
  const [statusTab, setStatusTab] = useState('Incoming')
  const [filterDate, setFilterDate] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [profileTab, setProfileTab] = useState('Basic Info')
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: '',
    symptoms: '',
    medicines: [{ name: '', dosage: '', duration: '', notes: '' }],
    instructions: '',
    followUpDate: '',
    assessment: ''
  })

  const filteredAppointments = useMemo(() => {
    return appointments.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusTab === 'All' || p.status === statusTab
      const matchesDate = !filterDate || p.date === filterDate
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchTerm, appointments, statusTab, filterDate])

  const handleStatusChange = (id: string, newStatus: string, additionalData: any = {}) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, ...additionalData } : a))
    toast.success(`Appointment ${newStatus.toLowerCase()}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return theme.palette.success.main
      case 'Ongoing': return theme.palette.warning.main
      case 'Incoming': return theme.palette.primary.main
      case 'Accepted': return theme.palette.info.main
      case 'Rejected': return theme.palette.error.main
      default: return theme.palette.text.secondary
    }
  }

  const handleAddMedicine = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', duration: '', notes: '' }]
    }))
  }

  const handleMedicineChange = (index: number, field: string, value: string) => {
    setPrescriptionForm(prev => {
      const newMedicines = [...prev.medicines]
      newMedicines[index] = { ...newMedicines[index], [field]: value }
      return { ...prev, medicines: newMedicines }
    })
  }

  const calculateInvoiceTotal = (appt: any) => {
    let baseFee = appt.fees || 1200
    if (appt.isFirstVisit) baseFee += 300
    if (appt.age < 12) baseFee -= 200
    
    const medicineCost = prescriptionForm.medicines.length * 150 // Mock cost
    return baseFee + medicineCost
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header section with responsive layout */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>Patient Management</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Review and manage clinical appointments.</Typography>
        </Box>
      </Box>

      {/* Filter Bar with professional rounding */}
      <Card sx={{ 
        borderRadius: 3, mb: 4, 
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
              <TextField 
                  fullWidth variant="outlined" size="small" 
                  placeholder="Search by name, ID or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ 
                      startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: alpha(theme.palette.action.hover, 0.04),
                        '& fieldset': { borderColor: alpha(theme.palette.divider, 0.1) } 
                      } 
                  }} 
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="date"
                  size="small"
                  variant="outlined"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CalendarMonth sx={{ fontSize: 20 }} /></InputAdornment>,
                    sx: { borderRadius: 2, bgcolor: alpha(theme.palette.action.hover, 0.04), '& fieldset': { borderColor: alpha(theme.palette.divider, 0.1) } }
                  }}
                />
                <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 2, px: 3, height: 40, borderColor: alpha(theme.palette.divider, 0.2), color: 'text.primary', textTransform: 'none', fontWeight: 700 }}>Filters</Button>
              </Box>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Tabs 
              value={statusTab} 
              onChange={(_, v) => setStatusTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: getStatusColor(statusTab) },
                '& .MuiTab-root': { fontWeight: 700, minWidth: { xs: 80, sm: 120 }, textTransform: 'none', fontSize: 14, pb: 1, color: 'text.secondary' }
              }}
            >
              {['Incoming', 'Accepted', 'Ongoing', 'Completed', 'Rejected', 'All'].map((status) => (
                <Tab key={status} label={status} value={status} sx={{ '&.Mui-selected': { color: getStatusColor(status) } }} />
              ))}
            </Tabs>
        </CardContent>
      </Card>

      {/* Appointment Table with professional container */}
      <TableContainer component={Paper} sx={{ 
        borderRadius: 3, 
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.03)', 
        overflow: 'hidden', 
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '& .MuiTable-root': { borderCollapse: 'separate', borderSpacing: 0 }
      }}>
        <Box sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.divider, 0.2), borderRadius: 3 } }}>
        <Table>
          <TableHead sx={{ bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, pl: 3, width: '25%' }}>Patient Identity</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '30%' }}>Reason for Visit</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '15%' }}>Time Slot</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '15%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'right', pr: 3, width: '15%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredAppointments.length > 0 ? filteredAppointments.map((appt: any) => (
                <TableRow 
                    key={appt.id} 
                    component={motion.tr} 
                    layout
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }} 
                    hover 
                    sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}
                >
                  <TableCell sx={{ pl: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: alpha(getStatusColor(appt.status), 0.1), 
                        color: getStatusColor(appt.status),
                        fontWeight: 700, border: `1px solid ${alpha(getStatusColor(appt.status), 0.2)}`
                      }}>{appt.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>{appt.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{appt.age}Y • {appt.gender}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{appt.reason}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{appt.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={appt.status} 
                        size="small" 
                        sx={{ 
                            bgcolor: alpha(getStatusColor(appt.status), 0.1), 
                            color: getStatusColor(appt.status),
                            fontWeight: 800, fontSize: 10, textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {appt.status === 'Incoming' && (
                        <>
                          <Tooltip title="Accept Appointment">
                            <IconButton 
                              size="small" color="primary"
                              onClick={() => handleStatusChange(appt.id, 'Accepted')}
                              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                            >
                              <Check fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" color="error"
                              onClick={() => handleStatusChange(appt.id, 'Rejected')}
                              sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {appt.status === 'Accepted' && (
                        <Button 
                          size="small" variant="contained" 
                          startIcon={<PlayArrow fontSize="small" />}
                          onClick={() => handleStatusChange(appt.id, 'Ongoing')}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                          Start Consultation
                        </Button>
                      )}

                      {appt.status === 'Ongoing' && (
                        <>
                          <Button 
                            size="small" variant="outlined" color="success"
                            startIcon={<EditNote fontSize="small" />}
                            onClick={() => { setSelectedAppointment(appt); setOpenPrescription(true); }}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Prescription
                          </Button>
                          <Tooltip title="Complete">
                            <IconButton 
                              size="small" color="success"
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                              sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}
                            >
                              <CheckCircleOutline fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {(appt.status === 'Completed' || appt.status === 'Rejected') && (
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedAppointment(appt); setOpenDrawer(true); }}
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}

                      <Tooltip title="View Patient Profile">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedAppointment(appt); setOpenDrawer(true); }}
                          sx={{ bgcolor: alpha('#475569', 0.05) }}
                        >
                          <Description fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">No appointments found for this category.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Box>
    </TableContainer>

      {/* Patient Side Panel */}
      {/* Elaborate Patient Side Panel */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 550, md: 600 }, border: 'none', bgcolor: 'background.default', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }
        }}
      >
        <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header Area */}
          <Box sx={{ bgcolor: theme.palette.primary.main, color: '#fff', position: 'relative' }}>
            {/* Background design element */}
            <Box sx={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', bgcolor: alpha('#fff', 0.1), pointerEvents: 'none' }} />
            
            <Box sx={{ p: { xs: 3, sm: 4 }, pb: 2, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: 13, opacity: 0.9 }}>Clinical Intelligence Profile</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700 }}>Data integrity: High • Live Sync Active</Typography>
                  </Box>
                  <IconButton onClick={() => setOpenDrawer(false)} sx={{ color: '#fff', bgcolor: alpha('#fff', 0.1), '&:hover': { bgcolor: alpha('#fff', 0.2) } }}><Close /></IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 4 }}>
                  <Avatar sx={{ width: 85, height: 85, bgcolor: '#fff', color: 'primary.main', fontWeight: 900, fontSize: 36, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', border: '4px solid', borderColor: alpha('#fff', 0.2) }}>
                    {selectedAppointment?.name?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>{selectedAppointment?.name}</Typography>
                        <Chip label="Patient" size="small" sx={{ bgcolor: alpha('#fff', 0.2), color: '#fff', fontWeight: 800, borderRadius: 1, height: 20, fontSize: 9 }} />
                    </Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 700, whiteSpace: 'nowrap' }}>ID: {selectedAppointment?.id || 'P-001'}</Typography>
                      <Divider orientation="vertical" flexItem sx={{ bgcolor: alpha('#fff', 0.3), height: 12, my: 'auto' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600, whiteSpace: 'nowrap' }}>{selectedAppointment?.gender} • {selectedAppointment?.age}Y • {selectedAppointment?.bloodGroup || 'A+'}</Typography>
                    </Stack>
                  </Box>
                </Box>
            </Box>

            {/* In-drawer Tabs */}
            <Tabs 
              value={profileTab} 
              onChange={(_, v) => setProfileTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: { xs: 2, sm: 4 },
                '& .MuiTabs-indicator': { bgcolor: '#fff', height: 4, borderRadius: '4px 4px 0 0' },
                '& .MuiTab-root': { color: alpha('#fff', 0.7), fontWeight: 800, textTransform: 'none', fontSize: 13, minWidth: 90, py: 2, '&.Mui-selected': { color: '#fff' } }
              }}
            >
              {[
                { label: 'Basic Info', value: 'Basic Info' },
                { label: 'Previous Records (Full History)', value: 'Medical History' },
                { label: 'Consultations', value: 'Doctors' },
                { label: 'Prescriptions', value: 'Prescriptions' },
                { label: 'Reports', value: 'Reports' }
              ].map(t => <Tab key={t.value} label={t.label} value={t.value} />)}
            </Tabs>
          </Box>

          {/* Tab Content Area */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: isDark ? 'transparent' : '#fcfdfe' }}>
            <AnimatePresence mode="wait">
              {profileTab === 'Basic Info' && (
                <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

                  {selectedAppointment?.status === 'Completed' && selectedAppointment?.assessment && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'text.secondary', letterSpacing: 1 }}>MEDICAL SESSION ASSESSMENT</Typography>
                        <Box sx={{ 
                            p: 2, borderRadius: 3, border: '2px solid', 
                            borderColor: selectedAppointment.assessment === 'NORMAL' ? alpha('#10b981', 0.2) : (selectedAppointment.assessment === 'SEVERE' ? alpha('#f59e0b', 0.2) : alpha('#ef4444', 0.2)), 
                            bgcolor: selectedAppointment.assessment === 'NORMAL' ? alpha('#10b981', 0.05) : (selectedAppointment.assessment === 'SEVERE' ? alpha('#f59e0b', 0.05) : alpha('#ef4444', 0.05)),
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: selectedAppointment.assessment === 'NORMAL' ? '#10b981' : (selectedAppointment.assessment === 'SEVERE' ? '#f59e0b' : '#ef4444') }}>
                                {selectedAppointment.assessment}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Recorded during consultation</Typography>
                        </Box>
                    </Box>
                  )}
                  
                  {/* USER UPLOADED REPORTS SECTION - ADDED AS REQUESTED */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'text.secondary', letterSpacing: 1 }}>USER UPLOADED SCANS & REPORTS</Typography>
                  <Box sx={{ mb: 4, display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { borderRadius: 10, bgcolor: alpha(theme.palette.divider, 0.1) } }}>
                    {[
                      { type: 'X-RAY', date: '21 Mar', name: 'Chest_Scan_01.jpg' },
                      { type: 'LAB', date: '19 Mar', name: 'Blood_Report_v2.pdf' },
                      { type: 'MRI', date: '15 Mar', name: 'Spine_L4_L5.png' }
                    ].map((rep, idx) => (
                      <Paper key={idx} sx={{ minWidth: 160, p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.action.hover, 0.02), cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.01), transform: 'translateY(-2px)' } }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mb: 1, width: 32, height: 32 }} variant="rounded"><Description sx={{ fontSize: 18 }} /></Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block' }}>{rep.type}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 11, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>{rep.date}</Typography>
                      </Paper>
                    ))}
                    <Box sx={{ minWidth: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3, cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.05) } }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>+ More</Typography>
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'text.secondary', letterSpacing: 1 }}>PATIENT MESSAGE (BOOKING NOTES)</Typography>
                  <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.1) }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontStyle: 'italic', color: 'text.primary', lineHeight: 1.6 }}>
                        "{selectedAppointment?.symptoms}. I've been feeling this for 3 days now, especially after meals. Looking for a follow-up on my previous medication."
                    </Typography>
                  </Box>



                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'text.secondary', letterSpacing: 1.2 }}>VITAL CLINICAL STATISTICS</Typography>
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                      { label: 'BP', value: '118/78', unit: 'mmHg', color: '#ef4444' },
                      { label: 'Weight', value: '72.4', unit: 'kg', color: '#3b82f6' },
                      { label: 'Heart', value: '78', unit: 'bpm', color: '#ec4899' },
                      { label: 'Temp', value: '98.4', unit: '°F', color: '#10b981' }
                    ].map((v) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={v.label}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: alpha(v.color, 0.1), bgcolor: alpha(v.color, 0.02), textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', display: 'block', fontSize: 10 }}>{v.label}</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: v.color, my: 0.5 }}>{v.value}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', fontSize: 9 }}>{v.unit}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'text.secondary', letterSpacing: 1.2 }}>CORE IDENTIFICATION RECORDS</Typography>
                  <Box sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    {[
                        { label: 'Patient UID', value: 'P-99-A-X77' },
                        { label: 'Registered On', value: '12 Jan 2024' },
                        { label: 'Blood Group', value: 'A+ (Positive)' },
                        { label: 'Primary Language', value: 'English / Hindi' },
                        { label: 'Emergency Contact', value: '+91 98XXX-XX932' }
                    ].map((row, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', p: 1.8, borderBottom: idx === 4 ? 'none' : '1px solid', borderColor: alpha(theme.palette.divider, 0.5), bgcolor: idx % 2 === 0 ? 'transparent' : alpha(theme.palette.action.hover, 0.01) }}>
                            <Typography variant="subtitle2" sx={{ width: 160, fontWeight: 800, color: 'text.secondary', fontSize: 13 }}>{row.label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: 14 }}>{row.value}</Typography>
                        </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {profileTab === 'Medical History' && (
                <Box component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Long-term Medical Record</Typography>
                  <Stack spacing={3}>
                    <Box sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha('#ef4444', 0.05), borderLeft: '5px solid #ef4444' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Block sx={{ fontSize: 18 }} /> Allergies & Critical Risks
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, color: '#ef4444' }}>
                        Penicillin, Tree Nuts, Dust Mite Allergy.
                      </Typography>
                    </Box>

                    <Box sx={{ position: 'relative', pl: 4, pb: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                       <Box sx={{ position: 'absolute', top: 0, left: -6, width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', border: '2px solid #fff' }} />
                       <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, display: 'block' }}>PRESENT: MARCH 2026</Typography>
                       <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.action.hover, 0.04), border: '1px solid', borderColor: 'divider' }}>
                           <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Visit: {selectedAppointment?.reason}</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Currently consulting for {selectedAppointment?.symptoms.toLowerCase()} issues.</Typography>
                       </Paper>
                    </Box>

                    <Box sx={{ position: 'relative', pl: 4, pb: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                       <Box sx={{ position: 'absolute', top: 0, left: -6, width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', border: '2px solid #fff' }} />
                       <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', mb: 1, display: 'block' }}>FEBRUARY 10, 2026</Typography>
                       <Box>
                           <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Major: Appendectomy Surgery</Typography>
                           <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Recovered successfully. Biopsy results were negative for malignancy.</Typography>
                           <Chip label="Surgical History" size="small" sx={{ mt: 1.5, fontWeight: 700 }} />
                       </Box>
                    </Box>

                    <Box sx={{ position: 'relative', pl: 4, borderLeft: '2px solid', borderColor: 'divider' }}>
                       <Box sx={{ position: 'absolute', top: 0, left: -6, width: 10, height: 10, borderRadius: '50%', bgcolor: 'text.disabled', border: '2px solid #fff' }} />
                       <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', mb: 1, display: 'block' }}>YEAR 2024</Typography>
                       <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Type 2 Diabetes Screening</Typography>
                       <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>Patient was pre-diabetic. Controlled via lifestyle and diet. Current HbA1c: 5.7.</Typography>
                    </Box>
                  </Stack>

                  <Typography variant="overline" sx={{ fontWeight: 800, color: 'error.main', mt: 4, mb: 2, display: 'block' }}>In-Patient Admissions & ER Visits</Typography>
                  <Stack spacing={2}>
                    {[
                      { reason: 'Acute Gastritis', type: 'ER Admission', stay: '2 Days', date: 'Jan 15, 2026', room: 'B-Block 204' },
                      { reason: 'Appendectomy Surgery', type: 'Planned Surgery', stay: '3 Days', date: 'Feb 10, 2026', room: 'Surgical Wing' }
                    ].map((ad) => (
                      <Box key={ad.reason + ad.date} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: alpha('#ef4444', 0.1), bgcolor: alpha('#ef4444', 0.01) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{ad.reason}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{ad.type} • Admission: {ad.date}</Typography>
                          </Box>
                          <Chip label={ad.stay} size="small" sx={{ fontWeight: 800, fontSize: 10, height: 20, bgcolor: alpha('#ef4444', 0.1), color: 'error.dark' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Allocated: {ad.room}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {profileTab === 'Doctors' && (
                <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Consultation History</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Doctors previously visited by this patient across our network.</Typography>
                  
                  <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'block' }}>Primary Physicians</Typography>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {[
                      { name: 'Dr. Sarah Johnson', dept: 'Cardiology', lastVisit: 'March 15, 2026' },
                      { name: 'Dr. Michael Chen', dept: 'Gastroenterology', lastVisit: 'Feb 10, 2026' }
                    ].map((doc) => (
                      <Paper key={doc.name} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 800 }}>{doc.name[4]}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{doc.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{doc.dept} • Last Visit: {doc.lastVisit}</Typography>
                        </Box>
                        <IconButton size="small"><ArrowForward sx={{ fontSize: 16 }} /></IconButton>
                      </Paper>
                    ))}
                  </Stack>

                  <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', mb: 2, display: 'block' }}>Other Specialist Consultations</Typography>
                  <Stack spacing={2}>
                    {[
                      { name: 'Dr. James Smith', dept: 'Dermatology', date: 'Jan 2026' },
                      { name: 'Dr. Emily Blunt', dept: 'Neurology', date: 'Dec 2025' }
                    ].map((doc) => (
                      <Box key={doc.name} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.5), display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{doc.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{doc.dept} • {doc.date}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {profileTab === 'Prescriptions' && (
                <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>Medication Log</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Historical and current prescriptions issued to the patient.</Typography>
                  <Stack spacing={2}>
                    {[
                      { name: 'Amlodipine 5mg', dosage: '1-0-1', duration: 'Ongoing', type: 'BP medication', date: 'Current' },
                      { name: 'Pantoprazole 40mg', dosage: '1-0-0', duration: '14 Days', type: 'Antacid', date: 'Feb 2026' },
                      { name: 'Metformin 500mg', dosage: '0-0-1', duration: 'Life-long', type: 'Diabetes Control', date: 'Ongoing' }
                    ].map((med) => (
                      <Box key={med.name} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: med.date === 'Current' ? alpha(theme.palette.success.main, 0.02) : 'transparent' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{med.name}</Typography>
                          <Chip label={med.date} size="small" sx={{ fontWeight: 800, height: 20, fontSize: 9, bgcolor: med.date === 'Current' ? 'success.main' : 'default', color: med.date === 'Current' ? '#fff' : 'inherit' }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>CATEGORY: {med.type}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800 }}>DOSAGE</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{med.dosage}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800 }}>DURATION</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{med.duration}</Typography>
                            </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {profileTab === 'Reports' && (
                <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Clinical Documents</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Scans, Lab reports and uploads.</Typography>
                    </Box>
                    <Button size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 2 }}>Export All</Button>
                  </Box>

                  <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'block' }}>Recent Lab Tests</Typography>
                  <Stack spacing={2} sx={{ mb: 4 }}>
                    {[
                      { title: 'Full Blood Count (CBC)', date: 'Mar 15, 2026', size: '2.4 MB', status: 'Final' },
                      { title: 'Lipid Profile Summary', date: 'Feb 10, 2026', size: '1.1 MB', status: 'Final' }
                    ].map((rep) => (
                      <Paper key={rep.title} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, '&:hover': { borderColor: 'primary.main' } }}>
                        <Avatar sx={{ bgcolor: alpha('#ef4444', 0.1), color: '#ef4444', borderRadius: 2 }} variant="square"><Description /></Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{rep.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{rep.date} • {rep.size}</Typography>
                        </Box>
                        <IconButton size="small"><Visibility sx={{ fontSize: 18 }} /></IconButton>
                      </Paper>
                    ))}
                  </Stack>

                  <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', mb: 2, display: 'block' }}>Radiology & Imaging</Typography>
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                      { title: 'Chest X-Ray', date: 'Jan 20, 2026' },
                      { title: 'Abdomen Ultrasound', date: 'Dec 15, 2025' }
                    ].map((img) => (
                      <Grid size={{ xs: 6 }} key={img.title}>
                        <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.action.hover, 0.04), border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                          <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}><Visibility /></Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 800, display: 'block' }}>{img.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{img.date}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="overline" sx={{ fontWeight: 800, color: theme.palette.warning.main, mb: 2, display: 'block' }}>Patient Shared Documents (During Booking)</Typography>
                  <Stack spacing={1.5}>
                    {[
                      { title: 'Previous_RX_Old_Hospital.jpg', size: '1.4MB', note: 'Patient: "Old prescription from last year"' },
                      { title: 'Symptom_Photo_1.png', size: '0.8MB', note: 'Patient: "Rash area on right arm"' }
                    ].map((doc) => (
                      <Box key={doc.title} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.03), border: '1px dashed', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.dark' }} variant="rounded"><Description sx={{ fontSize: 18 }} /></Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{doc.title}</Typography>
                          </Box>
                          <Button size="small" variant="text" sx={{ fontWeight: 700, fontSize: 11 }}>View File</Button>
                        </Box>
                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', display: 'block' }}>{doc.note}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </AnimatePresence>
          </Box>

          <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: isDark ? 'transparent' : '#f8fafc', display: 'flex', gap: 2 }}>
            <Button fullWidth variant="outlined" startIcon={<ReceiptLong />} onClick={() => toast.success('Billing history records retrieved successfully.')} sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700 }}>Billing history</Button>
            <Button fullWidth variant="contained" onClick={() => setOpenDrawer(false)} sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 700 }}>Close Profile</Button>
          </Box>
        </Box>
      </Drawer>

      {/* Structured Prescription Dialog */}
      <Dialog open={openPrescription} onClose={() => setOpenPrescription(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}><MedicalServices /></Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Clinical Prescription</Typography>
            </Box>
            <IconButton onClick={() => setOpenPrescription(false)}><Close /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Diagnosis</Typography>
                <TextField 
                  fullWidth multiline rows={3} placeholder="Enter final diagnosis..." 
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm(f => ({ ...f, diagnosis: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Observations & Symptoms</Typography>
                <TextField 
                  fullWidth multiline rows={3} placeholder="Patient's current condition..." 
                  value={prescriptionForm.symptoms}
                  onChange={(e) => setPrescriptionForm(f => ({ ...f, symptoms: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800}>Medications</Typography>
                  <Button startIcon={<Add />} onClick={handleAddMedicine} size="small" variant="text" sx={{ fontWeight: 700 }}>Add Medicine</Button>
                </Box>
                <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: alpha(theme.palette.success.main, 0.02) }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Medicine Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Dosage</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptionForm.medicines.map((med, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ border: 'none' }}>
                            <TextField 
                              fullWidth size="small" placeholder="Paracetamol" value={med.name} 
                              onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                              sx={{ '& fieldset': { border: 'none' } }}
                            />
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            <TextField 
                              fullWidth size="small" placeholder="500mg (1-0-1)" value={med.dosage} 
                              onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                              sx={{ '& fieldset': { border: 'none' } }}
                            />
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            <TextField 
                              fullWidth size="small" placeholder="5 Days" value={med.duration} 
                              onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                              sx={{ '& fieldset': { border: 'none' } }}
                            />
                          </TableCell>
                          <TableCell sx={{ border: 'none' }}>
                            <TextField 
                              fullWidth size="small" placeholder="Take after meal" value={med.notes} 
                              onChange={(e) => handleMedicineChange(idx, 'notes', e.target.value)}
                              sx={{ '& fieldset': { border: 'none' } }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Additional Instructions</Typography>
                <TextField 
                  fullWidth size="small" placeholder="E.g. Bed rest for 2 days..." 
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm(f => ({ ...f, instructions: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Follow-up Date</Typography>
                <TextField 
                  fullWidth type="date" size="small" 
                  value={prescriptionForm.followUpDate}
                  onChange={(e) => setPrescriptionForm(f => ({ ...f, followUpDate: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2, borderStyle: 'dotted' }} />
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 900, color: 'text.secondary', letterSpacing: 1 }}>MEDICAL SESSION ASSESSMENT</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {[
                    { label: 'NORMAL', color: '#10b981', desc: 'Condition stable' },
                    { label: 'SEVERE', color: '#f59e0b', desc: 'Needs monitoring' },
                    { label: 'CRITICAL', color: '#ef4444', desc: 'Immediate priority' }
                  ].map((lvl) => {
                    const isSelected = prescriptionForm.assessment === lvl.label;
                    const opacity = isSelected ? 1 : (prescriptionForm.assessment ? 0.3 : 1);
                    return (
                      <Box key={lvl.label} 
                        onClick={() => setPrescriptionForm({ ...prescriptionForm, assessment: lvl.label })}
                        sx={{ 
                          flex: 1, p: 2, borderRadius: 3, border: '2px solid', 
                          borderColor: isSelected ? lvl.color : alpha(lvl.color, 0.1), 
                          bgcolor: isSelected ? alpha(lvl.color, 0.1) : alpha(lvl.color, 0.01),
                          cursor: 'pointer', transition: 'all 0.2s',
                          textAlign: 'center', opacity,
                          '&:hover': { opacity: 1, borderColor: lvl.color, bgcolor: alpha(lvl.color, 0.04), transform: 'translateY(-2px)' }
                        }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: lvl.color, display: 'block' }}>{lvl.label}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 10 }}>{lvl.desc}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setOpenPrescription(false)} sx={{ fontWeight: 700, px: 3 }}>Cancel</Button>
            <Button 
                variant="contained" color="success" 
                onClick={() => { setOpenPrescription(false); setOpenInvoice(true); }} 
                sx={{ borderRadius: 2.5, px: 4, py: 1, fontWeight: 700 }}
            >
                Confirm & Generate Invoice
            </Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Invoice Dialog */}
      <Dialog open={openInvoice} onClose={() => setOpenInvoice(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}><Payments /></Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Invoice Generation</Typography>
            </Box>
            <IconButton onClick={() => setOpenInvoice(false)}><Close /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3, bgcolor: alpha(theme.palette.background.paper, 0.4) }}>
            <Box sx={{ p: 3, border: `2px solid ${alpha(theme.palette.warning.main, 0.1)}`, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>CLINICAL RECORD FOR</Typography>
                          <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>{selectedAppointment?.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>P-ID: {selectedAppointment?.id || '774328'} • {selectedAppointment?.gender} ({selectedAppointment?.age}Y)</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="overline" color="text.secondary" fontWeight={900} sx={{ letterSpacing: 1.5 }}>INVOICE DATE</Typography>
                          <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ borderStyle: 'solid', opacity: 0.6 }} />

                    <Box>
                      <Typography variant="subtitle2" color="primary" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description sx={{ fontSize: 18 }} /> SUMMARY OF CHARGES
                      </Typography>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight={700}>Professional Consultation Fee</Typography>
                          <Typography variant="body2" fontWeight={800}>₹{selectedAppointment?.fees}</Typography>
                        </Box>
                        {selectedAppointment?.isFirstVisit && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">New Patient Registration</Typography>
                            <Typography variant="body2" fontWeight={800}>+ ₹300</Typography>
                          </Box>
                        )}
                        <Stack spacing={0.5} sx={{ pl: 2, borderLeft: '2px solid', borderColor: alpha(theme.palette.divider, 0.5) }}>
                            {prescriptionForm.medicines.filter(m => m.name).map((med, idx) => (
                              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">{med.name} Supply</Typography>
                                <Typography variant="caption" fontWeight={700}>₹150</Typography>
                              </Box>
                            ))}
                        </Stack>
                      </Stack>
                    </Box>

                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={900} color="primary.main">Total Invoice Amount</Typography>
                        <Typography variant="h5" color="primary.dark" fontWeight={1000}>₹{selectedAppointment ? calculateInvoiceTotal(selectedAppointment) : 0}</Typography>
                    </Box>
                </Stack>
            </Box>
            <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 3, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <History color="info" fontSize="small" />
              <Typography variant="caption" color="info.main" fontWeight={700}>
                Receipt & digital medical record will be shared with the patient instantly upon completion.
              </Typography>
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
            <Button variant="outlined" startIcon={<ReceiptLong />} onClick={() => { setOpenInvoice(false); toast.success('Receipt download started'); }} sx={{ borderRadius: 2.5, fontWeight: 800, px: 3, textTransform: 'none' }}>Draft Copy</Button>
            <Button variant="contained" color="warning" onClick={() => { 
                setOpenInvoice(false); 
                const extra = { assessment: prescriptionForm.assessment };
                handleStatusChange(selectedAppointment.id, 'Completed', extra); 
                setSelectedAppointment((prev: any) => prev ? { ...prev, status: 'Completed', ...extra } : null);
                toast.success('Consultation Completed Successfully!'); 
            }} sx={{ borderRadius: 2.5, px: 5, py: 1.5, fontWeight: 900, boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.3)}`, textTransform: 'none' }}>Finish Consulting & Generate Receipt</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

