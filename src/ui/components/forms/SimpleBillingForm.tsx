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
import { Person, Phone, Email, Receipt, AttachMoney, PictureAsPdf } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { pdfGenerator } from './PDFGenerator'

interface SimpleBillingFormProps {
  open: boolean
  billing?: any | null
  onClose: () => void
  onSubmit: (billing: any) => void
}

export function SimpleBillingForm({
  open,
  billing,
  onClose,
  onSubmit,
}: SimpleBillingFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    items: [
      { label: 'Consultation Fee', amount: 150 }
    ],
    total: 150,
    paid: 0,
    status: 'DUE' as 'PAID' | 'PARTIAL' | 'DUE' | 'VOID',
    insuranceProvider: '',
    insurancePolicyId: '',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    
    if (billing) {
      setFormData({
        patientId: billing.patientId || '',
        patientName: billing.patientName || '',
        patientEmail: billing.patientEmail || '',
        patientPhone: billing.patientPhone || '',
        items: billing.items || [{ label: 'Consultation Fee', amount: 150 }],
        total: billing.total || 150,
        paid: billing.paid || 0,
        status: billing.status || 'DUE',
        insuranceProvider: billing.insuranceProvider || '',
        insurancePolicyId: billing.insurancePolicyId || '',
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, billing])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient selection is required'
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required'
    if (!formData.patientEmail.trim()) newErrors.patientEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = 'Valid email is required'
    }
    if (!formData.patientPhone.trim()) newErrors.patientPhone = 'Phone number is required'
    if (formData.total <= 0) newErrors.total = 'Total amount must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGeneratePDF = async () => {
    if (!validateForm()) return

    try {
      await pdfGenerator.generateInvoicePDF(formData, {
        filename: `invoice-${formData.patientId}-${new Date().toISOString().split('T')[0]}.pdf`,
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
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      patientPhone: formData.patientPhone,
      items: formData.items,
      total: formData.total,
      paid: formData.paid,
      status: formData.status,
      insuranceProvider: formData.insuranceProvider,
      insurancePolicyId: formData.insurancePolicyId,
      createdAt: new Date().toISOString(),
      payments: [],
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      total,
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { label: '', amount: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    const total = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      total,
    }))
  }

  const patientOptions = [
    { value: 'P-001', label: 'John Doe', description: 'john@example.com' },
    { value: 'P-002', label: 'Jane Smith', description: 'jane@example.com' },
    { value: 'P-003', label: 'Robert Johnson', description: 'robert@example.com' },
  ]

  const statusOptions = [
    { value: 'DUE', label: 'Due', description: 'Payment pending' },
    { value: 'PAID', label: 'Paid', description: 'Payment completed' },
    { value: 'PARTIAL', label: 'Partial', description: 'Partial payment' },
    { value: 'VOID', label: 'Void', description: 'Invoice cancelled' },
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
              <Receipt sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {billing ? 'Edit Invoice' : 'Create New Invoice'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {billing 
                  ? 'Update invoice details and services'
                  : 'Complete the form below to create a new invoice'
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
                    {billing ? 'Update Invoice' : 'Create Invoice'}
                  </Button>
                </Stack>
              }
            >
              {/* Patient Information Section */}
              <FormSection
                title="Patient Information"
                description="Patient details for billing"
              >
                <FormFieldWrapper
                  label="Patient"
                  helperText="Select the patient for this invoice"
                  error={!!errors.patientId}
                  required
                >
                  <FormSelect
                    value={formData.patientId}
                    onChange={(e) => {
                      const selectedPatient = patientOptions.find(p => p.value === e.target.value)
                      handleChange('patientId', e.target.value as string)
                      if (selectedPatient) {
                        handleChange('patientName', selectedPatient.label)
                        handleChange('patientEmail', selectedPatient.description)
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
                  label="Email Address"
                  helperText="Email for sending invoice"
                  error={!!errors.patientEmail}
                  required
                >
                  <FormInput
                    type="email"
                    value={formData.patientEmail}
                    onChange={(e) => handleChange('patientEmail', e.target.value)}
                    placeholder="patient@example.com"
                    startIcon={<Email />}
                    error={!!errors.patientEmail}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Phone Number"
                  helperText="Contact number"
                  error={!!errors.patientPhone}
                  required
                >
                  <FormInput
                    value={formData.patientPhone}
                    onChange={(e) => handleChange('patientPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    startIcon={<Phone />}
                    error={!!errors.patientPhone}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Invoice Items Section */}
              <FormSection
                title="Invoice Items"
                description="Services and charges"
              >
                <Box sx={{ mb: 3 }}>
                  {formData.items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <FormFieldWrapper label="Description" required fullWidth>
                        <FormInput
                          value={item.label}
                          onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                          placeholder="Service description"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Amount" required sx={{ minWidth: 150 }}>
                        <FormInput
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          startIcon={<AttachMoney />}
                        />
                      </FormFieldWrapper>
                      {formData.items.length > 1 && (
                        <Button
                          onClick={() => removeItem(index)}
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
                    onClick={addItem}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Add Item
                  </Button>
                </Box>

                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    Total: ${formData.total.toFixed(2)}
                  </Typography>
                </Box>
              </FormSection>

              {/* Payment Status Section */}
              <FormSection
                title="Payment Status"
                description="Payment information and status"
              >
                <FormFieldWrapper
                  label="Payment Status"
                  helperText="Current payment status"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Amount Paid"
                  helperText="Amount already paid"
                >
                  <FormInput
                    type="number"
                    value={formData.paid}
                    onChange={(e) => handleChange('paid', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    startIcon={<AttachMoney />}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Insurance Provider"
                  helperText="Insurance company name (if applicable)"
                >
                  <FormInput
                    value={formData.insuranceProvider}
                    onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                    placeholder="Insurance company name"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Insurance Policy ID"
                  helperText="Insurance policy number"
                >
                  <FormInput
                    value={formData.insurancePolicyId}
                    onChange={(e) => handleChange('insurancePolicyId', e.target.value)}
                    placeholder="Policy number"
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
