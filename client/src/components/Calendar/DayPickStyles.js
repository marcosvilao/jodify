import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';

export const DayPick = styled(DatePicker)({
  background: theme.jodify_colors._background_black,
    color: theme.jodify_colors._text_white,
    display: 'flex',
    width: '90%',
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.jodify_colors._icons_primary,
      },
      '& .MuiInputLabel-root': {
        color: theme.jodify_colors._text_white,
      },
      '& .css-1x51dt5-MuiInputBase-input-MuiInput-input': {
        color: theme.jodify_colors._text_white,
      },
      '& .css-i4bv87-MuiSvgIcon-root': {
        fill: theme.jodify_colors._text_white
      }
})
