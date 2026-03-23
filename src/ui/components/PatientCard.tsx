import React from 'react'
import { Card, Box, Typography, Avatar, Chip, IconButton, Stack, Tooltip, Divider } from '@mui/material'
import { Visibility, Edit, Block, CheckCircle, Event as EventIcon, LocalHospital } from '@mui/icons-material'
import type { Patient } from '../../features/patients/patientsSlice'

type PatientCardProps = {
  patient: Patient
  hasAppointmentToday?: boolean
  onView: (id: string) => void
  onEdit: (patient: Patient) => void
  onToggleBlock: (patient: Patient) => void
}

export function PatientCard({ patient, hasAppointmentToday, onView, onEdit, onToggleBlock }: PatientCardProps) {
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
    <Card sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: 3, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src={patient.avatar} 
            sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem' }}
          >
            {patient.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: 180 }}>
              {patient.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.gender}, {patient.age} yrs • {patient.bloodGroup}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Chip 
          label={patient.status} 
          size="small" 
          color={getStatusColor(patient.status)} 
          sx={{ fontWeight: 500, height: 24 }} 
        />
        {hasAppointmentToday && (
          <Tooltip title="Appointment Scheduled Today">
            <Chip 
              icon={<EventIcon fontSize="small" />} 
              label="Today" 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ height: 24 }} 
            />
          </Tooltip>
        )}
      </Stack>

      <Box sx={{ flexGrow: 1 }} />

      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LocalHospital sx={{ fontSize: 16, mr: 0.5 }} />
        Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
      </Typography>

      <Divider sx={{ mb: 1, mx: -2 }} />

      <Box display="flex" justifyContent="space-between" pt={1}>
        <Tooltip title={patient.status === 'BLOCKED' ? 'Unblock Patient' : 'Block Patient'}>
          <IconButton onClick={() => onToggleBlock(patient)} color={patient.status === 'BLOCKED' ? 'success' : 'error'} size="small">
            {patient.status === 'BLOCKED' ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Details">
            <IconButton onClick={() => onEdit(patient)} size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Full Profile">
            <IconButton onClick={() => onView(patient.id)} size="small" color="info" sx={{ bgcolor: 'info.soft' }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Card>
  )
}
