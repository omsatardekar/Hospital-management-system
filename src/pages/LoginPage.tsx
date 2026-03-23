import React, { useState } from 'react'
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom'
import { 
  Box, TextField, Button, Typography, IconButton, 
  InputAdornment, Container, Paper, Avatar, Stack, useTheme, alpha
} from '@mui/material'
import { 
  Visibility, VisibilityOff, LocalHospital, 
  LockOutlined, EmailOutlined, TerminalOutlined
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
=======
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, IconButton, InputAdornment, Select, MenuItem } from '@mui/material'
import { Visibility, VisibilityOff, Google, Facebook, Login as LoginIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
>>>>>>> origin/rishi-admin
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import toast from 'react-hot-toast'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
<<<<<<< HEAD
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [showPassword, setShowPassword] = useState(false)
=======
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState('en')
>>>>>>> origin/rishi-admin
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

<<<<<<< HEAD
  const handleTogglePassword = () => setShowPassword(!showPassword)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    
    // Automatic Role Detection Mock
    const role = email.toLowerCase().includes('pharmacy') ? 'PHARMACY' : 'DOCTOR'

    setTimeout(() => {
      dispatch(login({ email, password, role }))
      toast.success(`Welcome back, ${email.split('@')[0]}`, {
        style: { 
          borderRadius: '12px', 
          background: isDark ? theme.palette.background.paper : '#1e293b', 
          color: '#fff',
          border: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
        }
      })
      navigate(role === 'PHARMACY' ? '/pharmacy/dashboard' : '/doctor/dashboard', { replace: true })
      setIsLoading(false)
    }, 1200)
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', display: 'flex', 
      background: isDark 
        ? `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.default} 100%)`
        : 'radial-gradient(circle at 10% 20%, #f1f5f9 0%, #e2e8f0 100%)',
      position: 'relative', overflow: 'hidden',
      transition: 'background 0.3s ease'
    }}>
      {/* Decorative background elements */}
      <Box sx={{ 
        position: 'absolute', top: -100, right: -100, width: 400, height: 400, 
        borderRadius: '50%', background: isDark ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, transparent 100%)` : 'linear-gradient(135deg, #0d9488 0%, #0d948822 100%)',
        filter: 'blur(80px)', zIndex: 0, opacity: isDark ? 0.15 : 0.4
      }} />
      <Box sx={{ 
        position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, 
        borderRadius: '50%', background: isDark ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, transparent 100%)` : 'linear-gradient(135deg, #0891b2 0%, #0891b222 100%)',
        filter: 'blur(60px)', zIndex: 0, opacity: isDark ? 0.1 : 0.3
      }} />

      <Box sx={{ 
        width: { xs: '0%', md: '50%' },
        background: isDark ? `linear-gradient(135deg, ${alpha(theme.palette.common.black, 0.4)} 0%, ${alpha(theme.palette.common.black, 0.1)} 100%)` : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', justifyContent: 'center', p: 8, color: 'white',
        zIndex: 1, position: 'relative',
        backdropFilter: isDark ? 'blur(10px)' : 'none',
        borderRight: isDark ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
      }}>
        {/* Animated Grid Pattern */}
        <Box sx={{ 
          position: 'absolute', inset: 0, opacity: isDark ? 0.03 : 0.1, 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px' 
        }} />

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}` }}>
              <LocalHospital />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5, color: '#fff' }}>HOSPITAL PANEL</Typography>
          </Box>

          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.1, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manage Your <br /> Clinic Easily.
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, mb: 6, maxWidth: 500 }}>
            Sign in to access your dashboard and manage patients, schedules, and more.
=======
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const targetEmail = email || 'admin@hospital.com'
    const targetPassword = password || 'admin123'

    setIsLoading(true)
    
    try {
      // Dispatch the async thunk and wait for it to complete
      const resultAction = await dispatch(login({
        email: targetEmail,
        password: targetPassword,
        role: 'ADMIN',
      }))

      if (login.fulfilled.match(resultAction)) {
        toast.success('Welcome back!')
        navigate('/', { replace: true })
      } else {
        const errorMsg = resultAction.error?.message || 'Invalid credentials'
        toast.error(errorMsg)
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFreeLogin = () => {
    setEmail('admin@hospital.com')
    setPassword('admin123')
    handleLogin()
  }

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} login coming soon!`, { icon: '🔜' })
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', overflow: 'hidden' }}>
      {/* Left Section - Purple Background with Medical Theme */}
      <Box
        sx={{
          width: { xs: '0%', md: '50%' },
          background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: 4,
          color: 'white'
        }}
      >
        {/* Medical Icon at Top Left */}
        <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Box sx={{ 
              width: 48, 
              height: 48, 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ fontSize: 24 }}>🏥</Box>
            </Box>
          </motion.div>
        </Box>

        {/* Medical Illustration */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ 
            width: 280, 
            height: 280, 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
            position: 'relative'
          }}>
            {/* Stethoscope SVG */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 40C90 40 80 50 80 60C80 70 90 80 100 80C110 80 120 70 120 60C120 50 110 40 100 40Z" fill="white" fillOpacity="0.8"/>
              <path d="M80 60C80 60 60 80 60 120C60 160 80 180 100 180C120 180 140 160 140 120C140 80 120 60 120 60" stroke="white" strokeWidth="8" strokeLinecap="round"/>
              <circle cx="60" cy="120" r="15" fill="white" fillOpacity="0.8"/>
              <circle cx="140" cy="120" r="15" fill="white" fillOpacity="0.8"/>
            </svg>
            {/* Floating medical icons */}
            <Box sx={{ position: 'absolute', top: -20, right: 20, fontSize: 32 }}>💉</Box>
            <Box sx={{ position: 'absolute', bottom: -10, left: 20, fontSize: 28 }}>💊</Box>
          </Box>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
            MedFlow Hospital
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, textAlign: 'center', opacity: 0.9 }}>
            Advanced Healthcare Management System
>>>>>>> origin/rishi-admin
          </Typography>
        </motion.div>
      </Box>

<<<<<<< HEAD
      <Container maxWidth="sm" sx={{ 
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', 
        zIndex: 1, p: { xs: 2, md: 4 } 
      }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Paper elevation={0} sx={{ 
            p: { xs: 4, md: 6 }, borderRadius: 8, 
            background: isDark ? alpha(theme.palette.background.paper, 0.8) : 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.1) : 'rgba(255, 255, 255, 0.4)'}`,
            boxShadow: isDark ? theme.shadows[20] : '0 25px 50px -12px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: -1 }}>Login</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Enter your email and password to login.</Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField 
                  fullWidth label="Email" variant="outlined" type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    sx: { borderRadius: 4, bgcolor: isDark ? alpha('#fff', 0.03) : 'rgba(255,255,255,0.5)' } 
                  }}
                />

                <TextField 
                  fullWidth label="Password" variant="outlined" 
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 4, bgcolor: isDark ? alpha('#fff', 0.03) : 'rgba(255,255,255,0.5)' }
                  }}
                />

                <Button 
                  fullWidth variant="contained" type="submit" disabled={isLoading}
                  sx={{ 
                    py: 1.8, borderRadius: 4, fontWeight: 800, fontSize: 16,
                    background: isDark ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                    boxShadow: isDark ? `0 10px 15px -3px ${alpha(theme.palette.primary.main, 0.3)}` : '0 10px 15px -3px rgba(15, 23, 42, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: isDark ? `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.4)}` : '0 20px 25px -5px rgba(15, 23, 42, 0.4)' }
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TerminalOutlined sx={{ animation: 'spin 1.5s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                        Loading...
                      </motion.div>
                    ) : (
                      <motion.span key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Login</motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary', fontWeight: 500 }}>
              No account? <Link to="/signup" style={{ color: theme.palette.primary.main, fontWeight: 800, textDecoration: 'none' }}>Sign Up</Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
=======
      {/* Right Section - White Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 4,
          position: 'relative'
        }}
      >
        {/* Language Selector */}
        <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="en">English (US)</MenuItem>
            <MenuItem value="hi">हिंदी</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </Box>

        {/* Login Form Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Card sx={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
            <CardContent sx={{ padding: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1, textAlign: 'center', color: 'text.primary' }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 4, textAlign: 'center', color: 'text.secondary' }}>
                Sign in to access your dashboard
              </Typography>

              {/* Social Login Buttons */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={() => handleSocialLogin('Google')}
                sx={{ 
                  marginBottom: 2, 
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.primary',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' }
                }}
              >
                Sign in with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => handleSocialLogin('Facebook')}
                sx={{ 
                  marginBottom: 2, 
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.primary',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' }
                }}
              >
                Sign in with Facebook
              </Button>

              {/* OR Separator */}
              <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                <Box sx={{ flex: 1, height: 1, backgroundColor: 'divider' }} />
                <Typography sx={{ margin: '0 16px', color: 'text.secondary', fontSize: 14 }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: 1, backgroundColor: 'divider' }} />
              </Box>

              {/* Form Fields */}
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ 
                    marginBottom: 2,
                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                  }}
                  placeholder="admin@hospital.com"
                />

                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    marginBottom: 3,
                    '& .MuiOutlinedInput-root': { borderRadius: 3 }
                  }}
                  placeholder="••••••••"
                />

                {/* Sign In Button */}
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{ 
                    background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                    padding: '14px',
                    textTransform: 'none',
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: '0 4px 14px rgba(8, 145, 178, 0.4)',
                    marginBottom: 2,
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #0e7490 0%, #155e75 100%)',
                      boxShadow: '0 6px 20px rgba(8, 145, 178, 0.5)',
                    },
                    '&:disabled': {
                      background: 'action.disabledBackground',
                    }
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleFreeLogin}
                  disabled={isLoading}
                  startIcon={<LoginIcon />}
                  sx={{ 
                    padding: '12px',
                    textTransform: 'none',
                    fontSize: 15,
                    fontWeight: 500,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Free Login (Demo Access)
                </Button>
              </form>

              {/* Demo Credentials Hint */}
              <Box sx={{ 
                marginTop: 3, 
                padding: 2, 
                backgroundColor: 'action.hover',
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider',
              }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
                  <strong>Demo:</strong> Any email & password will work
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
>>>>>>> origin/rishi-admin
    </Box>
  )
}

export default LoginPage
