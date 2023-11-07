import React from 'react'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import './buttonStyles.css'
import theme from '../../jodifyStyles';


export default function BasicButtons({moveBack, moveFoward}) {

  const BtnJo = styled(Button)({
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

  const BtnFy = styled(Button)({
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
  
  return (
    <Stack spacing={1} direction="row" className='btnContainer'>
      <BtnJo variant="outlined">{moveBack.toLowerCase()}</BtnJo>
      <BtnFy variant="contained">{moveFoward}</BtnFy>
    </Stack>
  );
}