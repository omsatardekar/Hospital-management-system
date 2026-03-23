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
import { Person, Phone, Email, MedicalServices, School, AccessTime } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'

interface DoctorCreationFormProps {
  open: boolean
  doctor?: any | null
  onClose: () => void
  onSubmit: (doctor: any) => void
}

export function DoctorCreationForm({
  open,
  doctor,
  onClose,
  onSubmit,
}: DoctorCreationFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new doctor data
  useEffect(() => {
    if (!open) return
    
    if (doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        department: doctor.department,
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, doctor])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Doctor name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Valid phone number is required'
    }
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required'
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
      status: 'ACTIVE',
      rating: 0,
      todayAppointments: 0,
      availability: [
        {
          day: 'Monday',
          slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        }
      ]
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const specializationOptions = [
    { value: 'Cardiologist', label: 'Cardiologist', description: 'Heart and cardiovascular diseases' },
    { value: 'Neurologist', label: 'Neurologist', description: 'Brain and nervous system disorders' },
    { value: 'Orthopedic', label: 'Orthopedic Surgeon', description: 'Bones, joints, and ligaments' },
    { value: 'Pediatrician', label: 'Pediatrician', description: 'Children healthcare and diseases' },
    { value: 'General Physician', label: 'General Physician', description: 'General medical care' },
    { value: 'Surgeon', label: 'Surgeon', description: 'Surgical procedures and operations' },
    { value: 'Gynecologist', label: 'Gynecologist', description: 'Women reproductive health' },
    { value: 'Dermatologist', label: 'Dermatologist', description: 'Skin diseases and conditions' },
    { value: 'Psychiatrist', label: 'Psychiatrist', description: 'Mental health and disorders' },
    { value: 'ENT Specialist', label: 'ENT Specialist', description: 'Ear, nose, and throat conditions' },
  ]

  const departmentOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'General Medicine', label: 'General Medicine' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Gynecology', label: 'Gynecology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Psychiatry', label: 'Psychiatry' },
  ]

  const availabilityOptions = [
    { value: 'AVAILABLE', label: 'Available', description: 'Currently available for appointments' },
    { value: 'BUSY', label: 'Busy', description: 'Currently with patients' },
    { value: 'OFF_DUTY', label: 'Off Duty', description: 'Not available' },
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
              <MedicalServices sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {doctor ? 'Edit Doctor Information' : 'Register New Doctor'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {doctor 
                  ? 'Update doctor details and professional information'
                  : 'Complete the form below to register a new doctor'
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
                    {doctor ? 'Update Doctor' : 'Register Doctor'}
                  </Button>
                </Stack>
              }
            >
              {/* Personal Information Section */}
              <FormSection
                title="Personal Information"
                description="Basic contact and personal details"
              >
                <FormFieldWrapper
                  label="Full Name"
                  helperText="Doctor's full professional name"
                  error={!!errors.name}
                  required
                >
                  <FormInput
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Dr. John Smith"
                    startIcon={<Person />}
                    error={!!errors.name}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Email Address"
                  helperText="Professional email for communication"
                  error={!!errors.email}
                  required
                >
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="doctor@hospital.com"
                    startIcon={<Email />}
                    error={!!errors.email}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Phone Number"
                  helperText="Contact number for appointments"
                  error={!!errors.phone}
                  required
                >
                  <FormInput
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    startIcon={<Phone />}
                    error={!!errors.phone}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Department"
                  helperText="Primary department of practice"
                  error={!!errors.department}
                  required
                >
                  <FormSelect
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value as string)}
                    options={departmentOptions}
                    error={!!errors.department}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Professional Information Section */}
              <FormSection
                title="Professional Information"
                description="Medical qualifications and specialization"
              >
                <FormFieldWrapper
                  label="Specialization"
                  helperText="Primary area of medical expertise"
                  error={!!errors.specialization}
                  required
                >
                  <FormSelect
                    value={formData.specialization}
                    onChange={(e) => handleChange('specialization', e.target.value as string)}
                    options={specializationOptions}
                    error={!!errors.specialization}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Qualification"
                  helperText="Medical degrees and certifications"
                  error={!!errors.qualification}
                  required
                >
                  <FormInput
                    value={formData.qualification}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                    placeholder="MBBS, MD, MS, etc."
                    startIcon={<School />}
                    error={!!errors.qualification}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Years of Experience"
                  helperText="Total years of medical practice"
                  error={!!errors.experience}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    placeholder="10"
                    startIcon={<AccessTime />}
                    error={!!errors.experience}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Consultation Fee"
                  helperText="Standard consultation fee in USD"
                  error={!!errors.consultationFee}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => handleChange('consultationFee', e.target.value)}
                    placeholder="150"
                    startIcon={<Phone />}
                    error={!!errors.consultationFee}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Current Availability"
                  helperText="Doctor's current availability status"
                >
                  <FormSelect
                    value={formData.availability}
                    onChange={(e) => handleChange('availability', e.target.value as string)}
                    options={availabilityOptions}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Working Schedule"
                  helperText="Regular working hours and days"
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.schedule}
                    onChange={(e) => handleChange('schedule', e.target.value)}
                    placeholder="Mon-Fri: 9:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM"
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
