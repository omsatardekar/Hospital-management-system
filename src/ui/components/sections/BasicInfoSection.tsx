import React from 'react'
import { Box, Typography, Grid, Paper, Divider } from '@mui/material'
import type { Patient } from '../../../features/patients/patientsSlice'

export function BasicInfoSection({ patient }: { patient: Patient }) {
  const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Box mb={2}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={600}>{label}</Typography>
      <Typography variant="body1" fontWeight={500}>{value || '—'}</Typography>
    </Box>
  )

  return (
    <Box>
      <Typography variant="h6" mb={2}>Patient Demographics</Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem label="Full Name" value={patient.name} />
            <InfoItem label="Age & Gender" value={`${patient.age} years, ${patient.gender}`} />
            <InfoItem label="Blood Group" value={patient.bloodGroup} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem label="Contact Number" value={patient.phone} />
            <InfoItem label="Email Address" value={patient.email} />
            <InfoItem label="Residential Address" value={patient.address} />
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h6" mt={4} mb={2}>Registration Details</Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoItem label="Patient ID" value={patient.id} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem label="Last Visit" value={new Date(patient.lastVisit).toLocaleDateString()} />
          </Grid>
          <Grid item xs={12}>
            <InfoItem label="Department" value={patient.department} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
