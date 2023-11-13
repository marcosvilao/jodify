import React from 'react'
import logo from '../../assets/Jodify-logo.png'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Card, EventImage, EventDescription, TitleContainer, TitleText, EventLocation, TypeContainer, LocationContainer, EventCaracteristics } from './EventStyles'

function Event({event, large}) {
    const types = Array.isArray(event?.event_type) ? event?.event_type?.join(' | ') : event.event_type;
    const twoLines = event.event_title.length > 36
    const eventLogo = event.event_image === '' ? logo : event.event_image
  return (
    <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
      <Card $islarge={large}>
                <EventImage src={eventLogo} alt='No hay imagen'/>
                <EventDescription $twoLines={twoLines}>
                        <TitleContainer>
                        <TitleText>{event.event_title}</TitleText>
                        </TitleContainer>

                    <EventCaracteristics>
                        <LocationContainer>
                        <LocationOnIcon sx={{width: '18px', height: '18px'}}/>
                        <EventLocation>{event.event_location}</EventLocation>
                    </LocationContainer>
                    <TypeContainer>
                        <MusicNoteIcon sx={{width: '18px', height: '18px'}}/>
                        <EventLocation>{types}</EventLocation>
                    </TypeContainer>

                    </EventCaracteristics>
                        
                </EventDescription>
            </Card>
    </a>


  )
}

export default Event