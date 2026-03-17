import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { PatientsTable } from '../components/PatientsTable'
import { PatientForm } from '../components/PatientForm'
import { addPatient, updatePatient, deletePatient, type Patient } from '../../features/patients/patientsSlice'
import toast from 'react-hot-toast'

export default function PatientsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const patients = useAppSelector((state) => state.patients.items)
  
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const handleAddPatient = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(patientId))
      toast.success('Patient deleted successfully')
    }
  }

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`)
  }

  const handleFormSubmit = (patientData: Omit<Patient, 'id' | 'medicalTimeline' | 'reports'>) => {
    if (editingPatient) {
      dispatch(updatePatient({ 
        id: editingPatient.id, 
        changes: patientData 
      }))
      toast.success('Patient updated successfully')
    } else {
      const newPatient: Patient = {
        ...patientData,
        id: `PAT-${Date.now()}`,
        medicalTimeline: [],
        reports: [],
      }
      dispatch(addPatient(newPatient))
      toast.success('Patient added successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingPatient(null)
  }

  return (
    <Box>
      <PageHeader
        title="Patient Management"
        subtitle="Search, filters, pagination, profile + medical history"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPatient}
              sx={{ borderRadius: 2 }}
            >
              Add Patient
            </Button>
          </motion.div>
        }
      />
      
      <PatientsTable
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onView={handleViewPatient}
      />

      <PatientForm
        open={showForm}
        patient={editingPatient}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}

