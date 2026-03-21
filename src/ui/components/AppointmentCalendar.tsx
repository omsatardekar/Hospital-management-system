import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  NavigateBefore,
  NavigateNext,
  Today,
  Add as AddIcon,
  Event as EventIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

interface AppointmentCalendarProps {
  appointments: any[]
  onEdit: (appointment: any) => void
  onAdd: () => void
}

export function AppointmentCalendar({ appointments, onEdit, onAdd }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getAppointmentsForDay = (day: Date | null) => {
    if (!day) return []
    
    const dayStart = new Date(day)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(day)
    dayEnd.setHours(23, 59, 59, 999)

    return (appointments || []).filter(apt => {
      if (!apt?.startAt) return false
      const aptDate = new Date(apt.startAt)
      return aptDate >= dayStart && aptDate <= dayEnd
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (day: Date | null) => {
    if (!day) return
    const dayAppointments = getAppointmentsForDay(day)
    if (dayAppointments.length > 0) {
      setSelectedAppointment(dayAppointments[0])
      setShowDetails(true)
    } else {
      onAdd()
    }
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'primary'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'error'
      case 'RESCHEDULED': return 'warning'
      default: return 'default'
    }
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Card sx={{ height: '100%', background: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigateMonth('prev')} size="small">
              <NavigateBefore />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', minWidth: 200, textAlign: 'center' }}>
              {formatMonthYear(currentDate)}
            </Typography>
            <IconButton onClick={() => navigateMonth('next')} size="small">
              <NavigateNext />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={goToToday}
              size="small"
            >
              Today
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              Book
            </Button>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Weekday Headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Typography key={day} variant="caption" sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary', py: 1 }}>
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 1, 
            flex: 1 
          }}>
            {days.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day)
              const isToday = day && day.getTime() === today.getTime()
              const isCurrentMonth = day && day.getMonth() === currentDate.getMonth()

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                >
                  <Box
                    onClick={() => handleDayClick(day)}
                    sx={{
                      aspectRatio: 1,
                      border: day ? '1px solid' : 'none',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1,
                      cursor: day ? 'pointer' : 'default',
                      backgroundColor: isToday ? 'primary.main' : isCurrentMonth ? 'background.paper' : 'action.hover',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      '&:hover': day ? {
                        backgroundColor: isToday ? 'primary.dark' : 'action.hover',
                      } : {},
                    }}
                  >
                    {day && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isToday ? 700 : 500,
                            color: isToday ? 'white' : 'text.primary',
                            textAlign: 'center',
                          }}
                        >
                          {day.getDate()}
                        </Typography>
                        {dayAppointments.length > 0 && (
                          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {dayAppointments.slice(0, 2).map((apt, idx) => (
                              <Chip
                                key={idx}
                                label={apt.patientId}
                                size="small"
                                color={getStatusColor(apt.status) as any}
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 16,
                                  '& .MuiChip-label': { padding: '0 4px' }
                                }}
                              />
                            ))}
                            {dayAppointments.length > 2 && (
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
                                +{dayAppointments.length - 2} more
                              </Typography>
                            )}
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </motion.div>
              )
            })}
          </Box>
        </Box>

        {/* Appointment Details Dialog */}
        <Dialog
          open={showDetails}
          onClose={() => setShowDetails(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedAppointment && (
            <>
              <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="primary" />
                Appointment Details
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Reason</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedAppointment.reason}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body2">
                      {new Date(selectedAppointment.startAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Chip 
                      label={selectedAppointment.status} 
                      color={getStatusColor(selectedAppointment.status) as any}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body2">{selectedAppointment.department}</Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    onEdit(selectedAppointment)
                    setShowDetails(false)
                  }}
                >
                  Edit
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}
