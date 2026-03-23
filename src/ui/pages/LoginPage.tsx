import { Box, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Visibility, VisibilityOff, Google } from '@mui/icons-material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import toast from 'react-hot-toast'
import { useAppDispatch } from '../../app/hooks'
import { login } from '../../features/auth/authSlice'
import type { Role } from '../../features/auth/rbac'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: 'doctor@hms.com',
    password: 'doctor123',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Determine role based on email for demo purposes
    let role: Role = 'DOCTOR'
    if (formData.email.includes('admin')) role = 'ADMIN'
    else if (formData.email.includes('ops')) role = 'OPS_MANAGER'
    else if (formData.email.includes('finance')) role = 'FINANCE'
    else if (formData.email.includes('pharmacy')) role = 'PHARMACY'
    else if (formData.email.includes('lab')) role = 'LAB'

    try {
      const res = await dispatch(login({ email: formData.email, password: formData.password, role }))
      if (login.fulfilled.match(res)) {
         toast.success(`Welcome back, ${role.toLowerCase()}!`)
         // Route to doctor dashboard if DOCTOR, else general dashboard
         if (role === 'DOCTOR') {
           navigate('/doctor/dashboard')
         } else {
           navigate('/dashboard')
         }
      } else {
         toast.error('Invalid credentials')
      }
    } catch (error) {
       toast.error('Login failed')
    } finally {
       setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      toast.success('Google login successful!')
      navigate('/doctor/dashboard')
      setIsLoading(false)
    }, 1500)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 2 }}>
        <motion.div
          style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', top: '10%', left: '10%' }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(13, 148, 136, 0.08)', bottom: '15%', right: '15%' }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 3, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%', maxWidth: 450 }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: 5, width: '100%' }}>
              <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '3px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)' }}>
                    <LocalHospitalIcon sx={{ color: 'white', fontSize: 40 }} />
                  </Box>
                </motion.div>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, marginBottom: 1, letterSpacing: '-0.02em' }}>HMS Clinical</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>Secure Portal for Healthcare Professionals</Typography>
              </Box>

              <form onSubmit={handleLogin}>
                <motion.div variants={itemVariants}>
                  <TextField fullWidth label="Email Address" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required sx={{ marginBottom: 2.5, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 3, color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' } }} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} required InputProps={{ endAdornment: ( <InputAdornment position="end"> <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}> {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment> ) }} sx={{ marginBottom: 4, '& .MuiOutlinedInput-root': { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 3, color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&.Mui-focused fieldset': { borderColor: '#0ea5e9' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' } }} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{ py: 1.8, background: 'linear-gradient(90deg, #0ea5e9 0%, #0d9488 100%)', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)', color: 'white', fontWeight: 700, fontSize: '1rem', borderRadius: 3, textTransform: 'none', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(14, 165, 233, 0.5)' } }}> {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'} </Button>
                </motion.div>
              </form>

              <Box sx={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
                <Box sx={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', px: 2, fontSize: '0.8rem', fontWeight: 600 }}>TRUSTED ACCESS</Typography>
                <Box sx={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
              </Box>

              <motion.div variants={itemVariants}>
                <Button fullWidth variant="outlined" onClick={handleGoogleLogin} disabled={isLoading} startIcon={<Google />} sx={{ py: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: 3, textTransform: 'none', '&:hover': { background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.3)' } }}> Continue with Google </Button>
              </motion.div>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                 <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}> Demo Access: doctor@hms.com / doctor123 </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  )
}
