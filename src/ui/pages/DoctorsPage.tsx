import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { DoctorsTable } from '../components/DoctorsTable'
import { SimpleDoctorForm } from '../components/forms/SimpleDoctorForm'
import { addDoctor, updateDoctor, deleteDoctor } from '../../features/doctors/doctorsSlice'
import toast from 'react-hot-toast'

export default function DoctorsPage() {
  const dispatch = useAppDispatch()
  const doctors = useAppSelector((state) => state.doctors.items)
  
  const [showForm, setShowForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null)

  const handleAddDoctor = () => {
    setEditingDoctor(null)
    setShowForm(true)
  }

  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor(doctor)
    setShowForm(true)
  }

  const handleDeleteDoctor = (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      dispatch(deleteDoctor(doctorId))
      toast.success('Doctor deleted successfully')
    }
  }

  const handleViewDoctor = (doctorId: string) => {
    // TODO: Navigate to doctor profile page
    toast.info('Doctor profile view coming soon')
  }

  const handleToggleStatus = (doctorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    dispatch(updateDoctor({ 
      id: doctorId, 
      changes: { status: newStatus as any } 
    }))
    toast.success(`Doctor ${newStatus.toLowerCase()} successfully`)
  }

  const handleFormSubmit = (doctorData: any) => {
    if (editingDoctor) {
      dispatch(updateDoctor({ 
        id: editingDoctor.id, 
        changes: doctorData 
      }))
      toast.success('Doctor updated successfully')
    } else {
      const newDoctor = {
        ...doctorData,
        id: `DOC-${Date.now()}`,
        todayAppointments: 0,
        rating: 0,
      }
      dispatch(addDoctor(newDoctor))
      toast.success('Doctor added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingDoctor(null)
  }

  return (
    <Box>
      <PageHeader
        title="Doctor Management"
        subtitle="Manage doctors, specializations, availability, and schedules"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDoctor}
              sx={{ borderRadius: 2 }}
            >
              Add Doctor
            </Button>
          </motion.div>
        }
      />
      
      <DoctorsTable
        doctors={doctors}
        onEdit={handleEditDoctor}
        onDelete={handleDeleteDoctor}
        onView={handleViewDoctor}
        onToggleStatus={handleToggleStatus}
      />

      <SimpleDoctorForm
        open={showForm}
        doctor={editingDoctor}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}
