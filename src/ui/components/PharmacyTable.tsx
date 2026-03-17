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
  Warning as LowStockIcon,
  Error as OutOfStockIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { type Medicine } from '../../features/pharmacy/pharmacySlice'

interface PharmacyTableProps {
  medicines: Medicine[]
  onEdit: (medicine: Medicine) => void
  onDelete: (medicineId: string) => void
  onAdd: () => void
  onUpdateStock: (medicineId: string, quantity: number) => void
}

export function PharmacyTable({ 
  medicines, 
  onEdit, 
  onDelete, 
  onAdd,
  onUpdateStock 
}: PharmacyTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const categories = useMemo(() => {
    const cats = new Set(medicines.map(m => m.category))
    return Array.from(cats)
  }, [medicines])

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [medicines, searchTerm, categoryFilter, statusFilter])

  const paginatedMedicines = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredMedicines.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredMedicines, page])

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'success'
      case 'LOW':
        return 'warning'
      case 'OUT':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LOW':
        return <LowStockIcon fontSize="small" />
      case 'OUT':
        return <OutOfStockIcon fontSize="small" />
      default:
        return null
    }
  }

  const getStockProgress = (stock: number, reorderLevel: number) => {
    if (stock <= 0) return 0
    if (stock <= reorderLevel) return 25
    return Math.min((stock / (reorderLevel * 2)) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleStockUpdate = (medicineId: string, quantity: number) => {
    if (quantity !== 0) {
      onUpdateStock(medicineId, quantity)
    }
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
              placeholder="Search medicines..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={statusFilter}
                label="Stock Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="OK">In Stock</MenuItem>
                <MenuItem value="LOW">Low Stock</MenuItem>
                <MenuItem value="OUT">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Medicine Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reorder Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock Actions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMedicines.map((medicine) => (
                  <TableRow
                    key={medicine.id}
                    hover
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {medicine.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {medicine.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medicine.category}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {medicine.stock}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={getStockProgress(medicine.stock, medicine.reorderLevel)}
                            sx={{ flexGrow: 1 }}
                            color={medicine.status === 'OK' ? 'success' : medicine.status === 'LOW' ? 'warning' : 'error'}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {new Date(medicine.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {medicine.reorderLevel}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {formatCurrency(medicine.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={medicine.status}
                        size="small"
                        color={getStatusColor(medicine.status) as any}
                        icon={getStatusIcon(medicine.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Add Stock">
                          <IconButton
                            size="small"
                            onClick={() => {
                              const quantity = prompt('Enter quantity to add:', '10')
                              if (quantity) {
                                handleStockUpdate(medicine.id, parseInt(quantity) || 0)
                              }
                            }}
                            color="success"
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Stock">
                          <IconButton
                            size="small"
                            onClick={() => {
                              const quantity = prompt('Enter quantity to remove:', '1')
                              if (quantity) {
                                handleStockUpdate(medicine.id, -(parseInt(quantity) || 0))
                              }
                            }}
                            color="warning"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(medicine)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(medicine.id)}
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

          {filteredMedicines.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No medicines found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
