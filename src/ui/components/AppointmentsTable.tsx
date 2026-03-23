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
  CalendarMonth as CalendarIcon,
  EventAvailable as BookIcon,
  EventBusy as CancelIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { type Appointment } from '../../features/appointments/appointmentsSlice'
import { useAppSelector } from '../../app/hooks'

interface AppointmentsTableProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (appointmentId: string) => void
  onBook: () => void
  onReschedule: (appointment: Appointment) => void
  onCancel: (appointmentId: string) => void
}

export function AppointmentsTable({ 
  appointments, 
  onEdit, 
  onDelete, 
  onBook, 
  onReschedule, 
  onCancel 
}: AppointmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const patients = useAppSelector((state) => state.patients.items)
  const doctors = useAppSelector((state) => state.doctors.items)

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patient = patients.find(p => p.id === appointment.patientId)
      const doctor = doctors.find(d => d.id === appointment.doctorId)
      
      const matchesSearch =
        patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
      
      const appointmentDate = new Date(appointment.startAt)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let matchesDate = true
      if (dateFilter === 'today') {
        matchesDate = appointmentDate.toDateString() === today.toDateString()
      } else if (dateFilter === 'upcoming') {
        matchesDate = appointmentDate >= today
      } else if (dateFilter === 'past') {
        matchesDate = appointmentDate < today
      }
      
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [appointments, patients, doctors, searchTerm, statusFilter, dateFilter])

  const paginatedAppointments = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredAppointments.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredAppointments, page])

  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'info'
      case 'COMPLETED':
        return 'success'
      case 'CANCELLED':
        return 'error'
      case 'RESCHEDULED':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId)
    return patient?.name || 'Unknown Patient'
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId)
    return doctor?.name || 'Unknown Doctor'
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
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
              placeholder="Search appointments..."
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
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="all">All Dates</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="past">Past</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    hover
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getPatientName(appointment.patientId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {appointment.patientId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getDoctorName(appointment.doctorId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {appointment.doctorId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDateTime(appointment.startAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          to {formatDateTime(appointment.endAt)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {appointment.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        size="small"
                        color={getStatusColor(appointment.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(appointment)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {appointment.status === 'SCHEDULED' && (
                          <>
                            <Tooltip title="Reschedule">
                              <IconButton
                                size="small"
                                onClick={() => onReschedule(appointment)}
                                color="warning"
                              >
                                <CalendarIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                onClick={() => onCancel(appointment.id)}
                                color="error"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(appointment.id)}
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

          {filteredAppointments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No appointments found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
