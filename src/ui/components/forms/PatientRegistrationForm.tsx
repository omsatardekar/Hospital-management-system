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
import { Person, Phone, Email, CalendarToday } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'

interface PatientRegistrationFormProps {
  open: boolean
  patient?: any | null
  onClose: () => void
  onSubmit: (patient: any) => void
}

export function PatientRegistrationForm({
  open,
  patient,
  onClose,
  onSubmit,
}: PatientRegistrationFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    name: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    age: '',
    phone: '',
    email: '',
    bloodGroup: '',
    status: 'ACTIVE' as 'ACTIVE' | 'DISCHARGED' | 'IN_TREATMENT',
    department: '',
    assignedDoctorId: '',
    emergencyContact: '',
    address: '',
    medicalHistory: '',
    allergies: '',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new patient data
  useEffect(() => {
    if (!open) return
    
    if (patient) {
      setFormData({
        name: patient.name,
        gender: patient.gender,
        age: patient.age.toString(),
        phone: patient.phone,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        status: patient.status,
        department: patient.department,
        assignedDoctorId: patient.assignedDoctorId || '',
        emergencyContact: '',
        address: '',
        medicalHistory: '',
        allergies: '',
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, patient])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Patient name is required'
    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      newErrors.age = 'Valid age is required (0-150)'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Valid phone number is required'
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age),
      phone: formData.phone,
      email: formData.email,
      bloodGroup: formData.bloodGroup,
      status: formData.status,
      lastVisit: new Date().toISOString(),
      department: formData.department,
      medicalTimeline: [],
      reports: [],
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ]

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ]

  const departmentOptions = [
    { value: 'Cardiology', label: 'Cardiology', description: 'Heart and cardiovascular care' },
    { value: 'Neurology', label: 'Neurology', description: 'Brain and nervous system' },
    { value: 'Orthopedics', label: 'Orthopedics', description: 'Bones and joints' },
    { value: 'Pediatrics', label: 'Pediatrics', description: 'Children healthcare' },
    { value: 'General Medicine', label: 'General Medicine', description: 'General healthcare' },
    { value: 'Emergency', label: 'Emergency', description: 'Emergency care' },
    { value: 'Surgery', label: 'Surgery', description: 'Surgical procedures' },
    { value: 'Gynecology', label: 'Gynecology', description: 'Women healthcare' },
  ]

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active', description: 'Currently under care' },
    { value: 'IN_TREATMENT', label: 'In Treatment', description: 'Undergoing treatment' },
    { value: 'DISCHARGED', label: 'Discharged', description: 'Care completed' },
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
              <Person sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {patient ? 'Edit Patient Information' : 'Register New Patient'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {patient 
                  ? 'Update patient details and medical information'
                  : 'Complete the form below to register a new patient'
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
                    {patient ? 'Update Patient' : 'Register Patient'}
                  </Button>
                </Stack>
              }
            >
              {/* Personal Information Section */}
              <FormSection
                title="Personal Information"
                description="Basic demographic and contact information"
              >
                <FormFieldWrapper
                  label="Full Name"
                  helperText="Enter patient's full legal name"
                  error={!!errors.name}
                  required
                >
                  <FormInput
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="John Doe"
                    startIcon={<Person />}
                    error={!!errors.name}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Gender"
                  helperText="Select patient's gender"
                  error={!!errors.gender}
                  required
                >
                  <FormSelect
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value as string)}
                    options={genderOptions}
                    error={!!errors.gender}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Age"
                  helperText="Patient's age in years"
                  error={!!errors.age}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="25"
                    startIcon={<CalendarToday />}
                    error={!!errors.age}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Phone Number"
                  helperText="Primary contact number"
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
                  label="Email Address"
                  helperText="For appointment notifications and updates"
                  error={!!errors.email}
                  required
                >
                  <FormInput
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="patient@example.com"
                    startIcon={<Email />}
                    error={!!errors.email}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Emergency Contact"
                  helperText="Emergency contact person and number"
                  error={!!errors.emergencyContact}
                  required
                >
                  <FormInput
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="Jane Doe - +1 (555) 987-6543"
                    startIcon={<Phone />}
                    error={!!errors.emergencyContact}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Medical Information Section */}
              <FormSection
                title="Medical Information"
                description="Medical history and current health status"
              >
                <FormFieldWrapper
                  label="Blood Group"
                  helperText="Patient's blood type"
                  error={!!errors.bloodGroup}
                  required
                >
                  <FormSelect
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value as string)}
                    options={bloodGroupOptions}
                    error={!!errors.bloodGroup}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Department"
                  helperText="Primary department for treatment"
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

                <FormFieldWrapper
                  label="Current Status"
                  helperText="Patient's current treatment status"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Medical History"
                  helperText="Relevant medical conditions and history"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.medicalHistory}
                    onChange={(e) => handleChange('medicalHistory', e.target.value)}
                    placeholder="Describe any relevant medical conditions, past surgeries, or chronic illnesses..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Known Allergies"
                  helperText="Any known allergies or adverse reactions"
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.allergies}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="List any known allergies to medications, food, or other substances..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Address"
                  helperText="Current residential address"
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="123 Main St, City, State, ZIP Code"
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
