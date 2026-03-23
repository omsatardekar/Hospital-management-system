import React from 'react'
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material'
import { Medication } from '@mui/icons-material'
import { useAppSelector } from '../../../app/hooks'
import type { Patient } from '../../../features/patients/patientsSlice'

export function PrescriptionHistorySection({ patient }: { patient: Patient }) {
  const prescriptions = useAppSelector(state => state.pharmacy.prescriptions.filter(p => p.patientId === patient.id))
  const allDoctors = useAppSelector(state => state.doctors.items)
  const allMedicines = useAppSelector(state => state.pharmacy.medicines)

  return (
    <Box>
      <Typography variant="h6" mb={2}>Prescription History</Typography>
      
      {prescriptions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }} elevation={0} variant="outlined">
          <Medication sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">No prescriptions found.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {prescriptions.map(rx => {
            const doctor = allDoctors.find(d => d.id === rx.doctorId)
            return (
              <Grid item xs={12} key={rx.id}>
                <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
                  <Box mb={2} display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>Prescription #{rx.id}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Issued on {new Date(rx.createdAt).toLocaleDateString()} by Dr. {doctor?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <List dense disablePadding sx={{ mt: 1 }}>
                    {rx.medicines.map((m, i) => {
                      const medDetails = allMedicines.find(x => x.id === m.medicineId)
                      return (
                        <ListItem key={i} disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Medication fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={medDetails ? medDetails.name : 'Unknown Medicine'}
                            secondary={`Dose: ${m.dose} • Duration: ${m.days} days`}
                          />
                        </ListItem>
                      )
                    })}
                  </List>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
