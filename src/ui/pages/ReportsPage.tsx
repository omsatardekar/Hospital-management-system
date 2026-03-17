import { Box, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Download as DownloadIcon, Assessment as AssessmentIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useAppSelector } from '../../app/hooks'
import { PageHeader } from '../shared/PageHeader'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('revenue')
  const [timeRange, setTimeRange] = useState('month')

  const invoices = useAppSelector((state) => state.billing.invoices)
  const patients = useAppSelector((state) => state.patients.items)
  const doctors = useAppSelector((state) => state.doctors.items)
  const appointments = useAppSelector((state) => state.appointments.items)

  const revenueData = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt)
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey] += invoice.paid
    })

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6)
  }, [invoices])

  const patientGrowthData = useMemo(() => {
    const monthlyData: Record<string, number> = {}
    
    patients.forEach(patient => {
      const date = new Date(patient.lastVisit)
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0
      }
      monthlyData[monthKey]++
    })

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6)
  }, [patients])

  const doctorPerformanceData = useMemo(() => {
    return doctors.map(doctor => ({
      name: doctor.name.split(' ')[0],
      appointments: doctor.todayAppointments,
      rating: doctor.rating,
    })).slice(0, 8)
  }, [doctors])

  const appointmentStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    
    appointments.forEach(apt => {
      if (!statusCounts[apt.status]) {
        statusCounts[apt.status] = 0
      }
      statusCounts[apt.status]++
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }))
  }, [appointments])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const handleDownloadReport = () => {
    toast.success(`Report downloaded: ${reportType}_report_${timeRange}.pdf`)
  }

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.paid, 0)
  const totalPatients = patients.length
  const totalAppointments = appointments.length
  const avgRating = doctors.length > 0 
    ? doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length 
    : 0

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive reports on revenue, patients, doctor performance, and more"
        right={
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadReport}
              sx={{ borderRadius: 2 }}
            >
              Download Report
            </Button>
          </motion.div>
        }
      />

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                ${totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {totalPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Patients
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                {totalAppointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Appointments
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card sx={{ minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                {avgRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Doctor Rating
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            label="Report Type"
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="revenue">Revenue Report</MenuItem>
            <MenuItem value="patients">Patient Growth</MenuItem>
            <MenuItem value="doctors">Doctor Performance</MenuItem>
            <MenuItem value="appointments">Appointment Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {reportType === 'revenue' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Monthly Revenue
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {reportType === 'patients' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Patient Growth
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={patientGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" name="New Patients" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {reportType === 'doctors' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Doctor Performance
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={doctorPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
                  <Bar dataKey="rating" fill="#82ca9d" name="Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {reportType === 'appointments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Appointment Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  )
}

