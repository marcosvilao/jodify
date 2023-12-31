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
    '& .css-mnn31' : {
      color: theme.jodify_colors._text_white
    },
    '& .css-repss6': {
      color: theme.jodify_colors._text_white,
      borderBottomColor: theme.jodify_colors._text_white,
    },
    '& .css-5d9ji1': {
      color: theme.jodify_colors._text_white,
      borderBottomColor: theme.jodify_colors._text_white,
    },

  })