import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box } from '@mui/material';
import theme from '../../jodifyStyles';
import { DateRange } from './JodifyDatePickerStyles';
import { useState} from 'react';
import esLocale from 'date-fns/locale/es';




export default function JodifyDatePicker({setOpen, setIsOpen, setDateFilter, setDefaultValues}) {
  const [dates, setDates] = useState(setDefaultValues)
  const defaultDates = setDefaultValues.length > 0 ? setDefaultValues.map(date => dayjs(date)) : undefined
  const getDates = (value) => {
      if(!value[0] && !value[1]){
        return
      }
      if(!value[1]){
        value[1] = value[0]
      }
      setDateFilter(value);
      setIsOpen(false);
  };

  return (
    


            <Box
            sx={{zIndex: '3',position: 'absolute', marginTop: '60vh', marginLeft: '5%'}}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs} locale={esLocale}>
              <DateRange
              disablePast
              localeText={{ start: 'Inicio', end: 'Fin' }}
              locale={esLocale}
              label="disabled"
              toolbarTitle="Seleccionar rango de fechas"
              disableHighlightToday={true}
              onChange={(value) => setDates([value[0]?.$d, value[1]?.$d])}
              onClose={() => setIsOpen(false)}
              onAccept={() => getDates(dates)}
              defaultValue={defaultDates}
              sx={{ fontSize: '16px', color: theme.jodify_colors._text_white , bgcolor: theme.jodify_colors._background_gray, borderRadius: theme.jodify_borders._lg_border_radius }}
            />
            </LocalizationProvider>
            </Box>


      
  );
}