import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';

export const DayPick = styled(DatePicker)({
    display: 'flex',
    width: '90%',
    '& .css-i4bv87-MuiSvgIcon-root': {
        fill: 'white'
    },
    '& .css-1d1r5q-MuiFormHelperText-root':{
        color: 'white'
    }
})
