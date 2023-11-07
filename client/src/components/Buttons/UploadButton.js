import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../jodifyStyles';
import { Box } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
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

const UploadBtn = styled(Button)({
    marginTop: '40px',
    width: '100%',
    backgroundColor: theme.colors._color_background_button,
    color: theme.colors._color_text_primary,
    '&:hover': {
        backgroundColor: theme.colors._color_background_button, // Change to the desired hover background color
        color: theme.colors._color_text_primary, // Change to the desired hover text color
      },
  });

export default function UploadButton({label}) {
  return (
    <Box
    sx={{
        marginTop: '10px',
        width: '90%',
        margin: '0 auto'
      }}>
        <UploadBtn component="label" variant="contained" startIcon={<AddIcon />}>
        {label}
        <VisuallyHiddenInput type="file" />
        </UploadBtn>
    </Box>
    
  );
}