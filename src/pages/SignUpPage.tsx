import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Box, TextField, Button, Typography, Container, 
  Paper, Avatar, InputAdornment, useTheme, alpha
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { 
  LocalHospital, BadgeOutlined, EmailOutlined, 
  LockOutlined, WorkOutline,
  PersonOutline, AssignmentIndOutlined
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const SignUpPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Mandatory fields missing.', {
        style: { 
          borderRadius: '12px', 
          background: isDark ? theme.palette.error.main : '#ef4444', 
          color: '#fff' 
        }
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      toast.success('Professional account pending verification.', {
        style: { 
          borderRadius: '12px', 
          background: isDark ? theme.palette.background.paper : '#1e293b', 
          color: '#fff',
          border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
        }
      })
      navigate('/login')
      setIsLoading(false)
    }, 1800)
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', display: 'flex', 
      background: isDark 
        ? `radial-gradient(circle at 90% 80%, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.default} 100%)`
        : 'radial-gradient(circle at 90% 80%, #f1f5f9 0%, #e2e8f0 100%)',
      position: 'relative', overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      {/* Abstract Background blobs */}
      <Box sx={{ 
        position: 'absolute', top: -50, left: -50, width: 450, height: 450, 
        borderRadius: '50%', background: isDark ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, transparent 100%)` : 'linear-gradient(135deg, #0d948811 0%, #0d948833 100%)',
        filter: 'blur(100px)', zIndex: 0, opacity: isDark ? 0.1 : 0.4
      }} />
      <Box sx={{ 
        position: 'absolute', bottom: -100, right: 100, width: 350, height: 350, 
        borderRadius: '50%', background: isDark ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, transparent 100%)` : 'linear-gradient(135deg, #0f766e11 0%, #0f766e22 100%)',
        filter: 'blur(80px)', zIndex: 0, opacity: isDark ? 0.05 : 0.3
      }} />

      <Box sx={{ 
        width: { xs: '0%', md: '40%' },
        background: isDark ? `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.4)} 0%, ${alpha(theme.palette.common.black, 0.1)} 100%)` : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', p: 8, color: 'white',
        zIndex: 1, position: 'relative', overflow: 'hidden',
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        borderRight: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
      }}>
        {/* Pattern overlay */}
        <Box sx={{ 
          position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.1, 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 10 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}` }}>
              <LocalHospital sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, color: '#fff' }}>HOSPITAL PANEL</Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, letterSpacing: -1.5, lineHeight: 1.2, color: '#fff' }}>
            Register to <br /> Get Started.
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 300 }}>
            Create an account to manage your patients and hospital schedule efficiently.
          </Typography>
        </motion.div>
      </Box>

      <Container maxWidth="md" sx={{ 
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', 
        zIndex: 1, py: 6, px: { xs: 2, md: 4 } 
      }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 640 }}>
          <Paper elevation={0} sx={{ 
            p: { xs: 4, md: 6 }, borderRadius: 8, 
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.1) : 'rgba(255, 255, 255, 0.4)'}`,
            boxShadow: isDark ? theme.shadows[20] : '0 25px 50px -12px rgba(0,0,0,0.05)'
           }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: -1 }}>Sign Up</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Enter your details to create an account.</Typography>
            </Box>

            <form onSubmit={handleSignUp}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="name" label="Full Name" fullWidth variant="outlined" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="email" label="Email" fullWidth variant="outlined" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="specialization" label="Specialization" fullWidth variant="outlined" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><WorkOutline sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="licenseNumber" label="License Number" fullWidth variant="outlined" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><AssignmentIndOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="password" label="Password" fullWidth variant="outlined" type="password" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    name="confirmPassword" label="Confirm Password" fullWidth variant="outlined" type="password" 
                    onChange={handleChange}
                    InputProps={{ 
                        startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: isDark ? alpha('#fff', 0.03) : 'transparent' } 
                    }} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth variant="contained" type="submit" disabled={isLoading}
                    sx={{ 
                        mt: 2, py: 1.8, borderRadius: 4, fontWeight: 800, fontSize: 16,
                        background: isDark ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                        boxShadow: isDark ? `0 10px 15px -3px ${alpha(theme.palette.primary.main, 0.3)}` : '0 10px 15px -3px rgba(13, 148, 136, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: isDark ? `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.4)}` : '0 20px 25px -5px rgba(13, 148, 136, 0.4)' }
                    }}
                  >
                    {isLoading ? 'Loading...' : 'Sign Up'}
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Typography variant="body2" sx={{ mt: 5, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }}>
              Already have an account? <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 800, textDecoration: 'none' }}>Login</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}

export default SignUpPage
