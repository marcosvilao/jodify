import React from 'react'
import logo from '../../assets/jodify_logo.jpg'
import { Card, EventImage, EventDescription, TitleContainer, TitleText, Icon, EventLocation, TypeContainer, LocationContainer } from './EventStyles'

function Event({event}) {

  return (
    <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
      <Card >
                <EventImage src={event.event_image !== 'undefined' ? event.event_image : logo} alt='No Image'/>
                <EventDescription>
                    <TitleContainer>
                        <TitleText>{event.event_title}</TitleText>
                    </TitleContainer>
                    <LocationContainer>
                        <Icon className="material-symbols-outlined"> 
                            location_on
                        </Icon>
                        <EventLocation>{event.event_location}</EventLocation>
                    </LocationContainer>
                    <TypeContainer>
                        <Icon className="material-symbols-outlined"> 
                            music_note
                        </Icon>
                        <EventLocation>{event.event_type}</EventLocation>
                    </TypeContainer>
                </EventDescription>
            </Card>
    </a>


  )
}

export default Event