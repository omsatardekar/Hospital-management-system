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
  LinearProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
  Assignment as TestIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { type LabTest, type LabStatus } from '../../features/lab/labSlice'
import { useAppSelector } from '../../app/hooks'

interface LabTestsTableProps {
  tests: LabTest[]
  onEdit: (test: LabTest) => void
  onDelete: (testId: string) => void
  onUploadReport: (testId: string) => void
  onViewResults: (test: LabTest) => void
}

export function LabTestsTable({ 
  tests, 
  onEdit, 
  onDelete, 
  onUploadReport,
  onViewResults 
}: LabTestsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const patients = useAppSelector((state) => state.patients.items)
  const doctors = useAppSelector((state) => state.doctors.items)

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const patient = patients.find(p => p.id === test.patientId)
      const doctor = doctors.find(d => d.id === test.requestedByDoctorId)
      
      const matchesSearch =
        patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || test.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [tests, patients, doctors, searchTerm, statusFilter])

  const paginatedTests = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredTests.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredTests, page])

  const totalPages = Math.ceil(filteredTests.length / rowsPerPage)

  const getStatusColor = (status: LabStatus) => {
    switch (status) {
      case 'REQUESTED':
        return 'info'
      case 'COLLECTED':
        return 'warning'
      case 'PROCESSING':
        return 'primary'
      case 'REPORTED':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusProgress = (status: LabStatus) => {
    switch (status) {
      case 'REQUESTED':
        return 25
      case 'COLLECTED':
        return 50
      case 'PROCESSING':
        return 75
      case 'REPORTED':
        return 100
      default:
        return 0
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
              placeholder="Search lab tests..."
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
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="COLLECTED">Collected</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="REPORTED">Reported</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Test Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requested By</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requested Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reports</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTests.map((test) => (
                  <TableRow
                    key={test.id}
                    hover
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TestIcon color="primary" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {test.testName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {test.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getPatientName(test.patientId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getDoctorName(test.requestedByDoctorId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(test.requestedAt).toLocaleDateString()}
                      </Typography>
                      {test.reportedAt && (
                        <Typography variant="caption" color="success.main">
                          Reported: {new Date(test.reportedAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 100 }}>
                        <LinearProgress
                          variant="determinate"
                          value={getStatusProgress(test.status)}
                          sx={{ mb: 1 }}
                          color={getStatusColor(test.status) as any}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {getStatusProgress(test.status)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={test.status}
                        size="small"
                        color={getStatusColor(test.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {test.reportFiles.length}
                        </Typography>
                        {test.reportFiles.length > 0 && (
                          <Tooltip title="View Results">
                            <IconButton
                              size="small"
                              onClick={() => onViewResults(test)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(test)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {test.status !== 'REPORTED' && (
                          <Tooltip title="Upload Report">
                            <IconButton
                              size="small"
                              onClick={() => onUploadReport(test.id)}
                              color="success"
                            >
                              <UploadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(test.id)}
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

          {filteredTests.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No lab tests found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
