import React, { useState, useEffect } from 'react';
import { Wrapper, SearchContainer, SearchInput, SearchButton, Span } from './SearchEventsStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchEvents, setIsSearching } from '../../storage/searchSlice';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../../jodifyStyles';

function SearchEvents() {
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
            if (matchDJs || matchLocation) {
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
    const filteredEvents = filterEvents(lowerCaseInput)
    if(lowerCaseInput !== '') {
      dispatch(setIsSearching(true));
      dispatch(setSearchEvents(filteredEvents));
    } else if(lowerCaseInput === ''){
      dispatch(setIsSearching(false));
    }
  };

  const handleSubmit = () => {
    const lowerCaseInput = inputValue.toLowerCase();
    const filteredEvents = filterEvents(lowerCaseInput)
    if(lowerCaseInput !== '') {
      dispatch(setIsSearching(true));
      dispatch(setSearchEvents(filteredEvents));
    } else {
      dispatch(setIsSearching(false));
    }
  }

  return (
    <Wrapper>
      <SearchContainer $isInputClicked={isInputClicked}>
        <SearchButton $isInputClicked={isInputClicked} onSubmit={handleSubmit}>
          <SearchIcon style={{color: theme.jodify_colors._icons_primary, position: 'relative',
    marginLeft: '10px'}}/>
        </SearchButton>
        <SearchInput
          $isInputClicked={isInputClicked}
          placeholder='Busca un dj, evento o género preferido'
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
