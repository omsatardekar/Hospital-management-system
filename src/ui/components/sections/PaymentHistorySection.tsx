import React from 'react'
import { Box, Typography, Paper, Grid, Stack, Chip, Divider } from '@mui/material'
import { ReceiptLong, AccountBalanceWallet } from '@mui/icons-material'
import { useAppSelector } from '../../../app/hooks'
import type { Patient } from '../../../features/patients/patientsSlice'

export function PaymentHistorySection({ patient }: { patient: Patient }) {
  const invoices = useAppSelector(state => state.billing.invoices.filter(inv => inv.patientId === patient.id))
  
  const totalSpent = invoices.reduce((sum, inv) => sum + inv.paid, 0)
  const totalDue = invoices.reduce((sum, inv) => sum + (inv.total - inv.paid), 0)

  return (
    <Box>
      <Typography variant="h6" mb={2}>Billing & Payments</Typography>
      
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'success.50' }} elevation={0} variant="outlined">
            <Typography variant="caption" color="success.main" fontWeight={600} textTransform="uppercase">Total Paid</Typography>
            <Typography variant="h5" color="success.dark" fontWeight={700}>₹{totalSpent.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: totalDue > 0 ? 'error.50' : 'grey.50' }} elevation={0} variant="outlined">
            <Typography variant="caption" color={totalDue > 0 ? 'error.main' : 'text.secondary'} fontWeight={600} textTransform="uppercase">Outstanding Due</Typography>
            <Typography variant="h5" color={totalDue > 0 ? 'error.dark' : 'text.primary'} fontWeight={700}>₹{totalDue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {invoices.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }} elevation={0} variant="outlined">
          <AccountBalanceWallet sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">No billing history found.</Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {invoices.map(inv => (
            <Paper key={inv.id} sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} display="flex" alignItems="center" gap={1}>
                    <ReceiptLong fontSize="small" color="action" />
                    Invoice {inv.id.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Generated on {new Date(inv.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip 
                  label={inv.status} 
                  size="small" 
                  color={inv.status === 'PAID' ? 'success' : inv.status === 'PARTIAL' ? 'warning' : inv.status === 'VOID' ? 'default' : 'error'} 
                />
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Items: {inv.items.length}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Total: ₹{inv.total.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}
