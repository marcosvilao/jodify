import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/material';
import theme from '../../jodifyStyles';


function SkeletonLoader() {
    return (
        <Box sx={{width: '90%', margin: '12px auto'}}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '250px', height: '50px', marginBottom: '6px' }} />
          {/* For other variants, adjust the size with `width` and `height` */}
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius }} />
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius  }} />
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius }} />
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius  }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '250px', height: '50px', marginBottom: '6px' }} />
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius }} />
          <Skeleton variant="rounded" sx={{ fontSize: '1rem', background: theme.jodify_colors._background_gray, width: '100%', height: '88px', marginBottom: '8px', borderRadius: theme.jodify_borders._lg_border_radius  }} />
        </Box>
      );
}

export default SkeletonLoader