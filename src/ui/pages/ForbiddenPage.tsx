import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '60svh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: 'min(520px, 100%)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Access Denied
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.75 }}>
            Your role does not have permission to access this module.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

