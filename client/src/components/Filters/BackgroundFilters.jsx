import { Box } from '@mui/material'
import React from 'react'
import theme from '../../jodifyStyles'

function BackgroundFilters({closeDateFilter}) {
  const handleClose = () => {
    closeDateFilter(false)
  }
  return (
    
    <Box
    sx={{
        width: '1200px',
        height: '1000%',
        background: theme.jodify_colors._background_black,
        position: 'fixed',
        opacity: '0.5'
    }}>
      <div 
      onClick={handleClose}
      style={{
        width: '100%',
        height: '100%'
      }} 
      ></div>
    </Box>
  )
}

export default BackgroundFilters