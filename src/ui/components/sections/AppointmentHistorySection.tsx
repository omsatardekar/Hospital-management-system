import React, { useState } from 'react'
import { Box, Typography, Paper, Grid, Chip, IconButton, Tooltip } from '@mui/material'
import { Visibility, CalendarMonth } from '@mui/icons-material'
import { useAppSelector } from '../../../app/hooks'
import type { Patient } from '../../../features/patients/patientsSlice'
import type { Appointment } from '../../../features/appointments/appointmentsSlice'
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog'

export function AppointmentHistorySection({ patient }: { patient: Patient }) {
  const allAppointments = useAppSelector(state => state.appointments.items)
  const allDoctors = useAppSelector(state => state.doctors.items)
  
  const patientAppointments = allAppointments
    .filter(a => a.patientId === patient.id)
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null)

  return (
    <Box>
      <Typography variant="h6" mb={2}>Appointment History</Typography>
      
      {patientAppointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }} elevation={0} variant="outlined">
          <CalendarMonth sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">No appointments found for this patient.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {patientAppointments.map(appt => {
            const doctor = allDoctors.find(d => d.id === appt.doctorId)
            return (
              <Grid item xs={12} key={appt.id}>
                <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={0} variant="outlined">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {new Date(appt.startAt).toLocaleDateString()} at {new Date(appt.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Dr. {doctor?.name || 'Unknown'} • {appt.department}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Reason: {appt.reason || 'General Consultation'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip 
                      label={appt.status} 
                      size="small" 
                      color={appt.status === 'COMPLETED' ? 'success' : appt.status === 'CANCELLED' ? 'error' : 'primary'} 
                    />
                    <Tooltip title="View Details">
                      <IconButton onClick={() => setSelectedAppt(appt)} color="info" size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}

      <AppointmentDetailsDialog 
        open={Boolean(selectedAppt)} 
        appointment={selectedAppt} 
        doctor={allDoctors.find(d => d.id === selectedAppt?.doctorId)}
        onClose={() => setSelectedAppt(null)} 
      />
    </Box>
  )
}
