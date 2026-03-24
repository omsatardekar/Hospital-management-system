import { Box, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff, Google } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../../app/hooks'
import { login } from '../../features/auth/authSlice'
import type { Role } from '../../features/auth/rbac'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Role-based credential detection
    let role: Role = 'ADMIN'
    let redirectUrl = '/dashboard'

    if (formData.email === 'doctor@hospital.com') {
      role = 'DOCTOR'
      redirectUrl = '/doctor/dashboard'
    } else if (formData.email === 'pharmacist@hospital.com') {
      role = 'PHARMACIST'
      redirectUrl = '/pharmacist/dashboard'
    } else if (formData.email === 'admin@hospital.com') {
      role = 'ADMIN'
      redirectUrl = '/dashboard'
    }

    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
        role: role
      })).unwrap()

      if (result.token) {
        toast.success(`Access granted: ${role} Profile`)
        navigate(redirectUrl)
      }
    } catch (err) {
      toast.error('Clinical authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // For demo keeping it to default admin redirect or as per logic
    toast.error('Google SSO is currently locked by Administrator')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage: `url(/src/assets/High-Quality,%20Affordable%20Videos.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
          zIndex: 1,
        },
      }}
    >
      {/* Animated Background Elements */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 2 }}>
        <motion.div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '10%',
            left: '10%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            bottom: '15%',
            right: '15%',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            maxWidth: 450,
          }}
        >
          {/* Glassmorphic Card */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                padding: 4,
                width: '100%',
              }}
            >
              {/* Logo/Title */}
              <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      HMS
                    </Typography>
                  </Box>
                </motion.div>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    marginBottom: 1,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.95rem',
                  }}
                >
                  Sign in to access your healthcare dashboard
                </Typography>
              </Box>

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    sx={{
                      marginBottom: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        color: 'white',
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&.Mui-focused': {
                          color: 'white',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      marginBottom: 3,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        color: 'white',
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.8)',
                        '&.Mui-focused': {
                          color: 'white',
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                <Box sx={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    px: 2,
                    fontSize: '0.85rem',
                  }}
                >
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.2)' }} />
              </Box>

              {/* Google Login Button */}
              <motion.div variants={itemVariants}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  startIcon={<Google />}
                  sx={{
                    py: 1.5,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Continue with Google
                </Button>
              </motion.div>

              {/* Demo Credentials */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      display: 'block',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                    }}
                  >
                    Demo: admin / doctor / pharmacist @hospital.com | pass: admin123
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  )
}

