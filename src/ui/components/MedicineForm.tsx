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
import { type Medicine } from '../../features/pharmacy/pharmacySlice'

interface MedicineFormProps {
  open: boolean
  medicine?: Medicine | null
  onClose: () => void
  onSubmit: (medicine: Omit<Medicine, 'id' | 'updatedAt'>) => void
}

export function MedicineForm({ open, medicine, onClose, onSubmit }: MedicineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    reorderLevel: 10,
    price: 0,
    status: 'OK' as 'OK' | 'LOW' | 'OUT',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        category: medicine.category,
        stock: medicine.stock,
        reorderLevel: medicine.reorderLevel,
        price: medicine.price,
        status: medicine.status,
      })
    } else {
      setFormData({
        name: '',
        category: '',
        stock: 0,
        reorderLevel: 10,
        price: 0,
        status: 'OK',
      })
    }
    setErrors({})
  }, [medicine, open])

  useEffect(() => {
    const status = formData.stock <= 0 ? 'OUT' : 
                   formData.stock <= formData.reorderLevel ? 'LOW' : 'OK'
    setFormData(prev => ({ ...prev, status }))
  }, [formData.stock, formData.reorderLevel])

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
      status: formData.status,
    })
  }

  const handleChange = (field: string, value: string | number) => {
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
            {medicine ? 'Edit Medicine' : 'Add New Medicine'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Medicine Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    <MenuItem value="Antibiotics">Antibiotics</MenuItem>
                    <MenuItem value="Pain Killers">Pain Killers</MenuItem>
                    <MenuItem value="Vitamins">Vitamins</MenuItem>
                    <MenuItem value="Cardiac">Cardiac</MenuItem>
                    <MenuItem value="Diabetes">Diabetes</MenuItem>
                    <MenuItem value="Respiratory">Respiratory</MenuItem>
                    <MenuItem value="Gastrointestinal">Gastrointestinal</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Current Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value) || 0)}
                  error={!!errors.reorderLevel}
                  helperText={errors.reorderLevel}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Price per Unit"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Stock Status Preview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">
                  Status: 
                </Typography>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 
                      formData.status === 'OK' ? 'success.light' :
                      formData.status === 'LOW' ? 'warning.light' : 'error.light',
                    color: 
                      formData.status === 'OK' ? 'success.dark' :
                      formData.status === 'LOW' ? 'warning.dark' : 'error.dark',
                    fontWeight: 600,
                  }}
                >
                  {formData.status}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {formData.status === 'OUT' ? 'No stock available' :
                   formData.status === 'LOW' ? `Stock below reorder level (${formData.reorderLevel})` :
                   'Sufficient stock available'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {medicine ? 'Update Medicine' : 'Add Medicine'}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  )
}
