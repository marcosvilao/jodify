import { Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DayPick } from '../components/Calendar/DayPickStyles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, {useState} from 'react'

function FilterDate() {
   
  const [first, setfirst] = useState('')  

  return (
    <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DayPick 
              label="Fecha del evento"
              slotProps={{ textField: { variant: 'standard' } }}
              value={'2022-04-17'}
              onChange={(value) => setfirst(value)}
              format="MM/DD/YYYY"
            />
        </LocalizationProvider>
    </Box>
  )
}

export default FilterDate