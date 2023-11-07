import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';
import Button from '@mui/material/Button';


export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});
  
export const UploadBtn = styled(Button)({
    marginTop: '40px',
    width: '100%',
    backgroundColor: theme.colors._color_background_button,
    color: theme.colors._color_text_primary,
    '&:hover': {
    backgroundColor: theme.colors._color_background_button, // Change to the desired hover background color
    color: theme.colors._color_text_primary, // Change to the desired hover text color
    },
});

export const BtnJo = styled(Button)({
    width: '100%',
    height: '35px',
    color: theme.colors._color_violet_strong,
    backgroundColor: theme.colors._color_violet_light,
    border: 'none',
    '&:hover': {
    backgroundColor: theme.colors._color_violet_light,
    color: theme.colors._color_violet_strong,
    border: 'none'
    }
})
    
export const BtnFy = styled(Button)({
    width: '100%',
    height: '35px',
    color: '#FFFFFF',
    backgroundColor: '#902BBB',
    border: 'none',
    '&:hover': {
    color: '#FFFFFF',
    backgroundColor: '#902BBB',
    border: 'none'
    }
})