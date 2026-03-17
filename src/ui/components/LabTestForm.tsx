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
import { type LabTest, type LabStatus } from '../../features/lab/labSlice'
import { useAppSelector } from '../../app/hooks'

interface LabTestFormProps {
  open: boolean
  test?: LabTest | null
  onClose: () => void
  onSubmit: (test: Omit<LabTest, 'id' | 'requestedAt' | 'reportedAt' | 'reportFiles'>) => void
}

export function LabTestForm({ open, test, onClose, onSubmit }: LabTestFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    requestedByDoctorId: '',
    testName: '',
    status: 'REQUESTED' as LabStatus,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const patients = useAppSelector((state) => state.patients.items)
  const doctors = useAppSelector((state) => state.doctors.items)

  useEffect(() => {
    if (test) {
      setFormData({
        patientId: test.patientId,
        requestedByDoctorId: test.requestedByDoctorId,
        testName: test.testName,
        status: test.status,
      })
    } else {
      setFormData({
        patientId: '',
        requestedByDoctorId: '',
        testName: '',
        status: 'REQUESTED',
      })
    }
    setErrors({})
  }, [test, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient is required'
    if (!formData.requestedByDoctorId) newErrors.requestedByDoctorId = 'Requesting doctor is required'
    if (!formData.testName.trim()) newErrors.testName = 'Test name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      requestedByDoctorId: formData.requestedByDoctorId,
      testName: formData.testName,
      status: formData.status,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
            {test ? 'Edit Lab Test' : 'Add New Lab Test'}
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
                  <InputLabel>Requested By Doctor</InputLabel>
                  <Select
                    value={formData.requestedByDoctorId}
                    label="Requested By Doctor"
                    onChange={(e) => handleChange('requestedByDoctorId', e.target.value)}
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
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Test Name</InputLabel>
                  <Select
                    value={formData.testName}
                    label="Test Name"
                    onChange={(e) => handleChange('testName', e.target.value)}
                  >
                    <MenuItem value="Blood Test">Blood Test</MenuItem>
                    <MenuItem value="Urine Test">Urine Test</MenuItem>
                    <MenuItem value="X-Ray">X-Ray</MenuItem>
                    <MenuItem value="CT Scan">CT Scan</MenuItem>
                    <MenuItem value="MRI">MRI</MenuItem>
                    <MenuItem value="ECG">ECG</MenuItem>
                    <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                    <MenuItem value="Liver Function Test">Liver Function Test</MenuItem>
                    <MenuItem value="Kidney Function Test">Kidney Function Test</MenuItem>
                    <MenuItem value="Thyroid Profile">Thyroid Profile</MenuItem>
                    <MenuItem value="Lipid Profile">Lipid Profile</MenuItem>
                    <MenuItem value="Sugar Test">Sugar Test</MenuItem>
                    <MenuItem value="COVID-19 Test">COVID-19 Test</MenuItem>
                    <MenuItem value="Pregnancy Test">Pregnancy Test</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <MenuItem value="REQUESTED">Requested</MenuItem>
                    <MenuItem value="COLLECTED">Sample Collected</MenuItem>
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                    <MenuItem value="REPORTED">Reported</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Test Workflow
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {['REQUESTED', 'COLLECTED', 'PROCESSING', 'REPORTED'].map((step, index) => (
                  <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: 
                          formData.status === step ? 'primary.main' :
                          index < ['REQUESTED', 'COLLECTED', 'PROCESSING', 'REPORTED'].indexOf(formData.status) 
                            ? 'success.main' : 'grey.300',
                        color: 
                          formData.status === step || 
                          index < ['REQUESTED', 'COLLECTED', 'PROCESSING', 'REPORTED'].indexOf(formData.status) 
                            ? 'white' : 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    >
                      {step}
                    </Box>
                    {index < 3 && (
                      <Typography variant="caption" color="text.secondary">
                        →
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {test ? 'Update Test' : 'Add Test'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
