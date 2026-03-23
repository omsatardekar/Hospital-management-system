import React from 'react'
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material'
import { useAppSelector } from '../../../app/hooks'
import type { Patient } from '../../../features/patients/patientsSlice'

export function DoctorInteractionSection({ patient }: { patient: Patient }) {
  const allAppointments = useAppSelector(state => state.appointments.items)
  const allDoctors = useAppSelector(state => state.doctors.items)

  // Extract unique doctors visited
  const visitedDoctorIds = Array.from(new Set(allAppointments.filter(a => a.patientId === patient.id).map(a => a.doctorId)))
  const visitedDoctors = visitedDoctorIds.map(id => allDoctors.find(d => d.id === id)).filter(Boolean)
  const primaryDoctor = allDoctors.find(d => d.id === patient.assignedDoctorId)

  return (
    <Box>
      <Typography variant="h6" mb={2}>Primary Physician</Typography>
      {primaryDoctor ? (
        <Paper sx={{ p: 2, borderRadius: 2, mb: 4 }} elevation={0} variant="outlined">
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{primaryDoctor.name.charAt(4)}</Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={primaryDoctor.name} 
                secondary={`${primaryDoctor.specialization} • ${primaryDoctor.department}`} 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          </List>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4, textAlign: 'center' }} elevation={0} variant="outlined">
          <Typography color="text.secondary">No primary physician assigned.</Typography>
        </Paper>
      )}

      <Typography variant="h6" mb={2}>Other Consultations</Typography>
      {visitedDoctors.filter(d => d?.id !== patient.assignedDoctorId).length === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }} elevation={0} variant="outlined">
          <Typography color="text.secondary">No other doctors visited.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 2 }} elevation={0} variant="outlined">
          <List disablePadding>
            {visitedDoctors.filter(d => d?.id !== patient.assignedDoctorId).map((doc, idx, arr) => (
              <React.Fragment key={doc!.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.300', color: 'grey.700' }}>{doc!.name.charAt(4)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={doc!.name} 
                    secondary={doc!.department} 
                  />
                </ListItem>
                {idx < arr.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}
