import React from 'react'
import { Box, Typography } from '@mui/material'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab'
import { LocalHospital, Edit, Assignment, AttachMoney, Event, CheckCircle } from '@mui/icons-material'
import type { Patient } from '../../../features/patients/patientsSlice'

export function ActivityTimelineSection({ patient }: { patient: Patient }) {
  const getTimelineIcon = (type?: string, title?: string) => {
    if (type === 'APPOINTMENT') return <Event fontSize="small" />
    if (type === 'PAYMENT') return <AttachMoney fontSize="small" />
    if (type === 'STATUS_CHANGE') return <CheckCircle fontSize="small" />
    
    const t = (title || '').toLowerCase()
    if (t.includes('registration')) return <Assignment fontSize="small" />
    if (t.includes('consultation')) return <LocalHospital fontSize="small" />
    return <Edit fontSize="small" />
  }

  const getTimelineColor = (type?: string) => {
    if (type === 'APPOINTMENT') return 'primary'
    if (type === 'PAYMENT') return 'success'
    if (type === 'STATUS_CHANGE') return 'warning'
    return 'grey'
  }

  const sortedTimeline = [...patient.medicalTimeline].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <Box>
      <Typography variant="h6" mb={2}>Activity Timeline</Typography>
      
      {sortedTimeline.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" py={4}>No activity logged for this patient.</Typography>
      ) : (
        <Timeline position="right" sx={{ p: 0 }}>
          {sortedTimeline.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent sx={{ m: 'auto 0', flex: 0.2, minWidth: 100 }} align="right" variant="body2" color="text.secondary">
                {new Date(event.at).toLocaleDateString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: index === 0 ? 'primary.main' : 'grey.300' }} />
                <TimelineDot color={getTimelineColor(event.type) as any}>
                  {getTimelineIcon(event.type, event.title)}
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: 'grey.300' }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Typography variant="subtitle2" component="span" fontWeight={600}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.note}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Box>
  )
}
