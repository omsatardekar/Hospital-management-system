import React, { useState } from 'react'
import { 
  Box, Card, CardContent, Typography, Avatar, Button, TextField, 
  Chip, Divider, Paper, Stack, useTheme, alpha,
  FormControl, InputLabel, Select, MenuItem, Badge
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { 
  Edit, Save, Info, WorkHistory, AttachMoney
} from '@mui/icons-material'
import toast from 'react-hot-toast'

export default function DoctorPortfolio() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [isEditing, setIsEditing] = useState(false)
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('doctor_profile')
    return saved ? JSON.parse(saved) : {
      name: 'Dr. John Williams',
      department: 'Cardiology',
      specialization: 'Heart Surgery',
      type: 'Surgeon',
      experience: '15+ Years',
      fees: '₹1200',
      about: 'Dedicated cardiologist with over 15 years of experience in managing complex heart conditions. Passionate about patient-centric care.'
    }
  })

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    setIsEditing(false)
    localStorage.setItem('doctor_profile', JSON.stringify(profile))
    toast.success('Portfolio updated successfully!')
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: 'background.default', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Doctor Portfolio</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Personal information and professional clinical details.</Typography>
        </Box>
        <Button 
          variant={isEditing ? "contained" : "outlined"} 
          startIcon={isEditing ? <Save /> : <Edit />} 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          sx={{ borderRadius: 3, px: 4, py: 1.2 }}
          color={isEditing ? "success" : "primary"}
        >
          {isEditing ? "Save Portfolio" : "Edit Profile"}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            borderRadius: 4, overflow: 'hidden', 
            boxShadow: theme.shadows[2],
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
          }}>
             <Box sx={{ height: 120, background: isDark ? 'linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%)' : 'linear-gradient(135deg, #0d9488 0%, #0f172a 100%)' }} />
             <Box sx={{ px: 3, pb: 4, mt: -6, textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 120, height: 120, mx: 'auto', 
                  border: `6px solid ${isDark ? theme.palette.background.paper : '#fff'}`, 
                  bgcolor: 'primary.main', color: 'white',
                  fontSize: 40, boxShadow: theme.shadows[4] 
                }}>JW</Avatar>
                
                {isEditing ? (
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <TextField size="small" name="name" label="Full Name" value={profile.name} onChange={handleChange} fullWidth />
                    <FormControl fullWidth size="small">
                      <InputLabel>Department</InputLabel>
                      <Select name="department" value={profile.department} label="Department" onChange={handleChange}>
                         <MenuItem value="Cardiology">Cardiology</MenuItem>
                         <MenuItem value="Dentist">Dentist</MenuItem>
                         <MenuItem value="Neurology">Neurology</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>{profile.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{profile.department}</Typography>
                    <Chip label={profile.type} size="small" color="primary" sx={{ mt: 1, fontWeight: 700 }} />
                  </>
                )}
             </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: theme.shadows[2],
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            padding: 4
          }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge color="primary" sx={{ mr: 1 }} /> Professional Summary
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>SPECIALIZATION</Typography>
                        {isEditing ? <TextField size="small" fullWidth name="specialization" value={profile.specialization} onChange={handleChange} sx={{ mt: 1 }} /> : <Typography variant="body1" sx={{ fontWeight: 800 }}>{profile.specialization}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>DOCTOR TYPE</Typography>
                        {isEditing ? (
                          <Select fullWidth size="small" name="type" value={profile.type} onChange={handleChange} sx={{ mt: 1 }}>
                             <MenuItem value="General">General</MenuItem>
                             <MenuItem value="Specialist">Specialist</MenuItem>
                             <MenuItem value="Surgeon">Surgeon</MenuItem>
                          </Select>
                        ) : <Typography variant="body1" sx={{ fontWeight: 800 }}>{profile.type}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <WorkHistory fontSize="small" color="primary" />
                           <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>EXPERIENCE</Typography>
                        </Box>
                        {isEditing ? <TextField size="small" fullWidth name="experience" value={profile.experience} onChange={handleChange} sx={{ mt: 1 }} /> : <Typography variant="body1" sx={{ fontWeight: 800 }}>{profile.experience}</Typography>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? alpha('#fff', 0.02) : '#f8fafc', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <AttachMoney fontSize="small" color="primary" />
                           <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>CONSULTATION FEES</Typography>
                        </Box>
                        {isEditing ? <TextField size="small" fullWidth name="fees" value={profile.fees} onChange={handleChange} sx={{ mt: 1 }} /> : <Typography variant="body1" sx={{ fontWeight: 800 }}>{profile.fees}</Typography>}
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color="primary" /> About Section
            </Typography>
            {isEditing ? (
                <TextField fullWidth multiline rows={4} name="about" value={profile.about} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{profile.about}</Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
