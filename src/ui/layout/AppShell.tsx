import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { motion } from 'framer-motion'

export function AppShell() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        ml: '100px',
        transition: 'margin-left 0.3s ease',
        width: '100%',
      }}>
        <Topbar />
        <Box
          component={motion.main}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          sx={{ flex: 1, minWidth: 0, p: 3 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

