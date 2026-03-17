import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, IconButton, InputAdornment, Select, MenuItem } from '@mui/material'
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch } from '../app/hooks'
import { login } from '../features/auth/authSlice'
import toast from 'react-hot-toast'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [language, setLanguage] = useState('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Mock login - accept any email/password for demo
      dispatch(login({
        email: email,
        password: password,
        role: 'ADMIN',
      }))
      
      toast.success('Welcome back!')
      navigate('/', { replace: true })
      setIsLoading(false)
    }, 1000)
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
          </Typography>
        </motion.div>
      </Box>

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
    </Box>
  )
}

export default LoginPage
