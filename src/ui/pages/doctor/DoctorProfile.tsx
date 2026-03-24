import { useState } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, TextField, 
  Chip, Divider, Stack, useTheme, alpha,
  FormControl, InputLabel, Select, MenuItem, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction,
  Tooltip, InputAdornment, Paper
} from '@mui/material'
import { 
  Edit, AttachMoney, MedicalInformation, 
  Email, Phone, Close, PictureAsPdf, 
  CheckCircle, EmojiEvents, History,
  LinkedIn, Twitter, Language as GlobeIcon, Delete, 
  DriveFileRenameOutline, TrendingUp, People, Star, 
  AssignmentTurnedIn, Public, PhotoCamera, CloudUpload,
  Business, Description, VerifiedUser, AddCircleOutline
} from '@mui/icons-material'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

const departmentsData = {
  'Cardiology': ['Heart Surgery', 'Clinical Cardiology', 'Interventional Cardiology'],
  'Neurology': ['Neurosurgery', 'Stroke Specialist', 'Epilepsy Specialist'],
  'Pediatrics': ['Neonatology', 'Pediatric Surgery', 'General Pediatrics'],
  'Orthopedics': ['Joint Replacement', 'Spine Surgery', 'Sports Medicine'],
}

interface Certificate {
  id: number;
  name: string;
  type: string;
  date: string;
}

interface ProfileData {
  name: string;
  degrees: string;
  department: string;
  specialization: string;
  experience: string;
  licenseNumber: string;
  email: string;
  phone: string;
  location: string;
  about: string;
  fees: {
    adult: number;
    senior: number;
    child: number;
    followUp: number;
  };
  workHistory: { hospital: string; role: string; period: string }[];
  awards: { title: string; organization: string; year: string }[];
  languages: string[];
  certificates: Certificate[];
  photoUrl: string | null;
  stats: {
      patients: string;
      patientsData: number[];
      rating: string;
      ratingData: number[];
      successRate: string;
      successData: number[];
      consultations: string;
      consultData: number[];
  }
}

export default function DoctorProfile() {
  const theme = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('doctor_premium_profile_v9')
    return saved ? JSON.parse(saved) : {
      name: 'Dr. John Williams',
      degrees: 'MBBS, MD (Cardiology), FACS',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      experience: '15+ Years',
      licenseNumber: 'MD-7743-XX91',
      email: 'john.williams@hospital.com',
      phone: '+1 (555) 234-5678',
      location: 'New York Health Center',
      about: 'Dedicated cardiologist with over 15 years of experience in managing complex heart conditions. Passionate about patient-centric care and robotic-assisted surgeries. Ranked among Top 10 Surgeons nationwide for minimally invasive cardiac procedures and valve replacements. Committed to lifelong learning and providing the highest standard of evidence-based medical treatments.',
      fees: { adult: 1500, senior: 1200, child: 1000, followUp: 800 },
      stats: { 
          patients: '1,240', 
          patientsData: [4, 7, 5, 9, 8, 12, 10],
          rating: '4.9/5', 
          ratingData: [1, 2, 1, 3, 2, 2, 2],
          successRate: '98%', 
          successData: [2, 4, 3, 5, 4, 5, 5],
          consultations: '25,000+',
          consultData: [3, 5, 4, 6, 5, 4, 4]
      },
      workHistory: [
        { hospital: 'Mayo Clinic', role: 'Senior Interventional Cardiologist', period: '2015 - Present' },
        { hospital: 'Cleveland Clinic', role: 'Cardiology Resident', period: '2009 - 2014' }
      ],
      awards: [
        { title: 'Excellence in Heart Surgery', organization: 'American Heart Association', year: '2022' },
        { title: 'Top Surgeons of New York', organization: 'Health Magazine', year: '2020' }
      ],
      languages: ['English', 'Spanish', 'French'],
      certificates: [
        { id: 1, name: 'Medical_License_2026.pdf', type: 'License', date: '2026' },
        { id: 2, name: 'Robotic_Surgery_Certification.jpg', type: 'Certification', date: '2024' }
      ],
      photoUrl: null
    }
  })

  const [editForm, setEditForm] = useState(profile)
  const [certToRename, setCertToRename] = useState<number | null>(null)
  const [newName, setNewName] = useState('')

  const handleEditChange = (e: any) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFeeChange = (e: any) => {
    const { name, value } = e.target
    setEditForm(prev => ({ 
        ...prev, 
        fees: { ...prev.fees, [name]: parseInt(value) || 0 } 
    }))
  }

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    localStorage.setItem('doctor_premium_profile_v9', JSON.stringify(editForm))
    toast.success('Professional Profile updated successfully!')
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm({ ...editForm, photoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const dashboardCardStyle = {
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    background: theme.palette.background.paper,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'transparent', minHeight: '100vh', width: '100%' }}>
      
      {/* 1. FULL WIDTH IDENTITY HEADER */}
      <Card 
        sx={{ 
          p: { xs: 4, md: 5 }, 
          mb: 4, 
          borderRadius: 4, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #0e7490 100%)`,
          color: 'white',
          boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.4)}`,
          position: 'relative', overflow: 'hidden', width: '100%'
        }}
      >
          <Box sx={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ position: 'absolute', bottom: -50, right: 200, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={profile.photoUrl || ''} 
                    sx={{ width: 140, height: 140, border: '6px solid rgba(255,255,255,0.25)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', bgcolor: 'white', color: 'primary.main', fontWeight: 900, fontSize: 48 }}
                  >
                      {profile.name.replace('Dr. ', '').charAt(0)}
                  </Avatar>
                  <Tooltip title="Medical Council Verified">
                    <Box sx={{ position: 'absolute', bottom: 5, right: 5, bgcolor: '#10b981', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                        <CheckCircle sx={{ fontSize: 18 }} />
                    </Box>
                  </Tooltip>
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>{profile.name}</Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center">
                      <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 700 }}>{profile.department} Specialist</Typography>
                      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 20, display: { xs: 'none', md: 'block' } }} />
                      <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 500 }}>{profile.degrees}</Typography>
                      <Chip label={profile.experience} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, ml: { md: 1 } }} />
                  </Stack>
                  <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}><LinkedIn fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}><Twitter fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}><Public fontSize="small" /></IconButton>
                  </Stack>
              </Box>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                  <Button 
                    variant="contained" 
                    startIcon={<Edit />} 
                    onClick={() => { setEditForm(profile); setIsEditing(true); }}
                    sx={{ 
                        bgcolor: 'white', color: 'primary.main', fontWeight: 900, px: 4, py: 1.5, borderRadius: 2.5, 
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' }, transition: 'all 0.2s',
                        fontSize: '1rem'
                    }}
                  >
                      Edit Global Profile
                  </Button>
              </Box>
          </Stack>
      </Card>

      {/* 3. DASHBOARD STAT CARDS (4 Columns) - Fixing size structure for MUI v6 Grid compatibility */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatWidget title="Total Patients" value={profile.stats.patients} icon={<People />} color="#0891b2" data={profile.stats.patientsData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatWidget title="Doctor Rating" value={profile.stats.rating} icon={<Star />} color="#f59e0b" data={profile.stats.ratingData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatWidget title="Success Rate" value={profile.stats.successRate} icon={<TrendingUp />} color="#10b981" data={profile.stats.successData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatWidget title="Consultations" value={profile.stats.consultations} icon={<AssignmentTurnedIn />} color="#6366f1" data={profile.stats.consultData} />
        </Grid>
      </Grid>

      {/* 4. CLINICAL DATA (2x2 Balanced Grid) */}
      <Grid container spacing={3} sx={{ width: '100%' }}>
          
        {/* Row 1, Col 1: Bio */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={dashboardCardStyle}>
                <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
                        <MedicalInformation sx={{ color: 'primary.main', fontSize: 28 }} /> Profile Biography
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 2, mb: 'auto', fontSize: '1.05rem' }}>
                        {profile.about}
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ mb: 3, borderStyle: 'dotted' }} />
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {profile.languages.map((l, i) => <Chip key={i} label={l} size="small" sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }} />)}
                            </Stack>
                            <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dotted' }} />
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <History sx={{ color: 'text.disabled' }} />
                                <Typography variant="body2" fontWeight={800} color="text.secondary">{profile.experience} Practice Experience</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Card>
        </Grid>

        {/* Row 1, Col 2: Fee Structure */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={dashboardCardStyle}>
                <Box sx={{ p: 4, pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
                        <AttachMoney sx={{ color: '#10b981', fontSize: 28 }} /> Consultation Rate Matrix
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Standard clinical network rates and pricing schemas mapped uniformly across all network facilities.</Typography>
                </Box>
                <Box sx={{ p: 4, pt: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Grid container spacing={3}>
                        {[
                            { label: 'Standard Adult Care', value: profile.fees.adult },
                            { label: 'Senior Citizen Care', value: profile.fees.senior },
                            { label: 'Pediatric Specialist', value: profile.fees.child },
                            { label: 'Clinical Follow-up', value: profile.fees.followUp }
                        ].map((fee, idx) => (
                            <Grid size={{ xs: 6 }} key={idx}>
                                <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center', transition: 'all 0.2s', '&:hover': { bgcolor: alpha('#10b981', 0.05), borderColor: alpha('#10b981', 0.2) } }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', display: 'block', mb: 1 }}>{fee.label.toUpperCase()}</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{fee.value}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Card>
        </Grid>

        {/* Row 2, Col 1: Compliance */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={dashboardCardStyle}>
                <Box sx={{ p: 4, pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
                        <Description sx={{ color: 'error.main', fontSize: 28 }} /> Clinical Compliance & Network
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Verified medical licenses and legally mandated contact schemas for the overarching medical body operations.</Typography>
                </Box>
                <Box sx={{ p: 4, pt: 2, flex: 1 }}>
                    <Stack spacing={4}>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ flex: 1, p: 3, borderRadius: 3, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', display: 'block', mb: 0.5 }}>STATE MEDICAL LICENSE ID</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.dark', fontFamily: 'monospace' }}>{profile.licenseNumber}</Typography>
                            </Box>
                            <Box sx={{ flex: 1, p: 3, borderRadius: 3, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', display: 'block', mb: 0.5 }}>OFFICE CONTACT ROUTING</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.dark' }}>{profile.phone.split(' ')[1] || profile.phone}</Typography>
                            </Box>
                        </Box>
                        
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, color: 'text.primary' }}>VERIFIED CERTIFICATES & ATTACHMENTS</Typography>
                            <Stack spacing={2}>
                                {profile.certificates.map(cert => (
                                    <Box key={cert.id} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, borderRadius: 2, bgcolor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <PictureAsPdf sx={{ color: 'error.main', fontSize: 24 }} />
                                        <Typography variant="body2" fontWeight={800} sx={{ flex: 1 }}>{cert.name}</Typography>
                                        <Chip label="Verified" size="small" color="success" sx={{ fontWeight: 900, fontSize: 10, px: 1, borderRadius: 1 }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Card>
        </Grid>

        {/* Row 2, Col 2: Work History & Awards */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={dashboardCardStyle}>
                <Box sx={{ p: 4, pb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
                        <Business sx={{ color: 'secondary.main', fontSize: 28 }} /> Career Path & Honors
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Historical clinical appointments, previous employment routing, and prestigious recognized awards.</Typography>
                </Box>
                <Box sx={{ p: 4, pt: 2, flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', mb: 3, display: 'block', letterSpacing: '0.05em' }}>CLINICAL WORK EXPERIENCE</Typography>
                    <Stack spacing={3} sx={{ mb: 4 }}>
                        {profile.workHistory.map((work, idx) => (
                            <Box key={idx} sx={{ position: 'relative', pl: 3, '&:before': { content: '""', position: 'absolute', left: 0, top: 4, bottom: 4, width: 4, bgcolor: 'primary.main', borderRadius: 4 } }}>
                                <Typography variant="subtitle1" fontWeight={900} sx={{ lineHeight: 1.2, mb: 0.5, color: 'text.primary' }}>{work.role}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>{work.hospital} <span style={{ opacity: 0.3, margin: '0 8px' }}>|</span> {work.period}</Typography>
                            </Box>
                        ))}
                    </Stack>
                    <Divider sx={{ my: 4, borderStyle: 'dotted' }} />
                    <Typography variant="caption" sx={{ fontWeight: 900, color: 'warning.main', mb: 3, display: 'block', letterSpacing: '0.05em' }}>PRESTIGIOUS RECOGNITION</Typography>
                    <Stack spacing={3}>
                        {profile.awards.map((award, idx) => (
                            <Box key={idx} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', borderRadius: 2.5 }}><EmojiEvents sx={{ fontSize: 24 }} /></Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight={900} color="text.primary">{award.title}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>{award.organization} • {award.year}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Card>
        </Grid>
      </Grid>

      {/* --- ELITE MEDICAL FORM MODAL --- */}
      <Dialog 
        open={isEditing} 
        onClose={() => setIsEditing(false)} 
        maxWidth="lg" 
        fullWidth 
        scroll="paper"
        PaperProps={{ 
            sx: { 
                borderRadius: 4, 
                overflow: 'hidden', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                bgcolor: '#f4f7f9', // Professional off-white background
            } 
        }}
       >
          <Box sx={{ bgcolor: 'white', p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', zIndex: 10, position: 'relative' }}>
              <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.01em', mb: 0.5 }}>Update Complete Credentials</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Ensure your professional details are strictly accurate across the hospital network.</Typography>
              </Box>
              <IconButton onClick={() => setIsEditing(false)} sx={{ bgcolor: '#f1f5f9', color: 'text.primary', '&:hover': { bgcolor: '#e2e8f0' } }}><Close /></IconButton>
          </Box>
          <DialogContent sx={{ p: { xs: 3, md: 5 }, pb: 8 }}>
              
              <Grid container spacing={4}>
                  {/* LEFT SIDE: Identity & Documents */}
                  <Grid size={{ xs: 12, lg: 4 }}>
                      <Stack spacing={4}>
                          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                              <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}><VerifiedUser /> Primary Snapshot</Typography>
                              <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto', mb: 3 }}>
                                  <Avatar src={editForm.photoUrl || ''} sx={{ width: '100%', height: '100%', border: '5px solid #f1f5f9', bgcolor: 'primary.light', fontSize: 40, fontWeight: 900, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                                      {editForm.name.replace('Dr. ', '').charAt(0)}
                                  </Avatar>
                                  <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'primary.main', color: 'white', border: '3px solid white', width: 40, height: 40, '&:hover': { bgcolor: 'primary.dark' } }}>
                                      <PhotoCamera fontSize="small" /><input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                                  </IconButton>
                              </Box>
                              <TextField fullWidth label="Full Legal Name" name="name" value={editForm.name} onChange={handleEditChange} variant="outlined" sx={{ mb: 2 }} />
                              <TextField fullWidth label="Contact Number" name="phone" value={editForm.phone} onChange={handleEditChange} variant="outlined" sx={{ mb: 2 }} />
                              <TextField fullWidth label="Contact Email" name="email" value={editForm.email} onChange={handleEditChange} variant="outlined" />
                          </Paper>

                          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                              <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}><Description /> Verified Attachments</Typography>
                              <TextField fullWidth label="State License ID" name="licenseNumber" value={editForm.licenseNumber} onChange={handleEditChange} sx={{ mb: 3 }} />
                              
                              <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block', mb: 2 }}>DOCUMENT LIBRARY</Typography>
                              <List disablePadding>
                                  {editForm.certificates.map(cert => (
                                      <ListItem key={cert.id} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                                          <ListItemIcon sx={{ minWidth: 40 }}><PictureAsPdf color="error" /></ListItemIcon>
                                          {certToRename === cert.id ? (
                                              <TextField size="small" autoFocus fullWidth value={newName} onChange={e => setNewName(e.target.value)} onBlur={() => { setEditForm({...editForm, certificates: editForm.certificates.map(c => c.id === cert.id ? {...c, name: newName} : c)}); setCertToRename(null); }} />
                                          ) : (
                                              <ListItemText primary={cert.name} primaryTypographyProps={{ fontWeight: 800, fontSize: 13 }} />
                                          )}
                                          <ListItemSecondaryAction>
                                              <IconButton size="small" sx={{ mr: 1, bgcolor: 'white', border: '1px solid #eee' }} onClick={() => { setCertToRename(cert.id); setNewName(cert.name); }}><DriveFileRenameOutline sx={{ fontSize: 16, color: 'text.secondary' }} /></IconButton>
                                              <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid #eee' }} onClick={() => setEditForm({...editForm, certificates: editForm.certificates.filter(c => c.id !== cert.id)})}><Delete sx={{ fontSize: 16, color: 'error.main' }} /></IconButton>
                                          </ListItemSecondaryAction>
                                      </ListItem>
                                  ))}
                              </List>
                              <Button fullWidth variant="outlined" startIcon={<AddCircleOutline />} sx={{ mt: 1, fontWeight: 800, py: 1.5, borderRadius: 2.5, borderStyle: 'dashed', borderWidth: 2, color: 'primary.main', borderColor: 'primary.main' }}>Attach Certificate</Button>
                          </Paper>
                      </Stack>
                  </Grid>

                  {/* RIGHT SIDE: Clinical & Financials */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                      <Stack spacing={4}>
                          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                              <Typography variant="h6" fontWeight={900} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}><MedicalInformation color="primary" sx={{ fontSize: 28 }} /> Clinical Specializations</Typography>
                              <Grid container spacing={3}>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                      <FormControl fullWidth>
                                          <InputLabel>Primary Department</InputLabel>
                                          <Select name="department" value={editForm.department} label="Primary Department" onChange={handleEditChange}>
                                              {Object.keys(departmentsData).map(k => <MenuItem key={k} value={k} sx={{ fontWeight: 600 }}>{k}</MenuItem>)}
                                          </Select>
                                      </FormControl>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Functional Speciality" name="specialization" value={editForm.specialization} onChange={handleEditChange} /></Grid>
                                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Academic Degrees & Fellowships" name="degrees" value={editForm.degrees} onChange={handleEditChange} helperText="e.g. MBBS, MD, FACS - Used for public profile generation" /></Grid>
                                  <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={6} label="Professional Medical Biography" name="about" value={editForm.about} onChange={handleEditChange} placeholder="Write a professional summary detailing expertise and methodology..." sx={{ '& .MuiInputBase-root': { lineHeight: 1.8 } }} /></Grid>
                              </Grid>
                          </Paper>

                          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                              <Typography variant="h6" fontWeight={900} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}><AttachMoney sx={{ color: '#10b981', fontSize: 28 }} /> Consultation Fee Schema Configurator</Typography>
                              <Grid container spacing={3}>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField 
                                          fullWidth label="Standard Adult Care Setting" type="number" 
                                          value={editForm.fees.adult} onChange={handleFeeChange} name="adult" 
                                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                      />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField 
                                          fullWidth label="Senior Citizen Setting" type="number" 
                                          value={editForm.fees.senior} onChange={handleFeeChange} name="senior" 
                                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                      />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField 
                                          fullWidth label="Pediatric (Child) Setting" type="number" 
                                          value={editForm.fees.child} onChange={handleFeeChange} name="child" 
                                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                      />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                      <TextField 
                                          fullWidth label="Clinical Follow-up Setting" type="number" 
                                          value={editForm.fees.followUp} onChange={handleFeeChange} name="followUp" 
                                          InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                      />
                                  </Grid>
                              </Grid>
                          </Paper>
                      </Stack>
                  </Grid>
              </Grid>

          </DialogContent>
          <DialogActions sx={{ p: { xs: 3, md: 4 }, bgcolor: 'white', borderTop: '1px solid #e2e8f0', gap: 2, zIndex: 10, position: 'relative' }}>
              <Button onClick={() => setIsEditing(false)} sx={{ fontWeight: 800, color: 'text.secondary', px: 4, py: 1.5 }}>Discard Changes</Button>
              <Button variant="contained" onClick={handleSave} startIcon={<CheckCircle />} sx={{ borderRadius: 2.5, px: 6, py: 1.5, fontWeight: 900, boxShadow: '0 8px 20px rgba(8, 145, 178, 0.3)', fontSize: '1rem' }}>Publish & Update Credentials</Button>
          </DialogActions>
      </Dialog>
    </Box>
  )
}

function StatWidget({ title, value, icon, color, data }: any) {
  const theme = useTheme()
  return (
    <Card sx={{ 
      borderRadius: 4, 
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
      background: theme.palette.background.paper,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      overflow: 'hidden', height: '100%',
      display: 'flex', flexDirection: 'column'
    }}>
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: '0.05em', display: 'block', mb: 1 }}>{title.toUpperCase()}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>{value}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 44, height: 44, borderRadius: 2.5 }}>{icon}</Avatar>
        </Box>
        <Box sx={{ flex: 1, minHeight: 60, mt: 'auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.map((v: number) => ({ value: v }))}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor={color} stopOpacity={0.2}/><stop offset="90%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fillOpacity={1} fill={`url(#gradient-${title.replace(/\s+/g, '-')})`} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
