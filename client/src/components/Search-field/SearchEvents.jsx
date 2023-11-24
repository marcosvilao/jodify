import React, { useState, useEffect } from 'react';
import { Wrapper, SearchContainer, SearchInput, SearchButton } from './SearchEventsStyles';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../../jodifyStyles';

function SearchEvents({setSearch}) {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const events = useSelector(state => state.search.events);
  const [toSearch, setToSearch] = useState(events)
  const dispatch = useDispatch();
  const filteredEvents = useSelector(state => state.search.filterEvents);
  const isFiltered = useSelector(state => state.search.isFiltering);
  const isSearching = useSelector(state => state.search.isSearching);

  const handleInputClick = () => {
    setIsInputClicked(true);
  };

  useEffect(() => {

    if(isFiltered){
      setToSearch(filteredEvents)
    } else {
      setToSearch(events)
    }
  }, [isFiltered, filteredEvents, events])
  

  const handleInputBlur = () => {
    setIsInputClicked(false)
  }

  useEffect(() => {
    if(!isSearching){
      setInputValue('')
    }
  }, [isSearching])
  

  const filterEvents = (filterString) => {
    const filteredEvents = toSearch.map((eventGroup) => {
        const date = Object.keys(eventGroup)[0];
        const eventsForDate = eventGroup[date];

        const filteredEventsForDate = eventsForDate.filter((event) => {
          const matchDJs = event.event_djs.some(dj => dj.toLowerCase().includes(filterString));
          const matchLocation = event.event_location.toLowerCase().includes(filterString);
          const matchTitle = event.event_title.toLowerCase().includes(filterString);
            if (matchDJs || matchLocation || matchTitle) {
                return true; 
            }

            return false; 
        });

        if (filteredEventsForDate.length > 0) {
            return { [date]: filteredEventsForDate };
        }

        return null; // Date has no matching events
    }).filter((eventGroup) => eventGroup !== null);


    return filteredEvents;
}

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    const lowerCaseInput = event.target.value.toLowerCase();
    setSearch(lowerCaseInput)
  };


  return (
    <Wrapper>
      <SearchContainer $isInputClicked={isInputClicked}>
        <SearchButton $isInputClicked={isInputClicked}>
          <SearchIcon style={{color: theme.jodify_colors._icons_primary, position: 'relative',
    marginLeft: '10px'}}/>
        </SearchButton>
        <SearchInput
          $isInputClicked={isInputClicked}
          placeholder='Buscá un evento, artista o club'
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
        />
      </SearchContainer>
    </Wrapper>
  );
}

export default SearchEvents;
