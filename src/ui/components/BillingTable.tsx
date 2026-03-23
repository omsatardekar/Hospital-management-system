import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Tooltip,
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Payments as PaidIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { type Invoice } from '../../features/billing/billingSlice'
import { useAppSelector } from '../../app/hooks'

interface BillingTableProps {
  invoices: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: (invoiceId: string) => void
  onView: (invoice: Invoice) => void
  onGenerateInvoice: () => void
  onMarkPaid: (invoiceId: string) => void
}

export function BillingTable({ 
  invoices, 
  onEdit, 
  onDelete, 
  onView, 
  onGenerateInvoice,
  onMarkPaid 
}: BillingTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const patients = useAppSelector((state) => state.patients.items)

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const patient = patients.find(p => p.id === invoice.patientId)
      
      const matchesSearch =
        patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.insuranceProvider && invoice.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [invoices, patients, searchTerm, statusFilter])

  const paginatedInvoices = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredInvoices, page])

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success'
      case 'PARTIAL':
        return 'warning'
      case 'DUE':
        return 'error'
      case 'VOID':
        return 'default'
      default:
        return 'default'
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient?.name || 'Unknown Patient'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 250, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="PARTIAL">Partial</MenuItem>
                <MenuItem value="DUE">Due</MenuItem>
                <MenuItem value="VOID">Void</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Paid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Balance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    hover
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {invoice.id}
                        </Typography>
                        {invoice.insuranceProvider && (
                          <Typography variant="caption" color="text.secondary">
                            {invoice.insuranceProvider}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getPatientName(invoice.patientId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {invoice.patientId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(invoice.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(invoice.total)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        {formatCurrency(invoice.paid)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: invoice.total - invoice.paid > 0 ? 'error.main' : 'success.main'
                        }}
                      >
                        {formatCurrency(invoice.total - invoice.paid)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={invoice.status}
                        size="small"
                        color={getStatusColor(invoice.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Invoice">
                          <IconButton
                            size="small"
                            onClick={() => onView(invoice)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(invoice)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {invoice.status === 'DUE' && (
                          <Tooltip title="Mark as Paid">
                            <IconButton
                              size="small"
                              onClick={() => onMarkPaid(invoice.id)}
                              color="success"
                            >
                              <PaidIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(invoice.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}

          {filteredInvoices.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No invoices found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
