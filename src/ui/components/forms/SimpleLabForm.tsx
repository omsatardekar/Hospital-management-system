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
import { Science, Person, PictureAsPdf } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { pdfGenerator } from './PDFGenerator'

interface SimpleLabFormProps {
  open: boolean
  labTest?: any | null
  onClose: () => void
  onSubmit: (labTest: any) => void
}

export function SimpleLabForm({
  open,
  labTest,
  onClose,
  onSubmit,
}: SimpleLabFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    requestedByDoctorId: '',
    testName: '',
    status: 'REQUESTED' as 'REQUESTED' | 'COLLECTED' | 'PROCESSING' | 'REPORTED',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    
    if (labTest) {
      setFormData({
        patientId: labTest.patientId || '',
        requestedByDoctorId: labTest.requestedByDoctorId || '',
        testName: labTest.testName || '',
        status: labTest.status || 'REQUESTED',
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, labTest])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient selection is required'
    if (!formData.requestedByDoctorId) newErrors.requestedByDoctorId = 'Doctor selection is required'
    if (!formData.testName.trim()) newErrors.testName = 'Test name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGeneratePDF = async () => {
    if (!validateForm()) return

    try {
      await pdfGenerator.generateLabReportPDF(formData, {
        filename: `lab-report-${formData.patientId}-${new Date().toISOString().split('T')[0]}.pdf`,
        format: 'a4',
        orientation: 'portrait',
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      requestedByDoctorId: formData.requestedByDoctorId,
      testName: formData.testName,
      status: formData.status,
      requestedAt: new Date().toISOString(),
      reportFiles: [],
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
  ]

  const doctorOptions = [
    { value: 'D-001', label: 'Dr. John Smith', description: 'Pathologist' },
    { value: 'D-002', label: 'Dr. Sarah Johnson', description: 'Lab Director' },
    { value: 'D-003', label: 'Dr. Michael Brown', description: 'Senior Pathologist' },
  ]

  const testTypeOptions = [
    { value: 'Complete Blood Count', label: 'Complete Blood Count', description: 'Blood cell analysis' },
    { value: 'Lipid Profile', label: 'Lipid Profile', description: 'Cholesterol and triglycerides' },
    { value: 'Liver Function Test', label: 'Liver Function Test', description: 'Liver enzymes and proteins' },
    { value: 'Kidney Function Test', label: 'Kidney Function Test', description: 'Kidney function markers' },
    { value: 'Glucose Test', label: 'Glucose Test', description: 'Blood sugar levels' },
    { value: 'Thyroid Function Test', label: 'Thyroid Function Test', description: 'Thyroid hormone levels' },
    { value: 'Urine Analysis', label: 'Urine Analysis', description: 'Urine composition and properties' },
    { value: 'X-Ray', label: 'X-Ray', description: 'Radiographic imaging' },
  ]

  const statusOptions = [
    { value: 'REQUESTED', label: 'Requested', description: 'Test ordered, results pending' },
    { value: 'COLLECTED', label: 'Collected', description: 'Sample collected for testing' },
    { value: 'PROCESSING', label: 'Processing', description: 'Test being processed' },
    { value: 'REPORTED', label: 'Reported', description: 'Results available' },
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
              <Science sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {labTest ? 'Edit Lab Test' : 'Order New Lab Test'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {labTest 
                  ? 'Update lab test details and status'
                  : 'Complete the form below to order a new lab test'
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
                    onClick={handleGeneratePDF}
                    variant="outlined"
                    size="large"
                    startIcon={<PictureAsPdf />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Generate PDF
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
                    {labTest ? 'Update Test' : 'Order Test'}
                  </Button>
                </Stack>
              }
            >
              {/* Test Information Section */}
              <FormSection
                title="Test Information"
                description="Lab test details and scheduling"
              >
                <FormFieldWrapper
                  label="Patient"
                  helperText="Select the patient for this test"
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
                  label="Requesting Doctor"
                  helperText="Doctor who ordered the test"
                  error={!!errors.requestedByDoctorId}
                  required
                >
                  <FormSelect
                    value={formData.requestedByDoctorId}
                    onChange={(e) => handleChange('requestedByDoctorId', e.target.value as string)}
                    options={doctorOptions}
                    error={!!errors.requestedByDoctorId}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Test Name"
                  helperText="Type of laboratory test"
                  error={!!errors.testName}
                  required
                >
                  <FormSelect
                    value={formData.testName}
                    onChange={(e) => handleChange('testName', e.target.value as string)}
                    options={testTypeOptions}
                    error={!!errors.testName}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Test Status"
                  helperText="Current test status"
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
