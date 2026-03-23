import React from 'react'
import { Box, Typography, Paper, Button, Stack, Alert } from '@mui/material'
import { Block, CheckCircle, AssignmentInd, HowToReg, LocalHotel } from '@mui/icons-material'
import { useAppDispatch } from '../../../app/hooks'
import { updatePatient } from '../../../features/patients/patientsSlice'
import type { Patient } from '../../../features/patients/patientsSlice'
import toast from 'react-hot-toast'

export function StatusControlSection({ patient }: { patient: Patient }) {
  const dispatch = useAppDispatch()

  const handleUpdateStatus = (newStatus: Patient['status']) => {
    dispatch(updatePatient({ id: patient.id, changes: { status: newStatus } }))
    toast.success(`Patient status updated to ${newStatus}`)
  }

  const isBlocked = patient.status === 'BLOCKED'

  return (
    <Box>
      <Typography variant="h6" mb={2}>Access Control</Typography>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }} elevation={0} variant="outlined">
        {isBlocked ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            This patient is currently blocked from accessing services or booking new appointments.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            This patient has active access to hospital services.
          </Alert>
        )}
        
        <Button 
          variant="contained" 
          color={isBlocked ? 'success' : 'error'}
          startIcon={isBlocked ? <CheckCircle /> : <Block />}
          onClick={() => handleUpdateStatus(isBlocked ? 'ACTIVE' : 'BLOCKED')}
        >
          {isBlocked ? 'Unblock Patient' : 'Block Patient'}
        </Button>
      </Paper>

      <Typography variant="h6" mb={2}>Treatment Status</Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Typography variant="body2" color="text.secondary" mb={3}>
          Update the clinical administrative status for this patient.
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button 
            variant={patient.status === 'ACTIVE' ? 'contained' : 'outlined'} 
            color="success"
            startIcon={<HowToReg />}
            onClick={() => handleUpdateStatus('ACTIVE')}
          >
            Mark as Active
          </Button>
          <Button 
            variant={patient.status === 'ADMITTED' ? 'contained' : 'outlined'} 
            color="warning"
            startIcon={<LocalHotel />}
            onClick={() => handleUpdateStatus('ADMITTED')}
          >
            Admit Patient
          </Button>
          <Button 
            variant={patient.status === 'DISCHARGED' ? 'contained' : 'outlined'} 
            color="info"
            startIcon={<AssignmentInd />}
            onClick={() => handleUpdateStatus('DISCHARGED')}
          >
            Discharge
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
