import { useState } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, 
  IconButton, TextField, Stack, List, ListItem, 
  ListItemAvatar, ListItemText, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, useTheme, alpha
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { 
  VideoCall, EditNote, History, 
  Print, Checklist, HealthAndSafety, 
  Timeline, Save, Close,
  CheckCircleOutline,
  AutoAwesome,
  Psychology,
  HelpOutline
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function DoctorConsultation() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [activeSession, setActiveSession] = useState(true)
  const [notes, setNotes] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const timelineEvents = [
    { date: '22 Mar, 2:30 PM', event: 'Blood Pressure High (150/95)', category: 'Urgent' },
    { date: '18 Mar, 10:00 AM', event: 'Prescribed Amlodipine 5mg', category: 'Prescription' },
    { date: '10 Mar, 11:30 AM', event: 'Lab: Lipid Profile Normal', category: 'Lab Result' },
  ]

  const handleApplyDiagnosis = () => {
    toast.success('Diagnosis and Prescription applied to case file', {
      duration: 3000
    })
  }

  const handleEndSession = () => {
    setActiveSession(false)
    setShowSummary(true)
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Consultation</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Appointment with Jane Smith</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
           <Button variant="outlined" startIcon={<History />} sx={{ borderRadius: 3, px: 3, borderColor: 'divider', color: 'text.primary' }}>Full Case History</Button>
           <Button 
                variant="contained" 
                disabled={!activeSession} 
                color="error" 
                onClick={handleEndSession}
                sx={{ borderRadius: 3, px: 3 }}
            >
                End Session
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Video & Chat Integration (Simulation) */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ 
            borderRadius: 4, 
            bgcolor: isDark ? alpha('#0f172a', 0.8) : '#0f172a', 
            height: 420, position: 'relative', overflow: 'hidden', mb: 3, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: theme.shadows[10],
            border: isDark ? `1px solid ${alpha('#fff', 0.05)}` : 'none'
          }}>
             <Box sx={{ textAlign: 'center', color: 'white' }}>
                 <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: `4px solid ${isDark ? '#0ea5e9' : '#0d9488'}` }}>JS</Avatar>
                 <Typography variant="h5" sx={{ fontWeight: 800 }}>Jane Smith</Typography>
                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {activeSession ? 'Video consultation in progress...' : 'Session Ended'}
                 </Typography>
             </Box>
             {activeSession && (
                <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}><VideoCall /></IconButton>
                    <IconButton sx={{ bgcolor: isDark ? '#0ea5e9' : '#0d9488', color: 'white', '&:hover': { bgcolor: isDark ? '#38bdf8' : '#0b7a6d' } }}><HealthAndSafety /></IconButton>
                    <IconButton onClick={handleEndSession} sx={{ bgcolor: '#ef4444', color: 'white', '&:hover': { bgcolor: '#dc2626' } }}><Close /></IconButton>
                </Box>
             )}
          </Card>

          <Card sx={{ 
            borderRadius: 4, minHeight: 400, 
            boxShadow: theme.shadows[2],
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            backdropFilter: isDark ? 'blur(10px)' : 'none',
            border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
          }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <EditNote sx={{ color: isDark ? 'primary.light' : '#0d9488' }} /> Active Case Notes & Prescription
                </Typography>
                
                <TextField 
                    fullWidth multiline rows={6} 
                    placeholder="Document symptoms, physical evaluation, and diagnosis..."
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: isDark ? alpha('#fff', 0.03) : '#f8fafc' } }}
                />

                <Box sx={{ 
                  p: 3, 
                  bgcolor: isDark ? alpha(theme.palette.success.main, 0.05) : '#f0fdf4', 
                  borderRadius: 4, 
                  border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.2) : '#dcfce7'}`, 
                  mb: 3 
                }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isDark ? 'success.light' : '#166534', mb: 1 }}>Medication Prescribed</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField size="small" label="Drug Name" sx={{ bgcolor: isDark ? alpha('#fff', 0.02) : 'white' }} />
                        <TextField size="small" label="Dosage" sx={{ bgcolor: isDark ? alpha('#fff', 0.02) : 'white' }} />
                    </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="contained" 
                        startIcon={<Save />} 
                        onClick={handleApplyDiagnosis}
                        sx={{ flex: 1, borderRadius: 3, py: 1.2, bgcolor: isDark ? 'primary.main' : '#1e293b' }}
                    >
                        Apply Diagnosis
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<Print />} 
                        onClick={() => toast.success('Prescription PDF Generated!')}
                        sx={{ borderRadius: 3, px: 3, borderColor: 'divider', color: 'text.primary' }}
                    >
                        Print PDF Prescription
                    </Button>
                </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Timeline & Info */}
        <Grid item xs={12} lg={5}>
           <Card sx={{ 
             borderRadius: 4, mb: 3, 
             boxShadow: theme.shadows[2],
             background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
             backdropFilter: isDark ? 'blur(10px)' : 'none',
             border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
           }}>
              <CardContent sx={{ p: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <Timeline sx={{ color: isDark ? 'primary.light' : '#0d9488' }} /> Clinical Timeline
                 </Typography>
                 <List sx={{ p: 0 }}>
                    {timelineEvents.map((ev, i) => (
                        <ListItem key={i} sx={{ px: 0, py: 2, alignItems: 'flex-start', borderBottom: i !== timelineEvents.length-1 ? `1px dashed ${theme.palette.divider}` : 'none' }}>
                            <ListItemAvatar sx={{ minWidth: 40, mt: 0.5 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ev.category === 'Urgent' ? 'error.main' : 'primary.main' }} />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={<Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{ev.event}</Typography>}
                                secondary={<Typography variant="caption" sx={{ color: 'text.secondary' }}>{ev.date} • {ev.category}</Typography>}
                            />
                        </ListItem>
                    ))}
                 </List>
              </CardContent>
           </Card>

           <Card sx={{ 
             borderRadius: 4, 
             boxShadow: theme.shadows[2],
             background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
             backdropFilter: isDark ? 'blur(10px)' : 'none',
             border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
           }}>
              <CardContent sx={{ p: 4 }}>
                 <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                    <Checklist sx={{ color: isDark ? 'primary.light' : '#0d9488' }} /> Patient Vitals
                 </Typography>
                 <Box sx={{ display: 'grid', gap: 3 }}>
                    <VitalRow label="Heart Rate" value="82 BPM" progress={65} color={theme.palette.success.main} />
                    <VitalRow label="Blood Pressure" value="145/90 mmHg" progress={85} color={theme.palette.error.main} />
                    <VitalRow label="Oxygen saturation" value="98%" progress={92} color={theme.palette.info.main} />
                 </Box>
              </CardContent>
           </Card>

           <Card sx={{ 
             mt: 3, borderRadius: 4, 
             boxShadow: isDark ? `0 8px 32px ${alpha('#0ea5e9', 0.15)}` : theme.shadows[4],
             background: isDark 
                ? `linear-gradient(135deg, ${alpha('#0ea5e9', 0.1)} 0%, ${alpha('#2563eb', 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha('#0d9488', 0.05)} 0%, ${alpha('#0f766e', 0.05)} 100%)`,
             border: `1px solid ${isDark ? alpha('#0ea5e9', 0.3) : alpha('#0d9488', 0.2)}`
           }}>
              <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AutoAwesome sx={{ color: isDark ? '#38bdf8' : '#0d9488' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>AI Clinical Insights</Typography>
                    </Box>
                    <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: isDark ? '#0ea5e9' : '#0d9488', color: '#fff', fontSize: 10, fontWeight: 900 }}>BETA</Box>
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.05) : '#fff', borderRadius: 3, borderLeft: `4px solid ${isDark ? '#38bdf8' : '#0d9488'}` }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#38bdf8' : '#0d9488', fontWeight: 900, display: 'block', mb: 0.5 }}>DIFFERENTIAL DIAGNOSIS</Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>Potential ACS variant detected. Review troponin-T trend from last admission.</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.05) : '#fff', borderRadius: 3, borderLeft: `4px solid ${isDark ? '#ef4444' : '#ef4444'}` }}>
                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 900, display: 'block', mb: 0.5 }}>DRUG INTERACTION ALERT</Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>Lisinopril might interact with current supplements. Verification required.</Typography>
                    </Box>
                  </Stack>
                  
                  <Button fullWidth size="small" startIcon={<Psychology />} sx={{ mt: 2, borderRadius: 2, textTransform: 'none', color: isDark ? '#38bdf8' : '#0d9488', fontWeight: 700 }}>
                    Ask AI Assistant for help
                  </Button>
              </CardContent>
           </Card>

           <Box sx={{ mt: 3, p: 2, display: 'flex', alignItems: 'center', gap: 2, opacity: 0.7 }}>
                <HelpOutline sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Need help? Press Ctrl+H for clinical shortcuts.</Typography>
           </Box>
        </Grid>
      </Grid>

      {/* Session Summary Modal */}
      <Dialog open={showSummary} onClose={() => navigate('/doctor/dashboard')} PaperProps={{ 
        sx: { 
          borderRadius: 4, p: 2, 
          background: isDark ? theme.palette.background.paper : '#fff',
          backgroundImage: 'none'
        } 
      }}>
        <DialogTitle sx={{ textAlign: 'center' }}>
            <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>Consultation Complete</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Your session with **Jane Smith** has been successfully concluded. 
                All notes and prescriptions have been saved to the patient history.
            </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
                variant="contained" 
                onClick={() => navigate('/doctor/dashboard')}
                sx={{ borderRadius: 3, px: 6, bgcolor: isDark ? 'primary.main' : '#1e293b' }}
            >
                Back to Dashboard
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function VitalRow({ label, value, progress, color }: any) {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>{value}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ 
                height: 8, borderRadius: 4, bgcolor: alpha(color, 0.1),
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 }
            }} />
        </Box>
    )
}
