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
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type Invoice, type InvoiceStatus } from '../../features/billing/billingSlice'
import { useAppSelector } from '../../app/hooks'

interface InvoiceFormProps {
  open: boolean
  invoice?: Invoice | null
  onClose: () => void
  onSubmit: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void
}

export function InvoiceForm({ open, invoice, onClose, onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    status: 'DUE' as InvoiceStatus,
    total: 0,
    paid: 0,
    insuranceProvider: '',
    insurancePolicyId: '',
    items: [{ label: '', amount: 0 }] as { label: string; amount: number }[],
    payments: [] as { id: string; at: string; amount: number; method: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE' }[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const patients = useAppSelector((state) => state.patients.items)

  useEffect(() => {
    if (invoice) {
      setFormData({
        patientId: invoice.patientId,
        status: invoice.status,
        total: invoice.total,
        paid: invoice.paid,
        insuranceProvider: invoice.insuranceProvider || '',
        insurancePolicyId: invoice.insurancePolicyId || '',
        items: invoice.items.length > 0 ? invoice.items : [{ label: '', amount: 0 }],
        payments: invoice.payments,
      })
    } else {
      setFormData({
        patientId: '',
        status: 'DUE',
        total: 0,
        paid: 0,
        insuranceProvider: '',
        insurancePolicyId: '',
        items: [{ label: '', amount: 0 }],
        payments: [],
      })
    }
    setErrors({})
  }, [invoice, open])

  useEffect(() => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    setFormData(prev => ({ ...prev, total: itemsTotal }))
  }, [formData.items])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient is required'
    if (formData.items.length === 0 || formData.items.every(item => !item.label.trim())) {
      newErrors.items = 'At least one item is required'
    }
    if (formData.total <= 0) newErrors.total = 'Total must be greater than 0'
    if (formData.paid > formData.total) newErrors.paid = 'Paid amount cannot exceed total'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const validItems = formData.items.filter(item => item.label.trim() && item.amount > 0)
    
    onSubmit({
      patientId: formData.patientId,
      status: formData.paid >= formData.total ? 'PAID' : formData.status,
      total: formData.total,
      paid: formData.paid,
      insuranceProvider: formData.insuranceProvider || undefined,
      insurancePolicyId: formData.insurancePolicyId || undefined,
      items: validItems,
      payments: formData.payments,
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { label: '', amount: 0 }]
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {invoice ? 'Edit Invoice' : 'Generate New Invoice'}
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
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <MenuItem value="DUE">Due</MenuItem>
                    <MenuItem value="PARTIAL">Partial</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="VOID">Void</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleChange('insuranceProvider', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance Policy ID"
                  value={formData.insurancePolicyId}
                  onChange={(e) => handleChange('insurancePolicyId', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Invoice Items
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  variant="outlined"
                  size="small"
                >
                  Add Item
                </Button>
              </Box>
              
              {formData.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField
                    label="Item Description"
                    value={item.label}
                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    sx={{ width: 150 }}
                    InputProps={{ startAdornment: '$' }}
                  />
                  {formData.items.length > 1 && (
                    <IconButton
                      onClick={() => removeItem(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              {errors.items && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.items}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Paid Amount"
                    type="number"
                    value={formData.paid}
                    onChange={(e) => handleChange('paid', parseFloat(e.target.value) || 0)}
                    error={!!errors.paid}
                    helperText={errors.paid}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'right', pt: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Total Amount:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatCurrency(formData.total)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Balance: {formatCurrency(formData.total - formData.paid)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {invoice ? 'Update Invoice' : 'Generate Invoice'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
