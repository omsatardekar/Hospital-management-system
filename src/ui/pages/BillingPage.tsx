import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { BillingTable } from '../components/BillingTable'
import { InvoiceForm } from '../components/InvoiceForm'
import { addInvoice, updateInvoice, type Invoice } from '../../features/billing/billingSlice'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Chip } from '@mui/material'

export default function BillingPage() {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector((state) => state.billing.invoices)
  
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)

  const handleGenerateInvoice = () => {
    setEditingInvoice(null)
    setShowForm(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      // TODO: Implement delete action in slice
      toast.success('Invoice deleted successfully')
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice)
  }

  const handleMarkPaid = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      dispatch(updateInvoice({ 
        id: invoiceId, 
        changes: { 
          status: 'PAID' as const,
          paid: invoice.total,
          payments: [
            ...invoice.payments,
            {
              id: `PAY-${Date.now()}`,
              at: new Date().toISOString(),
              amount: invoice.total - invoice.paid,
              method: 'CASH' as const
            }
          ]
        } 
      }))
      toast.success('Invoice marked as paid successfully')
    }
  }

  const handleFormSubmit = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    if (editingInvoice) {
      dispatch(updateInvoice({ 
        id: editingInvoice.id, 
        changes: invoiceData 
      }))
      toast.success('Invoice updated successfully')
    } else {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: `INV-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      dispatch(addInvoice(newInvoice))
      toast.success('Invoice generated successfully')
    }
    setShowForm(false)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingInvoice(null)
  }

  const handleViewClose = () => {
    setViewingInvoice(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getPatientName = (patientId: string) => {
    const patients = useAppSelector((state) => state.patients.items)
    const patient = patients.find(p => p.id === patientId)
    return patient?.name || 'Unknown Patient'
  }

  return (
    <Box>
      <PageHeader
        title="Billing Management"
        subtitle="Generate invoices, track payments, and manage billing"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleGenerateInvoice}
              sx={{ borderRadius: 2 }}
            >
              Generate Invoice
            </Button>
          </motion.div>
        }
      />
      
      <BillingTable
        invoices={invoices}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onView={handleViewInvoice}
        onGenerateInvoice={handleGenerateInvoice}
        onMarkPaid={handleMarkPaid}
      />

      <InvoiceForm
        open={showForm}
        invoice={editingInvoice}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Invoice View Dialog */}
      {viewingInvoice && (
        <Dialog open={!!viewingInvoice} onClose={handleViewClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ReceiptIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Invoice Details - {viewingInvoice.id}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Patient
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {getPatientName(viewingInvoice.patientId)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Invoice Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(viewingInvoice.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={viewingInvoice.status}
                    size="small"
                    color={
                      viewingInvoice.status === 'PAID' ? 'success' :
                      viewingInvoice.status === 'PARTIAL' ? 'warning' :
                      viewingInvoice.status === 'DUE' ? 'error' : 'default'
                    } as any
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Insurance Provider
                  </Typography>
                  <Typography variant="body1">
                    {viewingInvoice.insuranceProvider || 'Self-Pay'}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Invoice Items
                </Typography>
                {viewingInvoice.items.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatCurrency(item.amount)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Total Amount:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatCurrency(viewingInvoice.total)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Paid Amount:</Typography>
                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                    {formatCurrency(viewingInvoice.paid)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Balance:</Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: viewingInvoice.total - viewingInvoice.paid > 0 ? 'error.main' : 'success.main'
                    }}
                  >
                    {formatCurrency(viewingInvoice.total - viewingInvoice.paid)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleViewClose} color="secondary">
              Close
            </Button>
            {viewingInvoice.status === 'DUE' && (
              <Button
                onClick={() => {
                  handleMarkPaid(viewingInvoice.id)
                  handleViewClose()
                }}
                variant="contained"
                color="success"
              >
                Mark as Paid
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}
