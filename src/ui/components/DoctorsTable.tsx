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
  Avatar,
  Rating,
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { type Doctor } from '../../features/doctors/doctorsSlice'

interface DoctorsTableProps {
  doctors: Doctor[]
  onEdit: (doctor: Doctor) => void
  onDelete: (doctorId: string) => void
  onView: (doctorId: string) => void
  onToggleStatus: (doctorId: string, currentStatus: string) => void
}

export function DoctorsTable({ doctors, onEdit, onDelete, onView, onToggleStatus }: DoctorsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [specializationFilter, setSpecializationFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const specializations = useMemo(() => {
    const specs = new Set(doctors.map(d => d.specialization))
    return Array.from(specs)
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.phone.includes(searchTerm)
      
      const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter
      const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter
      
      return matchesSearch && matchesSpecialization && matchesStatus
    })
  }, [doctors, searchTerm, specializationFilter, statusFilter])

  const paginatedDoctors = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredDoctors.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredDoctors, page])

  const totalPages = Math.ceil(filteredDoctors.length / rowsPerPage)

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'error'
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
              placeholder="Search doctors..."
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
              <InputLabel>Specialization</InputLabel>
              <Select
                value={specializationFilter}
                label="Specialization"
                onChange={(e) => setSpecializationFilter(e.target.value)}
              >
                <MenuItem value="all">All Specializations</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Today's Appointments</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDoctors.map((doctor, index) => (
                  <TableRow
                    key={doctor.id}
                    hover
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {doctor.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {doctor.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.specialization}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{doctor.department}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{doctor.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doctor.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {doctor.todayAppointments}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.status}
                        size="small"
                        color={getStatusColor(doctor.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            onClick={() => onView(doctor.id)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(doctor)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={doctor.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            size="small"
                            onClick={() => onToggleStatus(doctor.id, doctor.status)}
                            color={doctor.status === 'ACTIVE' ? 'warning' : 'success'}
                          >
                            {doctor.status === 'ACTIVE' ? <InactiveIcon /> : <ActiveIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(doctor.id)}
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

          {filteredDoctors.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No doctors found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
