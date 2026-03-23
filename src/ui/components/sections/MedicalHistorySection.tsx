import React from 'react'
import { Box, Typography, Paper, Chip, Stack } from '@mui/material'
import type { Patient } from '../../../features/patients/patientsSlice'

export function MedicalHistorySection({ patient }: { patient: Patient }) {
  return (
    <Box>
      <Typography variant="h6" mb={2}>Medical Context</Typography>
      
      <Box mb={4}>
        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" mb={1} fontWeight={600}>Known Allergies</Typography>
        {patient.allergies && patient.allergies.length > 0 ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {patient.allergies.map(allergy => (
              <Chip key={allergy} label={allergy} color="error" variant="outlined" size="small" />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">No known allergies logged.</Typography>
        )}
      </Box>

      <Box mb={4}>
        <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" mb={1} fontWeight={600}>Chronic Diseases / Conditions</Typography>
        {patient.diseases && patient.diseases.length > 0 ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {patient.diseases.map(disease => (
              <Chip key={disease} label={disease} color="warning" variant="outlined" size="small" />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">No chronic conditions logged.</Typography>
        )}
      </Box>

      <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" mb={1} fontWeight={600}>Clinical Notes</Typography>
      <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }} elevation={0} variant="outlined">
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
          {/* Mock clinical notes for illustration since it doesn't exist explicitly in the schema yet */}
          Patient generally healthy. Blood pressure normal during last visit. 
          Advised to continue regular exercise and maintain a balanced diet. 
          No immediate surgical interventions required. 
          Follow up check in 6 months.
        </Typography>
      </Paper>
    </Box>
  )
}
