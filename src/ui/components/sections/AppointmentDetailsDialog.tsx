import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Divider, Chip } from '@mui/material'
import type { Appointment } from '../../../features/appointments/appointmentsSlice'
import type { Doctor } from '../../../features/doctors/doctorsSlice'

type AppointmentDetailsDialogProps = {
  open: boolean
  appointment: Appointment | null
  doctor: Doctor | undefined
  onClose: () => void
}

export function AppointmentDetailsDialog({ open, appointment, doctor, onClose }: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Appointment Details</DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Date & Time</Typography>
              <Typography variant="body1" fontWeight={500}>
                {new Date(appointment.startAt).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Box mt={0.5}>
                <Chip 
                  label={appointment.status} 
                  size="small" 
                  color={appointment.status === 'COMPLETED' ? 'success' : appointment.status === 'CANCELLED' ? 'error' : 'primary'} 
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box mb={3}>
          <Typography variant="caption" color="text.secondary">Doctor Info</Typography>
          <Typography variant="body1" fontWeight={500}>{doctor?.name || 'Unknown Doctor'}</Typography>
          <Typography variant="body2" color="text.secondary">{appointment.department} • {doctor?.specialization}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={3}>
          <Typography variant="caption" color="text.secondary">Reason for Visit</Typography>
          <Typography variant="body1">{appointment.reason || 'General Consultation'}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">Clinical Notes (Auto-generated representation)</Typography>
          <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1, fontStyle: 'italic' }}>
            Patient attended the clinic for {appointment.reason || 'General Consultation'}. Vitals stable. Advised follow-up if symptoms persist.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="inherit" disableElevation>Close Details</Button>
      </DialogActions>
    </Dialog>
  )
}
