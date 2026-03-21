import { useState } from 'react'
import { Box, Button, Typography, Card, CardContent } from '@mui/material'
import { Add as AddIcon, Medication as MedicineIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { PharmacyTable } from '../components/PharmacyTable'
import { SimpleMedicineForm } from '../components/forms/SimpleMedicineForm'
import { addMedicine, updateMedicine, deleteMedicine, updateStock } from '../../features/pharmacy/pharmacySlice'
import toast from 'react-hot-toast'

export default function PharmacyPage() {
  const dispatch = useAppDispatch()
  const medicines = useAppSelector((state) => state.pharmacy.medicines)
  
  const [showForm, setShowForm] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<any | null>(null)

  const handleAddMedicine = () => {
    setEditingMedicine(null)
    setShowForm(true)
  }

  const handleEditMedicine = (medicine: any) => {
    setEditingMedicine(medicine)
    setShowForm(true)
  }

  const handleDeleteMedicine = (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      dispatch(deleteMedicine(medicineId))
      toast.success('Medicine deleted successfully')
    }
  }

  const handleUpdateStock = (medicineId: string, quantity: number) => {
    dispatch(updateStock({ id: medicineId, quantity }))
    const action = quantity > 0 ? 'added' : 'removed'
    toast.success(`Stock ${action}: ${Math.abs(quantity)} units`)
  }

  const handleFormSubmit = (medicineData: any) => {
    if (editingMedicine) {
      dispatch(updateMedicine({ 
        id: editingMedicine.id, 
        changes: medicineData 
      }))
      toast.success('Medicine updated successfully')
    } else {
      const newMedicine = {
        ...medicineData,
        id: `MED-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      }
      dispatch(addMedicine(newMedicine))
      toast.success('Medicine added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingMedicine(null)
  }

  // Calculate statistics
  const totalMedicines = medicines.length
  const lowStockCount = medicines.filter(m => m.status === 'LOW').length
  const outOfStockCount = medicines.filter(m => m.status === 'OUT').length
  const inStockCount = medicines.filter(m => m.status === 'OK').length

  return (
    <Box>
      <PageHeader
        title="Pharmacy Management"
        subtitle="Manage medicine inventory, track stock levels, and handle prescriptions"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddMedicine}
              sx={{ borderRadius: 2 }}
            >
              Add Medicine
            </Button>
          </motion.div>
        }
      />
      
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <MedicineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {totalMedicines}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Medicines
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'success.main', mb: 1 }}>✓</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {inStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Stock
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}>⚠</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {lowStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: 40, color: 'error.main', mb: 1 }}>✕</Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                {outOfStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Out of Stock
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      <PharmacyTable
        medicines={medicines}
        onEdit={handleEditMedicine}
        onDelete={handleDeleteMedicine}
        onAdd={handleAddMedicine}
        onUpdateStock={handleUpdateStock}
      />

      <SimpleMedicineForm
        open={showForm}
        medicine={editingMedicine}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}
