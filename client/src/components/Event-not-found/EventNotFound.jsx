import React from 'react'
import { Card, EventImage, EventDescription, Error } from './EventNotFoundStyles'

function EventNotFound() {
  return (
         <Card>
            <EventImage src="https://previews.123rf.com/images/kaymosk/kaymosk1804/kaymosk180400006/100130939-error-404-page-not-found-error-with-glitch-effect-on-screen-vector-illustration-for-your-design.jpg" alt="No Image"/>
            <EventDescription>
                <Error>
                    Evento no econtrado, intenta otra vez.
                </Error>
            </EventDescription>
        </Card>
  )
}

export default EventNotFound