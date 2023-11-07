import * as React from 'react';
import Box from '@mui/material/Box';


export default function BoxDiv() {

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { width: '90%', display: 'flex', justifyContent: 'center', margin: '0 auto', marginTop: '10px'},
      }}
      noValidate
      autoComplete="off"
    >  
    </Box>
  );
}