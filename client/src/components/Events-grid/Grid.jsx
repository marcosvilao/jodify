import React, { useEffect, useState } from 'react';
import { GridWrapper } from './gridStyles';
import { StickyHeader2 } from '../../pages/HomePageStyles';
import Event from '../Event-card/Event';
import EventNotFound from '../Event-not-found/EventNotFound';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setEvents } from '../../storage/searchSlice';
import theme from '../../jodifyStyles';
import SkeletonLoader from '../Loader/SkeletonLoader';

function Grid() {
  const [displayEvents, setDisplayEvents] = useState([])
  const dispatch = useDispatch()
  let events = useSelector(state => state.search.events)
  const filteredEvents = useSelector(state => state.search.filterEvents)
  const searchedEvents = useSelector(state => state.search.searchEvents)
  const isFiltering = useSelector(state => state.search.isFiltering)
  const isSearching = useSelector(state => state.search.isSearching)

  useEffect(() => {
      fetch('https://jodify.vercel.app/events')
        .then(response => response.json())
        .then(data => {
          dispatch(setEvents(data));
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);
  
  useEffect(() => {
    if(isFiltering && !isSearching){
      setDisplayEvents(filteredEvents)
    }
    else if(!isFiltering && isSearching){
      setDisplayEvents(searchedEvents)
    }
    else if(isFiltering && isSearching){
      setDisplayEvents(searchedEvents)
    } else {
      setDisplayEvents(events)
    }
    
  }, [isFiltering, events, filteredEvents, isSearching, searchedEvents])

  const load = () => {
    if(isFiltering || isSearching){
      return <EventNotFound />
    } else {
      return <SkeletonLoader/>
    }
  }
  

  return (
    <div style={{marginTop: '0rem'}}>
    {displayEvents.length ? displayEvents.map(dateObj => {
      const dateString = Object.keys(dateObj)[0]; // Assuming there is only one key in dateObj
      const date = new Date(dateString);
      date.setHours(date.getHours() + 3);
      const eventArray = dateObj[Object.keys(dateObj)];

      const options = {
        weekday: 'long',  // "Jueves"
        day: 'numeric',   // "24"
        month: 'long'     // "Agosto"
      };
      
      const formattedDate = date.toLocaleDateString('es-AR', options);
      
      const capitalizedDay = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1, formattedDate.indexOf(','));
      const capitalizedMonth = formattedDate.charAt(formattedDate.lastIndexOf(' ') + 1).toUpperCase() + formattedDate.slice(formattedDate.lastIndexOf(' ') + 2);
      
      const finalFormattedDate = `${capitalizedDay}, ${formattedDate.slice(formattedDate.indexOf(' ') + 1, formattedDate.lastIndexOf(' '))} ${capitalizedMonth}`;


      return (
        <div key={date.getTime()} style={{marginBottom : '20px'}}>
          <StickyHeader2>
            <h3 style={{paddingLeft: '16px', fontFamily: 'Roboto Condensed, sans-serif', fontSize: '25px', color: theme.jodify_colors._text_white}}>{finalFormattedDate}</h3>
          </StickyHeader2>
          
          <GridWrapper>
            {eventArray.map(event => (
              <Event event={event} key={event.id} />
            ))}
          </GridWrapper>
        </div>
      );
    }) : (
        load()
      )}
  </div>
    
  )
}

export default Grid
