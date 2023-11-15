import React from 'react';
import logo from '../../assets/Jodify-logo.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {
  Card,
  EventImage,
  EventDescription,
  TitleContainer,
  TitleText,
  EventLocation,
  TypeContainer,
  LocationContainer,
  EventCaracteristics,
} from './EventStyles';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function Event({ event, large }) {
  const types = Array.isArray(event?.event_type) ? event?.event_type?.join(' | ') : event.event_type;
  const twoLines = event.event_title.length > 36;
  const truncatedTitle = truncateText(event.event_title, 66);
  const truncateType = truncateText(types, 33);
  const eventLogo = event.event_image === '' ? logo : event.event_image;

  return (
    <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
      <Card $islarge={large}>
        <EventImage src={eventLogo} alt="No hay imagen" />
        <EventDescription $twoLines={twoLines}>
          <TitleContainer>
            <TitleText>{truncatedTitle}</TitleText>
          </TitleContainer>

          <EventCaracteristics>
            <LocationContainer>
              <LocationOnIcon sx={{ width: '18px', height: '18px' }} />
              <EventLocation>{event.event_location}</EventLocation>
            </LocationContainer>
            <TypeContainer>
              <MusicNoteIcon sx={{ width: '18px', height: '18px' }} />
              <EventLocation>{truncateType}</EventLocation>
            </TypeContainer>
          </EventCaracteristics>
        </EventDescription>
      </Card>
    </a>
  );
}

export default Event;
