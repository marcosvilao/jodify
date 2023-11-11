import React, { useState } from 'react'
import { Box } from '@mui/material'
import { BasicText } from '../components/Fields/StyleFields'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import { BtnJo, BtnFy } from '../components/Buttons/ButtonStyles'
import Stack from '@mui/material/Stack';
import '../components/Buttons/buttonStyles.css'
import { useEffect } from 'react';
import Event from '../components/Event-card/Event';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchCities, fetchTypes } from '../storage/actions';
import dayjs from 'dayjs';
import { UploadBtn } from '../components/Buttons/ButtonStyles';
import { VisuallyHiddenInput } from '../components/Buttons/ButtonStyles';
import AddIcon from '@mui/icons-material/Add';
import theme from '../jodifyStyles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { DateField } from '@mui/x-date-pickers/DateField';
import {DayPick} from '../components/Calendar/DayPickStyles'






const Djs = [
'Solomun',
'Tale of us',
'Guy J',
'Charlotte De Witte',
'Miss Monique',
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function CreateForm() {

  const custom = createTheme({
    palette: {
      jodify: {
        main: theme.jodify_colors._background_gray,
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: theme.jodify_colors._text_white,
      },
    },
  });


  const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [cities, setCities] = useState([])
  const [types, setTypes] = useState([])
  const [link, setlink] = useState('')
  const [fetchedData, setFetchedData] = useState({
    date: null,
    image: null
  })
  const [event, setEvent] = useState({
      event_title: '',
      event_type: [],
      event_date: '',
      event_location: '',
      ticket_link: '',
      event_image: '',
      event_djs: [],
      event_city: ''
  })

 
  useEffect(() => {
    // Check if any of the required properties are empty
    const isRequiredEmpty =
      event.event_title === '' ||
      event.event_date === '' ||
      event.event_location === '' ||
      event.event_city === '' ||
      event.event_type.length === 0 ||
      event.ticket_link === '' ||
      event.event_image === '' ||
      event.event_djs.length === 0
  
    // Set the disabled state based on the condition
    setCreateButtonDisabled(isRequiredEmpty);
  }, [event]);

  const [isLoading, setIsLoading] = useState(false)
  const searchLinkData = async () => {
      setIsLoading(true)
    try {
      const response = await fetch('https://jodify.vercel.app/get-event-data', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setFetchedData(responseData);
        setIsLoading(false)
        setSuccess(true)
        setEvent({
          event_title: event.event_city,
          event_type: [],
          event_date: '',
          event_location: '',
          ticket_link: '',
          event_image: '',
          event_djs: [],
          event_city: ''
        });
      } else {
        console.log('something wrong happend')
        setIsLoading(false)
        setError(true)
      }
    } catch (error) {
      setIsLoading(false)
      setError(true)
      console.log(error)
    }
  }

  const createEvent = async () => {
    setIsLoading(true)
  try {
    const response = await fetch('https://jodify.vercel.app/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({event}),
    });

    if (response.ok) {
      setErrorMessage('')
      setIsLoading(false)
      setCreateSuccess(true)
      handleClearEvent()
    } else if(response.status === 404) {
      setErrorMessage('Este evento fue creado.')
      setIsLoading(false)
      setError(true)
    }
  } catch (error) {
    setIsLoading(false)
    console.log(error)
    setError(true)
  }
}

  



  useEffect(() => {
    if(fetchedData.image && fetchedData.image.includes('jpg' || 'png')){
      setEvent((prevEvent) => ({
        ...prevEvent,
        event_image: fetchedData.image,
      }));
    }
    if(fetchedData.date){
      setEvent((prevEvent) => ({
        ...prevEvent,
        event_date: dayjs(fetchedData.date, 'DD-MM-YYYY' || 'DD-M-YYYY').toDate(),
      }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  useEffect(() => {
    async function fetchData() {
      setCities(await fetchCities());
      const data = await fetchTypes()
      const types = data.map(type => type.type_name)
      setTypes(types);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (event.event_djs.length > 0) {
      const title = event.event_djs.join(' | ');
      setEvent(prevEvent => ({ ...prevEvent, event_title: title }));
    } else {
      // If event_djs is empty, reset event_title to an empty string
      setEvent(prevEvent => ({ ...prevEvent, event_title: '' }));
    }
  }, [event.event_djs]);
  

  useEffect(() => {
    if (link.includes('http') || link.includes('passline') || link.includes('venti')) {
      // searchLinkData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  const handleLinkChange = (e) => {
    setlink(e.target.value)
    setEvent((prevEvent) => ({
      ...prevEvent,
      ticket_link: e.target.value
    }))
  }

  const handleDateChange = (e) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_date: dayjs(e).toDate()
    }))
  }

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_location: location,
    }));
  };

  const handleCityChange = (e, newValue) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_city: newValue || '', // Set to the selected city or an empty string if cleared
    }));
  };

  const handleDjsChange = (e, newValue) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_djs: newValue || [], // Set to the selected DJs or an empty array if cleared
    }));
  };

  const handleTypesChange = (e, newValue) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_type: newValue || [], // Set to the selected DJs or an empty array if cleared
    }));
  };


  const handleImageChange = (e) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      event_image: e.target.value || ''
    }))
  }


  const handleCreateEvent = () => {
    createEvent()
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccess(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCreateSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };

  const handleClearEvent = () => {
    setEvent({
      ...event,
      event_title: '',
      event_type: [],
      event_date: '',
      event_location: '',
      ticket_link: '',
      event_image: '',
      event_djs: [],
    });
  };


  const handleFileChange = async (e) => {
    console.log('starting')
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'upload_preset', 'jodifyCloudinary'
        );
        formData.append('jodify', '')
        fetch('https://api.cloudinary.com/v1_1/dtmjh1hbu/image/upload',
        {
          method: 'post',
          body: formData
        }).then((response) => response.json()).then((data) => {
          setEvent((prevEvent) => ({
            ...prevEvent,
            event_image: data.url,
          }));
        })
      } else {
        console.error('Selected file is not an image.');
      }
    }
  };



  if(isLoading){
    return (
      <Box sx={{ display: 'flex', width: '90%', height: '100vh', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
        <CircularProgress />
      </Box>
    )    
  }

  let eventDate = event.event_date ? dayjs(event.event_date) : null;


  return (
    <div 
    style={{
      backgroundColor: theme.jodify_colors._background_gray, 
      width: '100%', 
      marginTop: '2%', 
      marginBottom: '2%'
      }}>
      <ThemeProvider theme={custom}>
      <Box
      component="form"
      sx={{
        '& > :not(style)': {  width: '90%', display: 'flex', justifyContent: 'center', margin: '0 auto', marginTop: '10px'},
      }}
      noValidate
      autoComplete="off"
    >          
        <Event event={event} large={true} />


        <Autocomplete
          id="tags-standard"
          options={cities}
          getOptionLabel={(option) => option.city_name || option}
          onChange={handleCityChange}
          value={event.event_city}
          renderInput={(params) => (
            <BasicText
              error={event.event_city === ''}
              helperText='tenes que elegir una ciudad'
              required
              {...params}
              variant="standard"
              label='Ciudad'
              placeholder='Elige una ciudad'
            />
          )}
        />


        <BasicText helperText='Copia y pega aca el link de venta de entradas' error={event.ticket_link === ''} required label='Link de Venta' placeholder='Ingresa el link del evento' variant='standard' value={event.ticket_link} style={{color: 'success'}} onChange={handleLinkChange}/>


        <BasicText helperText='Copia y pega la url de la imagen o carga la imagen con el botón de carga' error={event.event_image === ''} required label='Imagen' placeholder='Ingresa la url de la imagen' variant='standard' value={event.event_image} onChange={handleImageChange}/>


        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DayPick 
              label="Fecha del evento"
              slots={{
                textField: (params) => (
                  <BasicText
                  helperText='Ingresa la fecha del evento'
                  error={true}
                  required
                  variant='standard'
                    {...params}
                  />
                ),
              }}
              value={eventDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
        </LocalizationProvider>


        <BasicText helperText='En este campo debes inlcluir el boliche y el partido, Ej: Crobar (Palermo)' error={event.event_location === ''} required label='Ubicación' placeholder='Ingresa el nombre del complejo o dirección' variant='standard' onChange={e => handleLocationChange(e)} value={event.event_location}/>


        <Autocomplete
          ChipProps={{color: 'jodify'}}
          freeSolo
          multiple
          id="tags-standard"
          options={Djs}
          getOptionLabel={(option) => option}
          onChange={handleDjsChange}
          value={event.event_djs || []}
          renderInput={(params) => (
            <BasicText
              helperText='Seleccioná o escribí los Djs de esta fechita'
              error={event.event_djs.length === 0}
              required
              {...params}
              variant="standard"
              label='Line up'
              placeholder='Agrega artistas al evento'
              value={event.event_title || ''}
            />
          )}
        />


        <Autocomplete
          ChipProps={{color: 'jodify'}}
          id="tags-standard"
          freeSolo
          multiple
          options={types}
          getOptionLabel={(option) => option}
          onChange={handleTypesChange}
          value={event.event_type}
          renderInput={(params) => (
            <BasicText
              helperText='¿Que géneros de electronica se va a escuchar?( podes elegir mas de uno )'
              error={event.event_type.length === 0}
              required
              {...params}
              variant="standard"
              label='Géneros musicales'
              placeholder='Agrega géneros al evento'
              value={event.event_type.join(' | ')}
            />
          )}
        />
     
        
        <BasicText
          helperText='Este campo se rellena automaticamente ingresando el "Line up"'
          error={event.event_title === ''}
          id="standard-textarea"
          label='Nombre del evento'
          placeholder='Edita el nombre del evento'
          multiline
          variant="standard"
          value={event.event_title}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon sx={{color:theme.jodify_colors._text_white}}/>
              </InputAdornment>
            ),
          }}
        />

        <UploadBtn component="label" variant="contained" startIcon={<AddIcon />}>
        Carga la imagen del evento
        <VisuallyHiddenInput 
        type="file" 
        accept="image/*"
        onChange={(e) => handleFileChange(e)}
        />
        </UploadBtn>


        <Stack spacing={1} direction="row" style={{marginTop: '20px', marginBottom: '2%'}}>
          <BtnJo onClick={handleClearEvent} variant="outlined">Limpiar</BtnJo>
          <BtnFy disabled={isCreateButtonDisabled} onClick={handleCreateEvent} variant="contained">Crear</BtnFy>
        </Stack>
    </Box>

            <Snackbar open={success} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="success" sx={{marginBottom: '10px', marginLeft: '9px', marginRight: '9px', borderRadius: theme.jodify_borders._sm_border_radius, fontFamily: "'Roboto Condensed', sans-serif" }}>
                    Exito! revisa la fecha e imagen.
                </Alert>
            </Snackbar>
            <Snackbar open={createSuccess} autoHideDuration={5000} onClose={handleCloseSuccess} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="success" sx={{marginBottom: '10px', marginLeft: '9px', marginRight: '9px', borderRadius: theme.jodify_borders._sm_border_radius, fontFamily: "'Roboto Condensed', sans-serif" }}>
                    ¡Evento creado con exito!
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={5000} onClose={handleCloseError} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity="error" sx={{marginBottom: '10px', marginLeft: '9px', marginRight: '9px', borderRadius: theme.jodify_borders._sm_border_radius, fontFamily: "'Roboto Condensed', sans-serif" }}>
                    {errorMessage !== '' ? errorMessage : 'Error, hablale a Marcos'}
                </Alert>
            </Snackbar>
            </ThemeProvider>
    </div>
    
  )
  }

export default CreateForm
