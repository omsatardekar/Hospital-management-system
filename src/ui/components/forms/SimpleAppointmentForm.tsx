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
} from '@mui/material'
import { motion } from 'framer-motion'
import { CalendarToday, MedicalServices, AccessTime } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'

interface SimpleAppointmentFormProps {
  open: boolean
  appointment?: any | null
  onClose: () => void
  onSubmit: (appointment: any) => void
}

export function SimpleAppointmentForm({
  open,
  appointment,
  onClose,
  onSubmit,
}: SimpleAppointmentFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    doctorId: '',
    department: '',
    startAt: new Date(),
    endAt: new Date(),
    reason: '',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        department: appointment.department || '',
        startAt: appointment.startAt ? new Date(appointment.startAt) : new Date(),
        endAt: appointment.endAt ? new Date(appointment.endAt) : new Date(),
        reason: appointment.reason || '',
      })
    } else {
      setFormData(getInitialFormData())
    }
  }, [appointment, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.patientId.trim()) newErrors.patientId = 'Patient is required'
    if (!formData.doctorId.trim()) newErrors.doctorId = 'Doctor is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSubmit(formData)
  }

  const departmentOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'General', label: 'General Medicine' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Radiology', label: 'Radiology' },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
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
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            py: 3,
            px: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <BaseForm
                title="Appointment Details"
                subtitle="Enter patient and appointment information"
                actions={
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      onClick={onClose}
                      variant="outlined"
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
                      type="submit"
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
                <FormSection
                  title="Patient Information"
                  description="Enter patient and doctor details"
                >
                  <FormFieldWrapper
                    label="Patient ID"
                    helperText="Enter the patient ID"
                    error={!!errors.patientId}
                  >
                    <FormInput
                      value={formData.patientId}
                      onChange={(e) => handleChange('patientId', e.target.value)}
                      placeholder="e.g., PAT-001"
                      error={!!errors.patientId}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Doctor ID"
                    helperText="Enter the doctor ID"
                    error={!!errors.doctorId}
                  >
                    <FormInput
                      value={formData.doctorId}
                      onChange={(e) => handleChange('doctorId', e.target.value)}
                      placeholder="e.g., DOC-001"
                      error={!!errors.doctorId}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Department"
                    helperText="Select the department"
                    error={!!errors.department}
                  >
                    <FormSelect
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value as string)}
                      options={departmentOptions}
                      error={!!errors.department}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Appointment Date"
                    helperText="Select the date for the appointment"
                    error={!!errors.startAt}
                  >
                    <FormDatePicker
                      value={formData.startAt}
                      onChange={(date) => handleChange('startAt', date)}
                      error={!!errors.startAt}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="Reason for Visit"
                    helperText="Describe the reason for this appointment"
                    error={!!errors.reason}
                  >
                    <FormInput
                      multiline
                      rows={3}
                      value={formData.reason}
                      onChange={(e) => handleChange('reason', e.target.value)}
                      placeholder="Describe symptoms, pain, discomfort, or reason for appointment..."
                      error={!!errors.reason}
                    />
                  </FormFieldWrapper>
                </FormSection>
              </BaseForm>
            </form>
          </Box>
        </DialogContent>
      </motion.div>
    </Dialog>
  )
}
