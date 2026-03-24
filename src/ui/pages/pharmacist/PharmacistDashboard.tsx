import { Typography, Container, Paper } from '@mui/material'
import LocalPharmacyRoundedIcon from '@mui/icons-material/LocalPharmacyRounded'

export default function PharmacistDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '2px dashed #22c55e',
        }}
      >
        <LocalPharmacyRoundedIcon sx={{ fontSize: 100, color: '#22c55e', mb: 4 }} />
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#166534', mb: 2 }}>
          Hello Pharmacist!
        </Typography>
        <Typography variant="h6" sx={{ color: '#15803d', textAlign: 'center', maxWidth: 600 }}>
          Your specialized terminal for medicine inventory and prescription management is currently being prepared by the clinical engineering team.
        </Typography>
      </Paper>
    </Container>
  )
}
