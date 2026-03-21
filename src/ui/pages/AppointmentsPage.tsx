import { useState } from 'react'
import { Box, Button, Tabs, Tab, Typography } from '@mui/material'
import { Add as AddIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { AppointmentsTable } from '../components/AppointmentsTable'
import { SimpleAppointmentForm } from '../components/forms/SimpleAppointmentForm'
import { AppointmentCalendar } from '../components/AppointmentCalendar'
import { addAppointment, updateAppointment } from '../../features/appointments/appointmentsSlice'
import toast from 'react-hot-toast'

export default function AppointmentsPage() {
  const dispatch = useAppDispatch()
  const appointments = useAppSelector((state) => state.appointments?.items || [])
  
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  const handleBookAppointment = () => {
    setEditingAppointment(null)
    setShowForm(true)
  }

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleDeleteAppointment = (_appointmentId: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      toast.success('Appointment deleted successfully')
    }
  }

  const handleRescheduleAppointment = (appointment: any) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(updateAppointment({ 
        id: appointmentId, 
        changes: { status: 'CANCELLED' } 
      }))
      toast.success('Appointment cancelled successfully')
    }
  }

  const handleFormSubmit = (appointmentData: any) => {
    if (editingAppointment) {
      const status = editingAppointment.status === appointmentData.status 
        ? appointmentData.status 
        : 'RESCHEDULED'
      
      dispatch(updateAppointment({ 
        id: editingAppointment.id, 
        changes: { ...appointmentData, status } 
      }))
      toast.success('Appointment updated successfully')
    } else {
      const newAppointment = {
        ...appointmentData,
        id: `APT-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      dispatch(addAppointment(newAppointment))
      toast.success('Appointment booked successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingAppointment(null)
  }

  return (
    <Box>
      <PageHeader
        title="Appointment Management"
        subtitle="Book, reschedule, and manage patient appointments"
        right={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
                sx={{ borderRadius: 2 }}
              >
                {viewMode === 'table' ? 'Calendar View' : 'Table View'}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleBookAppointment}
                sx={{ borderRadius: 2 }}
              >
                Book Appointment
              </Button>
            </motion.div>
          </Box>
        }
      />
      
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={viewMode}
          onChange={(_, newValue) => setViewMode(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Table View" value="table" />
          <Tab label="Calendar View" value="calendar" />
        </Tabs>
      </Box>

      {viewMode === 'table' ? (
        appointments && appointments.length > 0 ? (
          <AppointmentsTable
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
            onReschedule={handleRescheduleAppointment}
            onCancel={handleCancelAppointment}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "Book Appointment" to create your first appointment
            </Typography>
          </Box>
        )
      ) : (
        <AppointmentCalendar
          appointments={appointments || []}
          onEdit={handleEditAppointment}
          onAdd={handleBookAppointment}
        />
      )}

      <SimpleAppointmentForm
        open={showForm}
        appointment={editingAppointment}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </Box>
  )
}
