import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, ToggleButtonGroup, ToggleButton, Stack, Pagination } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import { Add as AddIcon, ViewList, ViewModule } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { PatientsTable } from '../components/PatientsTable'
import { PatientRegistrationForm } from '../components/forms/PatientRegistrationForm'
import { PatientCard } from '../components/PatientCard'
import { PatientDetailsDrawer } from '../components/PatientDetailsDrawer'
import { addPatient, updatePatient, deletePatient, type Patient } from '../../features/patients/patientsSlice'
import toast from 'react-hot-toast'

export default function PatientsPage() {
  const dispatch = useAppDispatch()
  const patients = useAppSelector((state) => state.patients.items)
  const appointments = useAppSelector((state) => state.appointments.items)
  
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any | null>(null)
  
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [page, setPage] = useState(1)
  const pageSize = 12

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * pageSize
    return patients.slice(start, start + pageSize)
  }, [patients, page])

  const totalPages = Math.ceil(patients.length / pageSize)

  const handlePageChange = (evt: React.ChangeEvent<unknown>, val: number) => {
    setPage(val)
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleEditPatient = (patient: any) => {
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
    const p = patients.find(x => x.id === patientId)
    if (p) {
      setSelectedPatient(p)
      setDrawerOpen(true)
    }
  }

  const handleToggleBlock = (patient: Patient) => {
    const newStatus = patient.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED'
    dispatch(updatePatient({ id: patient.id, changes: { status: newStatus } }))
    toast.success(`Patient ${newStatus === 'ACTIVE' ? 'unblocked' : 'blocked'} successfully`)
    
    if (selectedPatient?.id === patient.id) {
      setSelectedPatient({ ...patient, status: newStatus })
    }
  }

  const handleFormSubmit = (patientData: any) => {
    if (editingPatient) {
      dispatch(updatePatient({ 
        id: editingPatient.id, 
        changes: patientData 
      }))
      toast.success('Patient updated successfully')
    } else {
      const newPatient = {
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
        subtitle="Full Intelligence System: Search, history, timelines, and status controls"
        right={
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val)}
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            >
              <ToggleButton value="table"><ViewList fontSize="small" /></ToggleButton>
              <ToggleButton value="grid"><ViewModule fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>

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
          </Stack>
        }
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'table' ? (
            <PatientsTable
              patients={paginatedPatients}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
              onView={handleViewPatient}
            />
          ) : (
            <Grid container spacing={3}>
              {paginatedPatients.map(patient => {
                // Determine if patient has appointment today
                const today = new Date().toISOString().split('T')[0]
                const hasAppt = appointments.some(a => a.patientId === patient.id && a.startAt.startsWith(today))

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
                    <PatientCard 
                      patient={patient} 
                      hasAppointmentToday={hasAppt}
                      onView={handleViewPatient}
                      onEdit={handleEditPatient}
                      onToggleBlock={handleToggleBlock}
                    />
                  </Grid>
                )
              })}
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>

      <Box display="flex" justifyContent="center" mt={4} mb={2}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          shape="rounded"
        />
      </Box>

      <PatientRegistrationForm
        open={showForm}
        patient={editingPatient}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      <PatientDetailsDrawer
        open={drawerOpen}
        patient={selectedPatient}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  )
}

