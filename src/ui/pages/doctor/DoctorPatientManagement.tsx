import { useState, useMemo } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, TextField, 
  IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, InputAdornment, Dialog, DialogTitle, DialogContent, 
  DialogActions, Stack, useTheme, alpha, Tooltip,
  Divider, TextareaAutosize
} from '@mui/material'
import { 
  Search, FilterList, Visibility, 
  Close, EditNote, EventNote,
  MedicalServices,
  History
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const mockAppointments = [
  { id: '1', name: 'John Doe', time: '09:00 AM', reason: 'Routine Checkup', status: 'Done', age: 45, gender: 'Male' },
  { id: '2', name: 'Sarah Smith', time: '10:30 AM', reason: 'Chest Pain', status: 'In Progress', age: 32, gender: 'Female' },
  { id: '3', name: 'Michael Brown', time: '11:15 AM', reason: 'Diabetes Follow-up', status: 'Pending', age: 58, gender: 'Male' },
  { id: '4', name: 'Emily Davis', time: '12:00 PM', reason: 'Post-Surgery Review', status: 'Pending', age: 29, gender: 'Female' },
  { id: '5', name: 'Robert Miller', time: '02:30 PM', reason: 'Hypertension Consultation', status: 'Pending', age: 72, gender: 'Male' },
]

export default function DoctorPatientManagement() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [openNotes, setOpenNotes] = useState(false)
  const [openPrescription, setOpenPrescription] = useState(false)

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reason.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return theme.palette.success.main
      case 'In Progress': return theme.palette.warning.main
      case 'Pending': return theme.palette.primary.main
      default: return theme.palette.text.secondary
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Appointments</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Manage patient visits and clinical records.</Typography>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card sx={{ 
        borderRadius: 4, mb: 4, 
        boxShadow: theme.shadows[2],
        background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
      }}>
        <CardContent sx={{ p: 2.5, display: 'flex', gap: 2 }}>
            <TextField 
                fullWidth variant="outlined" size="small" 
                placeholder="Search by patient name or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ 
                    startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    sx: { 
                      borderRadius: 3, 
                      bgcolor: isDark ? alpha('#fff', 0.05) : '#f1f5f9', 
                      '& fieldset': { border: 'none' } 
                    } 
                }} 
            />
            <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 3, px: 3, borderColor: 'divider', color: 'text.primary' }}>Filters</Button>
        </CardContent>
      </Card>

      {/* Appointment Table */}
      <TableContainer component={Paper} sx={{ 
        borderRadius: 4, 
        boxShadow: theme.shadows[2], 
        overflow: 'hidden',
        background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
      }}>
        <Table>
          <TableHead sx={{ bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Patient Identity</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Reason for Visit</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="wait">
              {filteredAppointments.map((appt: any) => (
                <TableRow 
                    key={appt.id} 
                    component={motion.tr} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    hover 
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: isDark ? alpha('#fff', 0.03) : alpha(theme.palette.primary.main, 0.02) } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(getStatusColor(appt.status), 0.15), color: getStatusColor(appt.status) }}>{appt.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>{appt.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{appt.age}Y • {appt.gender}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>{appt.reason}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{appt.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={appt.status} 
                        size="small" 
                        variant={isDark ? 'outlined' : 'filled'}
                        sx={{ 
                            bgcolor: isDark ? 'transparent' : alpha(getStatusColor(appt.status), 0.1), 
                            color: getStatusColor(appt.status),
                            borderColor: alpha(getStatusColor(appt.status), 0.5),
                            fontWeight: 700, fontSize: 11 
                        }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedAppointment(appt); setOpenDetails(true); }}
                          sx={{ color: isDark ? 'primary.light' : '#0d9488', bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : '#f1f5f9' }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add Notes">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedAppointment(appt); setOpenNotes(true); }}
                          sx={{ color: 'text.secondary', bgcolor: isDark ? alpha('#fff', 0.05) : '#f1f5f9' }}
                        >
                          <EventNote fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Write Prescription">
                        <IconButton 
                          size="small" 
                          onClick={() => { setSelectedAppointment(appt); setOpenPrescription(true); }}
                          sx={{ color: 'success.main', bgcolor: isDark ? alpha(theme.palette.success.main, 0.1) : '#f1f5f9' }}
                        >
                          <EditNote fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Patient Details Dialog */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Patient Details</Typography>
            <IconButton onClick={() => setOpenDetails(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 4, p: 2, bgcolor: isDark ? alpha('#fff', 0.03) : '#f8fafc', borderRadius: 4 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: 32, bgcolor: 'primary.main' }}>{selectedAppointment?.name?.[0]}</Avatar>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedAppointment?.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{selectedAppointment?.age} Years • {selectedAppointment?.gender}</Typography>
                    <Chip label={`Reason: ${selectedAppointment?.reason}`} size="small" sx={{ mt: 1, fontWeight: 700 }} />
                </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Clinical History</Typography>
            <Box sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.02) : '#f1f5f9', borderRadius: 3, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>No recent complications. Vital signs stable last visit. Patient reports mild fatigue.</Typography>
            </Box>
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={openNotes} onClose={() => setOpenNotes(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventNote color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Clinical Notes</Typography>
            </Box>
            <IconButton onClick={() => setOpenNotes(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>Add clinical observations for {selectedAppointment?.name}.</Typography>
            <TextField 
                fullWidth multiline rows={4} 
                placeholder="Type your notes here..." 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenNotes(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => { setOpenNotes(false); toast.success('Notes saved!'); }} sx={{ borderRadius: 2 }}>Save Notes</Button>
        </DialogActions>
      </Dialog>

      {/* Write Prescription Dialog */}
      <Dialog open={openPrescription} onClose={() => setOpenPrescription(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2, backgroundImage: 'none' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices color="success" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Write Prescription</Typography>
            </Box>
            <IconButton onClick={() => setOpenPrescription(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>PRESCRIPTION FOR</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{selectedAppointment?.name}</Typography>
            </Box>
            <TextField 
                fullWidth multiline rows={6} 
                placeholder="Medications, dosage, and instructions..." 
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenPrescription(false)}>Cancel</Button>
            <Button variant="contained" color="success" onClick={() => { setOpenPrescription(false); toast.success('Prescription generated!'); }} sx={{ borderRadius: 2 }}>Confirm & Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

