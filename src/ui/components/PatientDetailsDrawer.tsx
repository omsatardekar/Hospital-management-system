import React, { useState } from 'react'
import { Drawer, Box, Typography, IconButton, Tabs, Tab, Divider, Avatar, Stack, Chip } from '@mui/material'
import { Close } from '@mui/icons-material'
import type { Patient } from '../../features/patients/patientsSlice'

// Sections
import { BasicInfoSection } from './sections/BasicInfoSection'
import { StatusControlSection } from './sections/StatusControlSection'
import { AppointmentHistorySection } from './sections/AppointmentHistorySection'
import { DoctorInteractionSection } from './sections/DoctorInteractionSection'
import { PrescriptionHistorySection } from './sections/PrescriptionHistorySection'
import { PaymentHistorySection } from './sections/PaymentHistorySection'
import { MedicalHistorySection } from './sections/MedicalHistorySection'
import { ActivityTimelineSection } from './sections/ActivityTimelineSection'

type PatientDetailsDrawerProps = {
  open: boolean
  patient: Patient | null
  onClose: () => void
}

export function PatientDetailsDrawer({ open, patient, onClose }: PatientDetailsDrawerProps) {
  const [tabIndex, setTabIndex] = useState(0)

  if (!patient) return null

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'BLOCKED': return 'error'
      case 'ADMITTED': return 'warning'
      case 'IN_TREATMENT': return 'info'
      case 'DISCHARGED': return 'default'
      default: return 'default'
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 600, md: 700 } } }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', bgcolor: 'primary.50' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={patient.avatar} sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '2rem' }}>
            {patient.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>{patient.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {patient.id} • {patient.gender}, {patient.age} yrs • Blood: {patient.bloodGroup}
            </Typography>
            <Chip 
              label={patient.status} 
              size="small" 
              color={getStatusColor(patient.status)} 
              sx={{ fontWeight: 600, mt: 1, height: 24 }} 
            />
          </Box>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'background.paper' }}>
          <Close />
        </IconButton>
      </Box>

      <Tabs 
        value={tabIndex} 
        onChange={(_, val) => setTabIndex(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        <Tab label="Basic Info" />
        <Tab label="Status Control" />
        <Tab label="Appointments" />
        <Tab label="Doctors" />
        <Tab label="Prescriptions" />
        <Tab label="Payments" />
        <Tab label="Medical History" />
        <Tab label="Timeline" />
      </Tabs>

      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
        {tabIndex === 0 && <BasicInfoSection patient={patient} />}
        {tabIndex === 1 && <StatusControlSection patient={patient} />}
        {tabIndex === 2 && <AppointmentHistorySection patient={patient} />}
        {tabIndex === 3 && <DoctorInteractionSection patient={patient} />}
        {tabIndex === 4 && <PrescriptionHistorySection patient={patient} />}
        {tabIndex === 5 && <PaymentHistorySection patient={patient} />}
        {tabIndex === 6 && <MedicalHistorySection patient={patient} />}
        {tabIndex === 7 && <ActivityTimelineSection patient={patient} />}
      </Box>
    </Drawer>
  )
}
