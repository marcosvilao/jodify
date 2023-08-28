import React, { useState, useEffect } from 'react';
import { GridWrapper } from './gridStyles';
import Event from '../Event-card/Event';
import EventNotFound from '../Event-not-found/EventNotFound';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';

function Grid() {
  const searchData = useSelector((state) => state.search.events.events);
  const filterData = useSelector((state) => state.search.events);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true)
  console.log(events)
  useEffect(() => {
    if (searchData) {
      console.log('Filtering by search bar');
      setEvents(searchData);
    } else if (filterData) {
      console.log('Filtering by filters');
      setEvents(filterData);
    } else if (shouldFetch) {
      console.log('Fetching from API');
      fetch('https://jodify.vercel.app/events')
        .then(response => response.json())
        .then(data => {
          setEvents(data); // Update the state with fetched events
          setShouldFetch(false); // Mark that fetching has been done
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }
  }, [searchData, filterData, shouldFetch]);

  

  return (
    <div style={{marginTop: '1rem'}}>
    {events.length ? events.map(dateObj => {
      const date = new Date(Object.keys(dateObj));

      const eventArray = dateObj[Object.keys(dateObj)];

      const options = {
        weekday: 'long',  // "Jueves"
        day: 'numeric',   // "24"
        month: 'long'     // "Agosto"
      };

      const formattedDate = date.toLocaleDateString('es-AR', options);

      return (
        <div key={date.getTime()}>
          <h3 style={{paddingLeft: '5%'}}>{formattedDate}</h3>
          <GridWrapper>
            {eventArray.map(event => (
              <Event event={event} key={event.id} />
            ))}
          </GridWrapper>
        </div>
      );
    }) : (
        <EventNotFound />
      )}
  </div>
    
  )
}

export default Grid
