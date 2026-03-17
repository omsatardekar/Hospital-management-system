import { useState, useMemo } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Avatar,
} from '@mui/material'
import {
  Search as SearchIcon,
  PersonAdd as AddUserIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  LocalHospital as MedicalIcon,
  Science as LabIcon,
  Medication as PharmacyIcon,
  Event as AppointmentIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import { type AuditEvent } from '../../features/audit/auditSlice'

export default function AuditLogsPage() {
  const events = useAppSelector((state) => state.audit.events)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const actionTypes = useMemo(() => {
    const types = new Set(events.map(e => e.action))
    return Array.from(types)
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.entity.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAction = actionFilter === 'all' || event.action === actionFilter
      
      return matchesSearch && matchesAction
    })
  }, [events, searchTerm, actionFilter])

  const paginatedEvents = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredEvents.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredEvents, page])

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage)

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE') || action.includes('ADD')) return <AddUserIcon />
    if (action.includes('UPDATE') || action.includes('EDIT')) return <EditIcon />
    if (action.includes('DELETE')) return <DeleteIcon />
    if (action.includes('PAYMENT') || action.includes('INVOICE')) return <PaymentIcon />
    if (action.includes('PATIENT')) return <MedicalIcon />
    if (action.includes('LAB')) return <LabIcon />
    if (action.includes('PHARMACY') || action.includes('MEDICINE')) return <PharmacyIcon />
    if (action.includes('APPOINTMENT')) return <AppointmentIcon />
    return <EditIcon />
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('ADD')) return 'success'
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'info'
    if (action.includes('DELETE')) return 'error'
    if (action.includes('PAYMENT')) return 'warning'
    return 'default'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Box>
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activities, user actions, and data changes"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search audit logs..."
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Action Type</InputLabel>
          <Select
            value={actionFilter}
            label="Action Type"
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <MenuItem value="all">All Actions</MenuItem>
            {actionTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>View</InputLabel>
          <Select
            value={viewMode}
            label="View"
            onChange={(e) => setViewMode(e.target.value as 'table' | 'timeline')}
          >
            <MenuItem value="table">Table</MenuItem>
            <MenuItem value="timeline">Timeline</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Entity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEvents.map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(event.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {event.actorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {event.actorUserId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getActionIcon(event.action)}
                            label={event.action}
                            size="small"
                            color={getActionColor(event.action) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.entity}
                          </Typography>
                          {event.entityId && (
                            <Typography variant="caption" color="text.secondary">
                              ID: {event.entityId}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {event.meta && (
                            <Typography variant="caption" color="text.secondary">
                              {JSON.stringify(event.meta).slice(0, 50)}...
                            </Typography>
                          )}
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

              {filteredEvents.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No audit logs found matching your criteria
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paginatedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Avatar sx={{ bgcolor: `${getActionColor(event.action)}.main`, width: 40, height: 40 }}>
                        {getActionIcon(event.action)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {event.action}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.entity} {event.entityId && `(ID: ${event.entityId})`}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          by <strong>{event.actorName}</strong>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.createdAt)}
                        </Typography>
                        {event.meta && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Details: {JSON.stringify(event.meta).slice(0, 100)}...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {filteredEvents.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No audit logs found matching your criteria
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  )
}

