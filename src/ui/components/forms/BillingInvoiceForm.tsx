import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Stack,
  useTheme,
  alpha,
} from '@mui/material'
import { motion } from 'framer-motion'
import { Person, Phone, Email, Receipt, AttachMoney } from '@mui/icons-material'
import { type Invoice } from '../../features/billing/billingSlice'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'
import { pdfGenerator } from './PDFGenerator'

interface BillingInvoiceFormProps {
  open: boolean
  billing?: Invoice | null
  onClose: () => void
  onSubmit: (billing: Omit<Invoice, 'id'>) => void
}

export function BillingInvoiceForm({
  open,
  billing,
  onClose,
  onSubmit,
}: BillingInvoiceFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    patientId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    invoiceNumber: '',
    invoiceDate: new Date(),
    dueDate: new Date(),
    services: [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 150, total: 150 }
    ],
    subtotal: 150,
    tax: 15,
    total: 165,
    status: 'PENDING' as 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED',
    paymentMethod: 'CASH' as 'CASH' | 'CARD' | 'INSURANCE' | 'ONLINE',
    notes: '',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new billing data
  useEffect(() => {
    if (!open) return
    
    if (billing) {
      setFormData({
        patientId: billing.patientId,
        patientName: billing.patientName,
        patientEmail: billing.patientEmail,
        patientPhone: billing.patientPhone,
        invoiceNumber: billing.invoiceNumber,
        invoiceDate: new Date(billing.invoiceDate),
        dueDate: new Date(billing.dueDate),
        services: billing.services,
        subtotal: billing.subtotal,
        tax: billing.tax,
        total: billing.total,
        status: billing.status,
        paymentMethod: billing.paymentMethod,
        notes: billing.notes || '',
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
    if (!formData.invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice number is required'
    if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice date is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      patientPhone: formData.patientPhone,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate.toISOString(),
      dueDate: formData.dueDate.toISOString(),
      services: formData.services,
      subtotal: formData.subtotal,
      tax: formData.tax,
      total: formData.total,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    })
  }

  const handleGeneratePDF = async () => {
    if (!validateForm()) return

    try {
      await pdfGenerator.generateInvoicePDF(formData, {
        filename: `invoice-${formData.invoiceNumber}.pdf`,
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

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updatedServices = [...formData.services]
    updatedServices[index] = { ...updatedServices[index], [field]: value }
    
    // Recalculate totals
    const subtotal = updatedServices.reduce((sum, service) => sum + service.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices,
      subtotal,
      tax,
      total,
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { description: '', quantity: 1, unitPrice: 0, total: 0 }],
    }))
  }

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index)
    const subtotal = updatedServices.reduce((sum, service) => sum + service.total, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices,
      subtotal,
      tax,
      total,
    }))
  }

  const patientOptions = [
    { value: 'P-001', label: 'John Doe', description: 'john@example.com' },
    { value: 'P-002', label: 'Jane Smith', description: 'jane@example.com' },
    { value: 'P-003', label: 'Robert Johnson', description: 'robert@example.com' },
  ]

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', description: 'Payment pending' },
    { value: 'PAID', label: 'Paid', description: 'Payment completed' },
    { value: 'OVERDUE', label: 'Overdue', description: 'Payment overdue' },
    { value: 'CANCELLED', label: 'Cancelled', description: 'Invoice cancelled' },
  ]

  const paymentMethodOptions = [
    { value: 'CASH', label: 'Cash', description: 'Cash payment' },
    { value: 'CARD', label: 'Card', description: 'Credit/Debit card' },
    { value: 'INSURANCE', label: 'Insurance', description: 'Insurance claim' },
    { value: 'ONLINE', label: 'Online', description: 'Online payment' },
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

              {/* Invoice Details Section */}
              <FormSection
                title="Invoice Details"
                description="Invoice information and dates"
              >
                <FormFieldWrapper
                  label="Invoice Number"
                  helperText="Unique invoice identifier"
                  error={!!errors.invoiceNumber}
                  required
                >
                  <FormInput
                    value={formData.invoiceNumber}
                    onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                    placeholder="INV-001"
                    startIcon={<Receipt />}
                    error={!!errors.invoiceNumber}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Invoice Date"
                  helperText="Date when invoice was created"
                  error={!!errors.invoiceDate}
                  required
                >
                  <FormDatePicker
                    value={formData.invoiceDate}
                    onChange={(date) => handleChange('invoiceDate', date)}
                    error={!!errors.invoiceDate}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Due Date"
                  helperText="Payment due date"
                  error={!!errors.dueDate}
                  required
                >
                  <FormDatePicker
                    value={formData.dueDate}
                    onChange={(date) => handleChange('dueDate', date)}
                    error={!!errors.dueDate}
                  />
                </FormFieldWrapper>

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
                  label="Payment Method"
                  helperText="Preferred payment method"
                >
                  <FormSelect
                    value={formData.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value as string)}
                    options={paymentMethodOptions}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Services Section */}
              <FormSection
                title="Services & Charges"
                description="List of medical services and charges"
              >
                <Box sx={{ mb: 3 }}>
                  {formData.services.map((service, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                      <FormFieldWrapper label="Description" required fullWidth>
                        <FormInput
                          value={service.description}
                          onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                          placeholder="Service description"
                          startIcon={<Description />}
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Quantity" required sx={{ minWidth: 120 }}>
                        <FormInput
                          type="number"
                          value={service.quantity}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0
                            const total = quantity * service.unitPrice
                            handleServiceChange(index, 'quantity', quantity)
                            handleServiceChange(index, 'total', total)
                          }}
                          placeholder="1"
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Unit Price" required sx={{ minWidth: 120 }}>
                        <FormInput
                          type="number"
                          value={service.unitPrice}
                          onChange={(e) => {
                            const unitPrice = parseFloat(e.target.value) || 0
                            const total = service.quantity * unitPrice
                            handleServiceChange(index, 'unitPrice', unitPrice)
                            handleServiceChange(index, 'total', total)
                          }}
                          placeholder="0.00"
                          startIcon={<AttachMoney />}
                        />
                      </FormFieldWrapper>
                      <FormFieldWrapper label="Total" sx={{ minWidth: 120 }}>
                        <FormInput
                          type="number"
                          value={service.total}
                          disabled
                          placeholder="0.00"
                          startIcon={<AttachMoney />}
                        />
                      </FormFieldWrapper>
                      {formData.services.length > 1 && (
                        <Button
                          onClick={() => removeService(index)}
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
                    onClick={addService}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Add Service
                  </Button>
                </Box>
              </FormSection>

              {/* Summary Section */}
              <FormSection
                title="Payment Summary"
                description="Invoice totals and payment information"
              >
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Subtotal: ${formData.subtotal.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Tax (10%): ${formData.tax.toFixed(2)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                    Total: ${formData.total.toFixed(2)}
                  </Typography>
                </Box>

                <FormFieldWrapper
                  label="Additional Notes"
                  helperText="Any additional information or payment instructions"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Additional notes, payment instructions, or special conditions..."
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
