import { Box, LinearProgress } from '@mui/material'

export function PageLoader() {
  return (
    <Box sx={{ width: '100%', height: '100svh', display: 'grid', placeItems: 'center' }}>
      <Box sx={{ width: 320 }}>
        <LinearProgress />
      </Box>
    </Box>
  )
}

