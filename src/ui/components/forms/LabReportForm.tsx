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
import { Science, Person, CalendarToday, Description } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'
import { FormFileUpload } from './FormFileUpload'
import { pdfGenerator } from './PDFGenerator'

interface LabReportFormProps {
  open: boolean
  labTest?: any | null
  onClose: () => void
  onSubmit: (labTest: any) => void
}

export function LabReportForm({
  open,
  labTest,
  onClose,
  onSubmit,
}: LabReportFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    testType: '',
    testDate: new Date(),
    doctorId: '',
    doctorName: '',
    reportDate: new Date(),
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    priority: 'NORMAL' as 'NORMAL' | 'HIGH' | 'LOW' | 'URGENT',
    tests: [
      {
        name: 'Complete Blood Count',
        result: '4.5',
        normalRange: '4.5-11.0',
        unit: 'million/μL',
        status: 'Normal' as 'Normal' | 'Abnormal' | 'Critical',
      }
    ],
    remarks: '',
    recommendations: '',
    technician: '',
    pathologist: '',
    attachments: [] as any[],
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new lab test data
  useEffect(() => {
    if (!open) return
    
    if (labTest) {
      setFormData({
        patientId: labTest.patientId,
        patientName: labTest.patientName,
        patientAge: labTest.patientAge,
        patientGender: labTest.patientGender,
        testType: labTest.testType,
        testDate: new Date(labTest.testDate),
        doctorId: labTest.doctorId,
        doctorName: labTest.doctorName,
        reportDate: new Date(labTest.reportDate),
        status: labTest.status,
        priority: labTest.priority,
        tests: labTest.tests,
        remarks: labTest.remarks,
        recommendations: labTest.recommendations,
        technician: labTest.technician,
        pathologist: labTest.pathologist,
        attachments: labTest.attachments || [],
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, labTest])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient selection is required'
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required'
    if (!formData.patientAge) newErrors.patientAge = 'Patient age is required'
    if (!formData.patientGender) newErrors.patientGender = 'Patient gender is required'
    if (!formData.testType.trim()) newErrors.testType = 'Test type is required'
    if (!formData.testDate) newErrors.testDate = 'Test date is required'
    if (!formData.doctorId) newErrors.doctorId = 'Doctor selection is required'
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required'
    if (!formData.technician.trim()) newErrors.technician = 'Lab technician name is required'
    if (!formData.pathologist.trim()) newErrors.pathologist = 'Pathologist name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      testType: formData.testType,
      testDate: formData.testDate.toISOString(),
      doctorId: formData.doctorId,
      doctorName: formData.doctorName,
      reportDate: formData.reportDate.toISOString(),
      status: formData.status,
      priority: formData.priority,
      tests: formData.tests,
      remarks: formData.remarks,
      recommendations: formData.recommendations,
      technician: formData.technician,
      pathologist: formData.pathologist,
      attachments: formData.attachments,
    })
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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTestChange = (index: number, field: string, value: any) => {
    const updatedTests = [...formData.tests]
    updatedTests[index] = { ...updatedTests[index], [field]: value }
    setFormData(prev => ({ ...prev, tests: updatedTests }))
  }

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, { 
        name: '', 
        result: '', 
        normalRange: '', 
        unit: '', 
        status: 'Normal' as 'Normal' | 'Abnormal' | 'Critical' 
      }],
    }))
  }

  const removeTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index),
    }))
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
    { value: 'CBC', label: 'Complete Blood Count', description: 'Blood cell analysis' },
    { value: 'LIPID', label: 'Lipid Profile', description: 'Cholesterol and triglycerides' },
    { value: 'LIVER', label: 'Liver Function Test', description: 'Liver enzymes and proteins' },
    { value: 'KIDNEY', label: 'Kidney Function Test', description: 'Kidney function markers' },
    { value: 'GLUCOSE', label: 'Glucose Test', description: 'Blood sugar levels' },
    { value: 'THYROID', label: 'Thyroid Function Test', description: 'Thyroid hormone levels' },
    { value: 'URINE', label: 'Urine Analysis', description: 'Urine composition and properties' },
    { value: 'XRAY', label: 'X-Ray', description: 'Radiographic imaging' },
  ]

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', description: 'Test ordered, results pending' },
    { value: 'IN_PROGRESS', label: 'In Progress', description: 'Test being processed' },
    { value: 'COMPLETED', label: 'Completed', description: 'Results available' },
    { value: 'CANCELLED', label: 'Cancelled', description: 'Test cancelled' },
  ]

  const priorityOptions = [
    { value: 'LOW', label: 'Low', description: 'Routine testing' },
    { value: 'NORMAL', label: 'Normal', description: 'Standard priority' },
    { value: 'HIGH', label: 'High', description: 'Urgent testing' },
    { value: 'URGENT', label: 'Urgent', description: 'Emergency testing' },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
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
                {labTest ? 'Edit Lab Report' : 'Create New Lab Report'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {labTest 
                  ? 'Update lab test results and report details'
                  : 'Complete the form below to create a new lab report'
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
              maxWidth="xl"
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
                    {labTest ? 'Update Report' : 'Create Report'}
                  </Button>
                </Stack>
              }
            >
              {/* Patient Information Section */}
              <FormSection
                title="Patient Information"
                description="Patient details for the lab report"
              >
                <FormFieldWrapper
                  label="Patient"
                  helperText="Select the patient for this report"
                  error={!!errors.patientId}
                  required
                >
                  <FormSelect
                    value={formData.patientId}
                    onChange={(e) => {
                      const selectedPatient = patientOptions.find(p => p.value === e.target.value)
                      handleChange('patientId', e.target.value as string)
                      if (selectedPatient) {
                        const [name, age, gender] = selectedPatient.description.split(', ')
                        handleChange('patientName', selectedPatient.label)
                        handleChange('patientAge', age)
                        handleChange('patientGender', gender)
                      }
                    }}
                    options={patientOptions}
                    error={!!errors.patientId}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Patient Name"
                  helperText="Full name of the patient"
                  error={!!errors.patientName}
                  required
                >
                  <FormInput
                    value={formData.patientName}
                    onChange={(e) => handleChange('patientName', e.target.value)}
                    placeholder="John Doe"
                    startIcon={<Person />}
                    error={!!errors.patientName}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Age"
                  helperText="Patient age"
                  error={!!errors.patientAge}
                  required
                >
                  <FormInput
                    value={formData.patientAge}
                    onChange={(e) => handleChange('patientAge', e.target.value)}
                    placeholder="35"
                    error={!!errors.patientAge}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Gender"
                  helperText="Patient gender"
                  error={!!errors.patientGender}
                  required
                >
                  <FormInput
                    value={formData.patientGender}
                    onChange={(e) => handleChange('patientGender', e.target.value)}
                    placeholder="Male"
                    error={!!errors.patientGender}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Test Information Section */}
              <FormSection
                title="Test Information"
                description="Lab test details and scheduling"
              >
                <FormFieldWrapper
                  label="Test Type"
                  helperText="Type of laboratory test"
                  error={!!errors.testType}
                  required
                >
                  <FormSelect
                    value={formData.testType}
                    onChange={(e) => handleChange('testType', e.target.value as string)}
                    options={testTypeOptions}
                    error={!!errors.testType}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Test Date"
                  helperText="Date when the test was performed"
                  error={!!errors.testDate}
                  required
                >
                  <FormDatePicker
                    value={formData.testDate}
                    onChange={(date) => handleChange('testDate', date)}
                    error={!!errors.testDate}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Report Date"
                  helperText="Date when the report was generated"
                >
                  <FormDatePicker
                    value={formData.reportDate}
                    onChange={(date) => handleChange('reportDate', date)}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Priority"
                  helperText="Test priority level"
                >
                  <FormSelect
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as string)}
                    options={priorityOptions}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Status"
                  helperText="Current test status"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Requesting Doctor"
                  helperText="Doctor who ordered the test"
                  error={!!errors.doctorId}
                  required
                >
                  <FormSelect
                    value={formData.doctorId}
                    onChange={(e) => {
                      const selectedDoctor = doctorOptions.find(d => d.value === e.target.value)
                      handleChange('doctorId', e.target.value as string)
                      if (selectedDoctor) {
                        handleChange('doctorName', selectedDoctor.label)
                      }
                    }}
                    options={doctorOptions}
                    error={!!errors.doctorId}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Test Results Section */}
              <FormSection
                title="Test Results"
                description="Individual test results and values"
              >
                <Box sx={{ mb: 3 }}>
                  {formData.tests.map((test, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <FormFieldWrapper label="Test Name" required fullWidth>
                        <FormInput
                          value={test.name}
                          onChange={(e) => handleTestChange(index, 'name', e.target.value)}
                          placeholder="Test name"
                          startIcon={<Science />}
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Result" required sx={{ minWidth: 120 }}>
                        <FormInput
                          value={test.result}
                          onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                          placeholder="Result"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Normal Range" required sx={{ minWidth: 150 }}>
                        <FormInput
                          value={test.normalRange}
                          onChange={(e) => handleTestChange(index, 'normalRange', e.target.value)}
                          placeholder="Range"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Unit" required sx={{ minWidth: 100 }}>
                        <FormInput
                          value={test.unit}
                          onChange={(e) => handleTestChange(index, 'unit', e.target.value)}
                          placeholder="Unit"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Status" required sx={{ minWidth: 120 }}>
                        <FormSelect
                          value={test.status}
                          onChange={(e) => handleTestChange(index, 'status', e.target.value as string)}
                          options={[
                            { value: 'Normal', label: 'Normal' },
                            { value: 'Abnormal', label: 'Abnormal' },
                            { value: 'Critical', label: 'Critical' },
                          ]}
                        />
                      </FormFieldWrapper>
                      {formData.tests.length > 1 && (
                        <Button
                          onClick={() => removeTest(index)}
                          color="error"
                          variant="outlined"
                          size="small"
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Button
                    onClick={addTest}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Add Test
                  </Button>
                </Box>
              </FormSection>

              {/* Report Details Section */}
              <FormSection
                title="Report Details"
                description="Additional information and signatures"
              >
                <FormFieldWrapper
                  label="Lab Technician"
                  helperText="Name of the lab technician"
                  error={!!errors.technician}
                  required
                >
                  <FormInput
                    value={formData.technician}
                    onChange={(e) => handleChange('technician', e.target.value)}
                    placeholder="Technician name"
                    error={!!errors.technician}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Pathologist"
                  helperText="Name of the reviewing pathologist"
                  error={!!errors.pathologist}
                  required
                >
                  <FormInput
                    value={formData.pathologist}
                    onChange={(e) => handleChange('pathologist', e.target.value)}
                    placeholder="Pathologist name"
                    error={!!errors.pathologist}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Remarks"
                  helperText="General remarks about the test results"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    placeholder="General remarks and observations..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Recommendations"
                  helperText="Medical recommendations based on results"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.recommendations}
                    onChange={(e) => handleChange('recommendations', e.target.value)}
                    placeholder="Medical recommendations and follow-up suggestions..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Attachments"
                  helperText="Upload supporting documents or images"
                >
                  <FormFileUpload
                    value={formData.attachments}
                    onChange={(files) => handleChange('attachments', files)}
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    maxSize={10 * 1024 * 1024}
                    maxFiles={5}
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
