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
});

export const BtnJo = styled(Button)({
    width: '100%',
    height: '35px',
    border: 'none',
})
    
export const BtnFy = styled(Button)({
    width: '100%',
    height: '35px',
    border: 'none',
})