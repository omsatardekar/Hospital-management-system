import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type SystemUser } from '../../features/users/usersSlice'
import type { Role } from '../../features/auth/rbac'

interface UserFormProps {
  open: boolean
  user?: SystemUser | null
  onClose: () => void
  onSubmit: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void
}

export function UserForm({ open, user, onClose, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN' as Role,
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'ADMIN',
        status: 'ACTIVE',
      })
    }
    setErrors({})
  }, [user, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getRoleDescription = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'Full system access, can manage users and settings'
      case 'DOCTOR':
        return 'Can view patients, create prescriptions, and manage appointments'
      case 'OPS_MANAGER':
        return 'Operations manager with patient and doctor management access'
      case 'FINANCE':
        return 'Finance manager with billing and reports access'
      case 'PHARMACY':
        return 'Pharmacy staff with medicine inventory access'
      case 'LAB':
        return 'Lab technician with test management access'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user ? 'Edit User' : 'Add New User'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
              required
            />

            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <MenuItem value="ADMIN">Administrator</MenuItem>
                <MenuItem value="OPS_MANAGER">Operations Manager</MenuItem>
                <MenuItem value="DOCTOR">Doctor</MenuItem>
                <MenuItem value="FINANCE">Finance</MenuItem>
                <MenuItem value="PHARMACY">Pharmacy</MenuItem>
                <MenuItem value="LAB">Lab Technician</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Role Permissions: {getRoleDescription(formData.role)}
              </Typography>
            </Box>

            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {user ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
