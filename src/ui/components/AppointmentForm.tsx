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
} from '@mui/material'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type Appointment, type AppointmentStatus } from '../../features/appointments/appointmentsSlice'
import { useAppSelector } from '../../app/hooks'

interface AppointmentFormProps {
  open: boolean
  appointment?: Appointment | null
  onClose: () => void
  onSubmit: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void
}

export function AppointmentForm({ open, appointment, onClose, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    startAt: '',
    endAt: '',
    status: 'SCHEDULED' as AppointmentStatus,
    reason: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const patients = useAppSelector((state) => state.patients.items)
  const doctors = useAppSelector((state) => state.doctors.items)

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        department: appointment.department,
        startAt: new Date(appointment.startAt).toISOString().slice(0, 16),
        endAt: new Date(appointment.endAt).toISOString().slice(0, 16),
        status: appointment.status,
        reason: appointment.reason,
      })
    } else {
      const defaultStart = new Date()
      defaultStart.setHours(10, 0, 0, 0)
      const defaultEnd = new Date(defaultStart)
      defaultEnd.setHours(defaultEnd.getHours() + 1)
      
      setFormData({
        patientId: '',
        doctorId: '',
        department: '',
        startAt: defaultStart.toISOString().slice(0, 16),
        endAt: defaultEnd.toISOString().slice(0, 16),
        status: 'SCHEDULED',
        reason: '',
      })
    }
    setErrors({})
  }, [appointment, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient is required'
    if (!formData.doctorId) newErrors.doctorId = 'Doctor is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    if (formData.startAt >= formData.endAt) newErrors.time = 'End time must be after start time'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      department: formData.department,
      startAt: new Date(formData.startAt).toISOString(),
      endAt: new Date(formData.endAt).toISOString(),
      status: formData.status,
      reason: formData.reason,
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId)
    setFormData(prev => ({
      ...prev,
      doctorId,
      department: doctor?.department || '',
    }))
    if (errors.doctorId) {
      setErrors(prev => ({ ...prev, doctorId: '' }))
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    value={formData.patientId}
                    label="Patient"
                    onChange={(e) => handleChange('patientId', e.target.value)}
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={formData.doctorId}
                    label="Doctor"
                    onChange={(e) => handleDoctorChange(e.target.value)}
                  >
                    {doctors
                      .filter(d => d.status === 'ACTIVE')
                      .map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </MenuItem>
                      ))}
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
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => handleChange('startAt', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => handleChange('endAt', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit"
                  multiline
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  error={!!errors.reason}
                  helperText={errors.reason}
                  required
                />
              </Grid>
            </Grid>
            
            {errors.time && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                {errors.time}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {appointment ? 'Update Appointment' : 'Book Appointment'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
