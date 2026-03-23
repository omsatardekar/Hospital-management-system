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
import { Medication, Inventory, Category, AttachMoney } from '@mui/icons-material'
import {
  BaseForm,
  FormSection,
  FormFieldWrapper,
} from './BaseForm'
import { FormInput } from './FormInput'
import { FormSelect } from './FormSelect'
import { FormDatePicker } from './FormDatePicker'

interface MedicineManagementFormProps {
  open: boolean
  medicine?: any | null
  onClose: () => void
  onSubmit: (medicine: any) => void
}

export function MedicineManagementForm({
  open,
  medicine,
  onClose,
  onSubmit,
}: MedicineManagementFormProps) {
  const theme = useTheme()
  
  const getInitialFormData = () => ({
    name: '',
    genericName: '',
    category: '',
    manufacturer: '',
    description: '',
    dosage: '',
    strength: '',
    form: 'TABLET' as 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'CREAM' | 'OINTMENT',
    unitPrice: 0,
    sellingPrice: 0,
    stockQuantity: 0,
    minStockLevel: 10,
    maxStockLevel: 1000,
    expiryDate: new Date(),
    batchNumber: '',
    storageConditions: '',
    sideEffects: '',
    contraindications: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED',
    requiresPrescription: true,
  })

  const [formData, setFormData] = useState(getInitialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new medicine data
  useEffect(() => {
    if (!open) return
    
    if (medicine) {
      setFormData({
        name: medicine.name,
        genericName: medicine.genericName,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        description: medicine.description,
        dosage: medicine.dosage,
        strength: medicine.strength,
        form: medicine.form,
        unitPrice: medicine.unitPrice,
        sellingPrice: medicine.sellingPrice,
        stockQuantity: medicine.stockQuantity,
        minStockLevel: medicine.minStockLevel,
        maxStockLevel: medicine.maxStockLevel,
        expiryDate: new Date(medicine.expiryDate),
        batchNumber: medicine.batchNumber,
        storageConditions: medicine.storageConditions,
        sideEffects: medicine.sideEffects,
        contraindications: medicine.contraindications,
        status: medicine.status,
        requiresPrescription: medicine.requiresPrescription,
      })
    } else {
      setFormData(getInitialFormData())
    }
    setErrors({})
  }, [open, medicine])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Medicine name is required'
    if (!formData.genericName.trim()) newErrors.genericName = 'Generic name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required'
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosage information is required'
    if (!formData.strength.trim()) newErrors.strength = 'Strength is required'
    if (!formData.form) newErrors.form = 'Form is required'
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0'
    if (formData.sellingPrice <= 0) newErrors.sellingPrice = 'Selling price must be greater than 0'
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Stock quantity cannot be negative'
    if (formData.minStockLevel < 0) newErrors.minStockLevel = 'Minimum stock level cannot be negative'
    if (formData.maxStockLevel <= formData.minStockLevel) {
      newErrors.maxStockLevel = 'Maximum stock level must be greater than minimum'
    }
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      name: formData.name,
      genericName: formData.genericName,
      category: formData.category,
      manufacturer: formData.manufacturer,
      description: formData.description,
      dosage: formData.dosage,
      strength: formData.strength,
      form: formData.form,
      unitPrice: formData.unitPrice,
      sellingPrice: formData.sellingPrice,
      stockQuantity: formData.stockQuantity,
      minStockLevel: formData.minStockLevel,
      maxStockLevel: formData.maxStockLevel,
      expiryDate: formData.expiryDate.toISOString(),
      batchNumber: formData.batchNumber,
      storageConditions: formData.storageConditions,
      sideEffects: formData.sideEffects,
      contraindications: formData.contraindications,
      status: formData.status,
      requiresPrescription: formData.requiresPrescription,
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

  const formOptions = [
    { value: 'TABLET', label: 'Tablet' },
    { value: 'CAPSULE', label: 'Capsule' },
    { value: 'SYRUP', label: 'Syrup' },
    { value: 'INJECTION', label: 'Injection' },
    { value: 'CREAM', label: 'Cream' },
    { value: 'OINTMENT', label: 'Ointment' },
  ]

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active', description: 'Available for use' },
    { value: 'INACTIVE', label: 'Inactive', description: 'Temporarily unavailable' },
    { value: 'DISCONTINUED', label: 'Discontinued', description: 'No longer stocked' },
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
                  label="Generic Name"
                  helperText="Generic or chemical name"
                  error={!!errors.genericName}
                  required
                >
                  <FormInput
                    value={formData.genericName}
                    onChange={(e) => handleChange('genericName', e.target.value)}
                    placeholder="e.g., Acetaminophen"
                    error={!!errors.genericName}
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
                  label="Manufacturer"
                  helperText="Pharmaceutical company"
                  error={!!errors.manufacturer}
                  required
                >
                  <FormInput
                    value={formData.manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    placeholder="e.g., Johnson & Johnson"
                    error={!!errors.manufacturer}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Description"
                  helperText="Brief description of the medicine"
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe the medicine and its uses..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Status"
                  helperText="Current availability status"
                >
                  <FormSelect
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as string)}
                    options={statusOptions}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Dosage Information Section */}
              <FormSection
                title="Dosage Information"
                description="Strength, form, and dosage details"
              >
                <FormFieldWrapper
                  label="Strength"
                  helperText="Medicine strength or concentration"
                  error={!!errors.strength}
                  required
                >
                  <FormInput
                    value={formData.strength}
                    onChange={(e) => handleChange('strength', e.target.value)}
                    placeholder="e.g., 500mg, 10ml"
                    error={!!errors.strength}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Form"
                  helperText="Physical form of the medicine"
                  error={!!errors.form}
                  required
                >
                  <FormSelect
                    value={formData.form}
                    onChange={(e) => handleChange('form', e.target.value as string)}
                    options={formOptions}
                    error={!!errors.form}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Dosage Instructions"
                  helperText="Recommended dosage information"
                  error={!!errors.dosage}
                  required
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.dosage}
                    onChange={(e) => handleChange('dosage', e.target.value)}
                    placeholder="e.g., Take 1 tablet twice daily with meals"
                    error={!!errors.dosage}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Requires Prescription"
                  helperText="Whether this medicine requires a prescription"
                >
                  <FormSelect
                    value={formData.requiresPrescription.toString()}
                    onChange={(e) => handleChange('requiresPrescription', e.target.value === 'true')}
                    options={[
                      { value: 'true', label: 'Yes' },
                      { value: 'false', label: 'No' },
                    ]}
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Pricing Section */}
              <FormSection
                title="Pricing Information"
                description="Cost and pricing details"
              >
                <FormFieldWrapper
                  label="Unit Purchase Price"
                  helperText="Cost per unit for the pharmacy"
                  error={!!errors.unitPrice}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    startIcon={<AttachMoney />}
                    error={!!errors.unitPrice}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Selling Price"
                  helperText="Price per unit for customers"
                  error={!!errors.sellingPrice}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => handleChange('sellingPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    startIcon={<AttachMoney />}
                    error={!!errors.sellingPrice}
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
                  error={!!errors.stockQuantity}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => handleChange('stockQuantity', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    startIcon={<Inventory />}
                    error={!!errors.stockQuantity}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Minimum Stock Level"
                  helperText="Alert when stock falls below this level"
                  error={!!errors.minStockLevel}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => handleChange('minStockLevel', parseInt(e.target.value) || 0)}
                    placeholder="10"
                    error={!!errors.minStockLevel}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Maximum Stock Level"
                  helperText="Maximum quantity to maintain in stock"
                  error={!!errors.maxStockLevel}
                  required
                >
                  <FormInput
                    type="number"
                    value={formData.maxStockLevel}
                    onChange={(e) => handleChange('maxStockLevel', parseInt(e.target.value) || 0)}
                    placeholder="1000"
                    error={!!errors.maxStockLevel}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Expiry Date"
                  helperText="Medicine expiration date"
                  error={!!errors.expiryDate}
                  required
                >
                  <FormDatePicker
                    value={formData.expiryDate}
                    onChange={(date) => handleChange('expiryDate', date)}
                    error={!!errors.expiryDate}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Batch Number"
                  helperText="Manufacturer batch number"
                  error={!!errors.batchNumber}
                  required
                >
                  <FormInput
                    value={formData.batchNumber}
                    onChange={(e) => handleChange('batchNumber', e.target.value)}
                    placeholder="e.g., BATCH-001-2024"
                    error={!!errors.batchNumber}
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Storage Conditions"
                  helperText="Special storage requirements"
                >
                  <FormInput
                    multiline
                    rows={2}
                    value={formData.storageConditions}
                    onChange={(e) => handleChange('storageConditions', e.target.value)}
                    placeholder="e.g., Store in a cool, dry place away from sunlight"
                  />
                </FormFieldWrapper>
              </FormSection>

              {/* Medical Information Section */}
              <FormSection
                title="Medical Information"
                description="Safety and usage information"
              >
                <FormFieldWrapper
                  label="Side Effects"
                  helperText="Common or serious side effects"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.sideEffects}
                    onChange={(e) => handleChange('sideEffects', e.target.value)}
                    placeholder="List potential side effects..."
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Contraindications"
                  helperText="Conditions or medications that should not be combined"
                >
                  <FormInput
                    multiline
                    rows={3}
                    value={formData.contraindications}
                    onChange={(e) => handleChange('contraindications', e.target.value)}
                    placeholder="List contraindications and warnings..."
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
