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
  Grid,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type Doctor, type DoctorStatus } from '../../features/doctors/doctorsSlice'

interface DoctorFormProps {
  open: boolean
  doctor?: Doctor | null
  onClose: () => void
  onSubmit: (doctor: Omit<Doctor, 'id' | 'todayAppointments' | 'rating'>) => void
}

export function DoctorForm({ open, doctor, onClose, onSubmit }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    status: 'ACTIVE' as DoctorStatus,
    availability: [] as { day: string; slots: string[] }[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        department: doctor.department,
        status: doctor.status,
        availability: doctor.availability,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        department: '',
        status: 'ACTIVE',
        availability: [
          { day: 'Monday', slots: ['09:00-10:00', '10:00-11:00', '11:00-12:00'] },
          { day: 'Wednesday', slots: ['14:00-15:00', '15:00-16:00', '16:00-17:00'] },
          { day: 'Friday', slots: ['09:00-10:00', '10:00-11:00', '11:00-12:00'] },
        ],
      })
    }
    setErrors({})
  }, [doctor, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.specialization) newErrors.specialization = 'Specialization is required'
    if (!formData.department) newErrors.department = 'Department is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      department: formData.department,
      status: formData.status,
      availability: formData.availability,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    }))
  }

  const addAvailabilitySlot = (dayIndex: number) => {
    const newAvailability = [...formData.availability]
    newAvailability[dayIndex].slots.push('17:00-18:00')
    setFormData(prev => ({ ...prev, availability: newAvailability }))
  }

  const removeAvailabilitySlot = (dayIndex: number, slotIndex: number) => {
    const newAvailability = [...formData.availability]
    newAvailability[dayIndex].slots.splice(slotIndex, 1)
    setFormData(prev => ({ ...prev, availability: newAvailability }))
  }

  const updateSlot = (dayIndex: number, slotIndex: number, value: string) => {
    const newAvailability = [...formData.availability]
    newAvailability[dayIndex].slots[slotIndex] = value
    setFormData(prev => ({ ...prev, availability: newAvailability }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {doctor ? 'Edit Doctor' : 'Add New Doctor'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={formData.specialization}
                    label="Specialization"
                    onChange={(e) => handleChange('specialization', e.target.value)}
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="General Medicine">General Medicine</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Surgery">Surgery</MenuItem>
                    <MenuItem value="Gynecology">Gynecology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    label="Department"
                    onChange={(e) => handleChange('department', e.target.value)}
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="General Medicine">General Medicine</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Surgery">Surgery</MenuItem>
                    <MenuItem value="Gynecology">Gynecology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 'ACTIVE'}
                      onChange={handleStatusToggle}
                      color="primary"
                    />
                  }
                  label="Active Status"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Availability Schedule
              </Typography>
              {formData.availability.map((day, dayIndex) => (
                <Box key={day.day} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    {day.day}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {day.slots.map((slot, slotIndex) => (
                      <Box key={slotIndex} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          label="Time Slot"
                          value={slot}
                          onChange={(e) => updateSlot(dayIndex, slotIndex, e.target.value)}
                          placeholder="e.g., 09:00-10:00"
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeAvailabilitySlot(dayIndex, slotIndex)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => addAvailabilitySlot(dayIndex)}
                    >
                      Add Time Slot
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {doctor ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
