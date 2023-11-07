import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';


export default function EditField({label, placeHolder, isDisabled}) {

  const BasicText = styled(TextField)({
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.colors._color_violet_strong,
    },
    '& .MuiInputLabel-root': {
      color: theme.colors._color_label_violet,
    },
  })
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { width: '90%', display: 'flex', justifyContent: 'center', margin: '0 auto', marginTop: '10px'},
      }}
      noValidate
      autoComplete="off"
    >
          <BasicText
          id="standard-textarea"
          label={label}
          placeholder={placeHolder}
          multiline
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon/>
              </InputAdornment>
            ),
          }}
        />
    </Box>
  );
}
