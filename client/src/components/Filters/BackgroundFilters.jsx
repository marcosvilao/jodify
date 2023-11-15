import { Box } from '@mui/material'
import React from 'react'
import theme from '../../jodifyStyles'

function BackgroundFilters() {
  return (
    <Box
    sx={{
        width: '1200px',
        height: '1400px',
        background: theme.jodify_colors._background_black,
        position: 'fixed',
        opacity: '0.5'
    }}>
    </Box>
  )
}

export default BackgroundFilters