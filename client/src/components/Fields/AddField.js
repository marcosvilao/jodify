import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import theme from '../../jodifyStyles';

export default function AddField({label, placeHolder, list}) {

    const Field = styled(TextField)({
        '& .MuiInputLabel-root': {
            color: theme.colors._color_label_violet,
          },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.colors._color_violet_strong,
          }
    })

  return (
    <Stack spacing={3} sx={{ width: '90%', margin: '0 auto', marginTop: '10px' }}>
      <Autocomplete
        freeSolo
        multiple
        id="tags-standard"
        options={list}
        getOptionLabel={(option) => option.title || option}
        renderInput={(params) => (
          <Field
            {...params}
            variant="standard"
            label={label}
            placeholder={placeHolder}
          />
        )}
      />
    </Stack>
  );
}

