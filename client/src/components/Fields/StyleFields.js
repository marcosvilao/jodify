import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';

export const BasicText = styled(TextField)({
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.jodify_colors._icons_primary,
    },
    '& .MuiInputLabel-root': {
      color: theme.jodify_colors._text_white
    },
    '& .css-1x51dt5-MuiInputBase-input-MuiInput-input': {
      color: theme.jodify_colors._text_white
    },
    '& .css-38raov-MuiButtonBase-root-MuiChip-root': {
      color: theme.jodify_colors._text_white
    },
    '& .css-66dh3a-MuiInputBase-input-MuiInput-input':{
      color: theme.jodify_colors._text_white
    }
  })