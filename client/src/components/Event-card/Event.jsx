import React, {useState, useEffect} from 'react';
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const types = Array.isArray(event?.event_type) ? event?.event_type?.join(' | ') : event.event_type;
  const twoLines = windowWidth < 1000 ?  event.event_title.length > 36 : false;
  const ThreeLines = windowWidth < 1000 ? event.event_title.length > 66 : false;
  const truncatedTitle = windowWidth < 1000 ? truncateText(event.event_title, 66) : event.event_title;
  const truncatedLocation = windowWidth < 1000 ? truncateText(event.event_location, 33) : event.event_location;
  const truncateTypes = windowWidth < 1000 ? truncateText(types, 36) : types;
  const eventLogo = event.event_image === '' ? logo : event.event_image;

  return (
    <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
      <Card $islarge={large}>
        <EventImage src={eventLogo} alt="No hay imagen" />
        <EventDescription $twoLines={twoLines} $width={windowWidth < 1000}>
          <TitleContainer>
            <TitleText>{ThreeLines ? truncatedTitle : event.event_title}</TitleText>
          </TitleContainer>

          <EventCaracteristics>
            <LocationContainer>
              <LocationOnIcon sx={{ width: '18px', height: '18px' }} />
              <EventLocation>{truncatedLocation}</EventLocation>
            </LocationContainer>
            <TypeContainer>
              <MusicNoteIcon sx={{ width: '18px', height: '18px' }} />
              <EventLocation>{truncateTypes}</EventLocation>
            </TypeContainer>
          </EventCaracteristics>
        </EventDescription>
      </Card>
    </a>
  );
}

export default Event;
