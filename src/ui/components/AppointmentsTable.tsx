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
  EventBusy as CancelIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useAppSelector } from '../../app/hooks'

interface AppointmentsTableProps {
  appointments: any[]
  onEdit: (appointment: any) => void
  onDelete: (appointmentId: string) => void
  onReschedule: (appointment: any) => void
  onCancel: (appointmentId: string) => void
}

export function AppointmentsTable({ 
  appointments, 
  onEdit, 
  onDelete, 
  onReschedule, 
  onCancel 
}: AppointmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const patients = useAppSelector((state) => state.patients?.items || [])
  const doctors = useAppSelector((state) => state.doctors?.items || [])

  const filteredAppointments = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) return []
    
    return appointments.filter((appointment) => {
      if (!appointment) return false
      const patient = patients.find(p => p?.id === appointment.patientId)
      const doctor = doctors.find(d => d?.id === appointment.doctorId)
      
      const matchesSearch =
        patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'primary'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'error'
      case 'RESCHEDULED': return 'warning'
      default: return 'default'
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p?.id === patientId)
    return patient?.name || 'Unknown Patient'
  }

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d?.id === doctorId)
    return doctor?.name || 'Unknown Doctor'
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="RESCHEDULED">Rescheduled</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="past">Past</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {getPatientName(appointment.patientId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {getDoctorName(appointment.doctorId)}
                      </Typography>
                    </TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>
                      {new Date(appointment.startAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(appointment)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reschedule">
                        <IconButton
                          size="small"
                          onClick={() => onReschedule(appointment)}
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
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(appointment.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredAppointments.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
