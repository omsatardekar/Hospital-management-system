import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Stack,
  Typography,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Person, Phone, Email, CalendarToday, MedicalServices, AccessTime } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'

interface AppointmentBookingFormProps {
  open: boolean
  appointment?: any | null
  onClose: () => void
  onSubmit: (appointment: any) => void
}

export function AppointmentBookingForm({
  open,
  appointment,
  onClose,
  onSubmit,
}: AppointmentBookingFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    doctorId: '',
    date: new Date(),
    time: '',
    type: 'CONSULTATION' as 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURGERY',
    status: 'SCHEDULED' as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
    notes: '',
    symptoms: '',
    priority: 'NORMAL' as 'NORMAL' | 'HIGH' | 'LOW',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new appointment data
  useEffect(() => {
    if (!open) return
    
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: new Date(appointment.date),
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || '',
        symptoms: appointment.symptoms || '',
        priority: appointment.priority || 'NORMAL',
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, appointment])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient selection is required'
    if (!formData.doctorId) newErrors.doctorId = 'Doctor selection is required'
    if (!formData.date) newErrors.date = 'Appointment date is required'
    if (!formData.time) newErrors.time = 'Appointment time is required'
    if (!formData.type) newErrors.type = 'Appointment type is required'
    if (!formData.priority) newErrors.priority = 'Priority level is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      date: formData.date.toISOString(),
      time: formData.time,
      type: formData.type,
      status: formData.status,
      notes: formData.notes,
      symptoms: formData.symptoms,
      priority: formData.priority,
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const patientOptions = [
    { value: 'P-001', label: 'John Doe', description: '35 years, Male' },
    { value: 'P-002', label: 'Jane Smith', description: '28 years, Female' },
    { value: 'P-003', label: 'Robert Johnson', description: '45 years, Male' },
    { value: 'P-004', label: 'Emily Davis', description: '32 years, Female' },
  ]

  const doctorOptions = [
    { value: 'D-001', label: 'Dr. John Smith', description: 'Cardiologist' },
    { value: 'D-002', label: 'Dr. Sarah Johnson', description: 'Neurologist' },
    { value: 'D-003', label: 'Dr. Michael Brown', description: 'Orthopedic Surgeon' },
    { value: 'D-004', label: 'Dr. Emily Wilson', description: 'Pediatrician' },
  ]

  const appointmentTypeOptions = [
    { value: 'CONSULTATION', label: 'General Consultation', description: 'Regular medical consultation' },
    { value: 'FOLLOW_UP', label: 'Follow-up Visit', description: 'Follow-up on previous treatment' },
    { value: 'EMERGENCY', label: 'Emergency', description: 'Urgent medical attention' },
    { value: 'SURGERY', label: 'Surgery', description: 'Surgical procedure' },
  ]

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled', description: 'Appointment is scheduled' },
    { value: 'COMPLETED', label: 'Completed', description: 'Appointment completed' },
    { value: 'CANCELLED', label: 'Cancelled', description: 'Appointment cancelled' },
    { value: 'NO_SHOW', label: 'No Show', description: 'Patient did not attend' },
  ]

  const priorityOptions = [
    { value: 'LOW', label: 'Low', description: 'Non-urgent appointment' },
    { value: 'NORMAL', label: 'Normal', description: 'Regular priority' },
    { value: 'HIGH', label: 'High', description: 'High priority appointment' },
  ]

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle
          sx={{
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarToday sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {appointment ? 'Edit Appointment' : 'Book New Appointment'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {appointment 
                  ? 'Update appointment details and schedule'
                  : 'Complete the form below to book a new appointment'
                }
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <BaseForm
              title=""
              subtitle=""
              maxWidth="lg"
              actions={
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={onClose}
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                    }}
                  >
                    {appointment ? 'Update Appointment' : 'Book Appointment'}
                  </Button>
                </Stack>
              }
            >
              {/* Appointment Details Section */}
              <FormSection
                title="Appointment Details"
                description="Basic information about the appointment"
              >
                <FormFieldWrapper
                  label="Patient"
                  helperText="Select the patient for this appointment"
                  error={!!errors.patientId}
                  required
                >
                  <FormSelect
                    value={formData.patientId}
                    onChange={(e) => handleChange('patientId', e.target.value as string)}
                    options={patientOptions}
                    error={!!errors.patientId}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Doctor"
                  helperText="Select the doctor for this appointment"
                  error={!!errors.doctorId}
                  required
                >
                  <FormSelect
                    value={formData.doctorId}
                    onChange={(e) => handleChange('doctorId', e.target.value as string)}
                    options={doctorOptions}
                    error={!!errors.doctorId}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Appointment Date"
                  helperText="Select the date for the appointment"
                  error={!!errors.date}
                  required
                >
                  <FormDatePicker
                    value={formData.date}
                    onChange={(date) => handleChange('date', date)}
                    error={!!errors.date}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Appointment Time"
                  helperText="Select the preferred time slot"
                  error={!!errors.time}
                  required
                >
                  <FormSelect
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value as string)}
                    options={timeSlots.map(time => ({ value: time, label: time }))}
                    error={!!errors.time}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Appointment Type"
                  helperText="Select the type of appointment"
                  error={!!errors.type}
                  required
                >
                  <FormSelect
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value as string)}
                    options={appointmentTypeOptions}
                    error={!!errors.type}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Priority Level"
                  helperText="Select the priority of this appointment"
                  error={!!errors.priority}
                  required
                >
                  <FormSelect
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as string)}
                    options={priorityOptions}
                    error={!!errors.priority}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Medical Information Section */}
              <FormSection
                title="Medical Information"
                description="Symptoms and additional notes"
              >
                <FormFieldWrapper
                  label="Symptoms"
                  helperText="Describe the patient's symptoms or reason for visit"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => handleChange('symptoms', e.target.value)}
                    placeholder="Describe symptoms, pain, discomfort, or reason for appointment..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Additional Notes"
                  helperText="Any additional information or special requirements"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any additional notes, special requirements, or preferences..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Status"
                  helperText="Current status of the appointment"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>
              </FormSection>
            </BaseForm>
          </Box>
        </DialogContent>
      </motion.div>
    </Dialog>
  )
}
