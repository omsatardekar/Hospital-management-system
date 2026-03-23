import { Box, Typography } from '@mui/material'

export function PageHeader(props: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        mb: 2.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
          {props.title}
        </Typography>
        {props.subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.25 }}>
            {props.subtitle}
          </Typography>
        )}
      </Box>
      {props.right}
    </Box>
  )
}

