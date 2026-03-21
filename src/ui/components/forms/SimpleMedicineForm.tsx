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
import { Medication, Inventory, AttachMoney } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'

interface SimpleMedicineFormProps {
  open: boolean
  medicine?: any | null
  onClose: () => void
  onSubmit: (medicine: any) => void
}

export function SimpleMedicineForm({
  open,
  medicine,
  onClose,
  onSubmit,
}: SimpleMedicineFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    name: '',
    category: '',
    stock: 0,
    reorderLevel: 10,
    price: 0,
    status: 'OK' as 'OK' | 'LOW' | 'OUT',
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        category: medicine.category || '',
        stock: medicine.stock || 0,
        reorderLevel: medicine.reorderLevel || 10,
        price: medicine.price || 0,
        status: medicine.status || 'OK',
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, medicine])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Medicine name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative'
    if (formData.reorderLevel < 0) newErrors.reorderLevel = 'Reorder level cannot be negative'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      name: formData.name,
      category: formData.category,
      stock: formData.stock,
      reorderLevel: formData.reorderLevel,
      price: formData.price,
      status: formData.stock <= 0 ? 'OUT' : formData.stock <= formData.reorderLevel ? 'LOW' : 'OK',
      updatedAt: new Date().toISOString(),
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const categoryOptions = [
    { value: 'ANALGESICS', label: 'Analgesics', description: 'Pain relievers' },
    { value: 'ANTIBIOTICS', label: 'Antibiotics', description: 'Anti-infective agents' },
    { value: 'ANTIVIRAL', label: 'Antiviral', description: 'Viral infection treatments' },
    { value: 'ANTI_INFLAMMATORY', label: 'Anti-inflammatory', description: 'Inflammation reducers' },
    { value: 'CARDIOVASCULAR', label: 'Cardiovascular', description: 'Heart and blood pressure' },
    { value: 'RESPIRATORY', label: 'Respiratory', description: 'Breathing and lung conditions' },
    { value: 'GASTROINTESTINAL', label: 'Gastrointestinal', description: 'Digestive system' },
    { value: 'DERMATOLOGICAL', label: 'Dermatological', description: 'Skin conditions' },
    { value: 'VITAMINS', label: 'Vitamins & Supplements', description: 'Nutritional supplements' },
    { value: 'VACCINES', label: 'Vaccines', description: 'Immunizations' },
  ]

  const statusOptions = [
    { value: 'OK', label: 'In Stock', description: 'Adequate stock available' },
    { value: 'LOW', label: 'Low Stock', description: 'Stock below reorder level' },
    { value: 'OUT', label: 'Out of Stock', description: 'No stock available' },
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
              <Medication sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {medicine ? 'Edit Medicine' : 'Add New Medicine'}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {medicine 
                  ? 'Update medicine information and inventory details'
                  : 'Complete the form below to add a new medicine to inventory'
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
                    {medicine ? 'Update Medicine' : 'Add Medicine'}
                  </Button>
                </Stack>
              }
            >
              {/* Basic Information Section */}
              <FormSection
                title="Basic Information"
                description="General medicine details"
              >
                <FormFieldWrapper
                  label="Medicine Name"
                  helperText="Brand name of the medicine"
                  error={!!errors.name}
                  required
                >
                  <FormInput
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Tylenol"
                    startIcon={<Medication />}
                    error={!!errors.name}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Category"
                  helperText="Medicine category"
                  error={!!errors.category}
                  required
                >
                  <FormSelect
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as string)}
                    options={categoryOptions}
                    error={!!errors.category}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Current Status"
                  helperText="Current availability status"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Pricing Section */}
              <FormSection
                title="Pricing Information"
                description="Cost and pricing details"
              >
                <FormFieldWrapper
                  label="Unit Price"
                  helperText="Price per unit for customers"
                  error={!!errors.price}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    startIcon={<AttachMoney />}
                    error={!!errors.price}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Inventory Section */}
              <FormSection
                title="Inventory Management"
                description="Stock levels and tracking"
              >
                <FormFieldWrapper
                  label="Current Stock"
                  helperText="Current quantity in stock"
                  error={!!errors.stock}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    startIcon={<Inventory />}
                    error={!!errors.stock}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Reorder Level"
                  helperText="Alert when stock falls below this level"
                  error={!!errors.reorderLevel}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value) || 0)}
                    placeholder="10"
                    error={!!errors.reorderLevel}
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
