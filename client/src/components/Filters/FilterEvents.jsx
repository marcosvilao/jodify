import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { FilterWrapper, FilterText } from './FilterEventsStyles'
import FilterList from './FilterList';
import { fetchCities, fetchTypes } from '../../storage/actions';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterEvents, setIsFiltering, setIsSearching } from '../../storage/searchSlice';
import JodifyDatePicker from '../Calendar/JodifyDatePicker';
import theme from '../../jodifyStyles';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';
import BackgroundFilters from './BackgroundFilters';


function FilterEvents() {
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const events = useSelector((state) => state.search.events)
    const [isFilterOpen, setisFilterOpen] = useState(false)
    const [checkedTypes, setCheckedTypes] = useState([]);
    const [checkedCities, setCheckedCities] = useState([]);
    const [cities, setCities] = useState([])
    const [selectedCities, setSelectedCities] = useState([])
    const [types, setTypes] = useState([])
    const [dates, setDates] = useState([])
    const [openTypesFilter, setOpenTypesFilter] = useState(false);
    const [openCitiesFilter, setOpenCitiesFilter] = useState(false)
    const [openDatesFilter, setOpenDatesFilter] = useState(false)
    const [filters, setfilters] = useState({
        types : [],
        cities : [],
        dates : []
    })
    const filterEvents = (filters) => {
        const filteredEvents = events.map((eventGroup) => {
            const date = Object.keys(eventGroup)[0];
            const originalDate = new Date(date);
            const newDate = new Date(originalDate);
            newDate.setDate(originalDate.getDate() + 1);
            newDate.setHours(0, 0, 0, 0);
            const eventsForDate = eventGroup[date];
            
            const filteredEventsForDate = eventsForDate.filter((event) => {
                const eventTypes = event.event_type.split(" | ");
                if (
                    (filters.cities.length === 0 || filters.cities.includes(event.city_id)) &&
                    (filters.types.length === 0 || eventTypes.some(type => filters.types.includes(type))) &&
                    (filters.dates.length === 0 || (new Date(filters.dates[0]) <= new Date(newDate) && new Date(newDate) <= new Date(filters.dates[1])))
                ) {
                    return true; // Include the event
                }
                return false; // Exclude the event
            });
    
            if (filteredEventsForDate.length > 0) {
                return { [date]: filteredEventsForDate };
            }
    
            return null; // Date has no matching events
        }).filter((eventGroup) => eventGroup !== null);

        return filteredEvents;

        }
  
        useEffect(() => {
            const filteredEvents = filterEvents(filters)
            if(filters.cities.length !== 0 || filters.types.length !== 0 || filters.dates.length !== 0){
                dispatch(setIsFiltering(true))
                dispatch(setIsSearching(false))
            } else {
                dispatch(setIsFiltering(false))
            }
            dispatch(setFilterEvents(filteredEvents))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [filters])
        
    

    useEffect(() => {
        async function fetchData() {
          setCities(await fetchCities());
          setTypes(await fetchTypes());
        }
        fetchData();
      }, []);

      useEffect(() => {
        if(cities.length > 0 && events.length > 0){
            setCheckedCities([1])
        }
      }, [cities, events])
      

    const FilterTypes = (event) => {
        event.stopPropagation()
        setOpenTypesFilter(!openTypesFilter);
        if(openCitiesFilter){
            setOpenCitiesFilter(!openCitiesFilter);
        }
        if(openDatesFilter){
            setOpenDatesFilter(!openDatesFilter);
        }
    }

    const FilterDates = (event) => {
        event.stopPropagation()
        setOpenDatesFilter(!openDatesFilter);
        if(openCitiesFilter){
            setOpenCitiesFilter(!openCitiesFilter);
        }
        if(openTypesFilter){
            setOpenTypesFilter(!openTypesFilter);
        }
    }

    useEffect(() => {
        if(openCitiesFilter || openTypesFilter || openDatesFilter) {
            setisFilterOpen(true)
        } else {
            setisFilterOpen(false)
        }
    }, [openCitiesFilter, openTypesFilter, openDatesFilter])
    


    const FilterCities = (event) => {
        event.stopPropagation()
        setOpenCitiesFilter(!openCitiesFilter);
        if(openTypesFilter){
            setOpenTypesFilter(!openTypesFilter);
        }
        if(openDatesFilter){
            setOpenDatesFilter(!openDatesFilter);
        }
    }

    const filterRef = useRef(null);
    const filterListRef = useRef(null);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (
                filterRef.current && 
                !filterRef.current.contains(event.target) &&
                filterListRef.current && 
                !filterListRef.current.contains(event.target)
            ) {
                setOpenTypesFilter(false);
                setOpenCitiesFilter(false);
                setOpenDatesFilter(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const updateFilters = () => {
        const selectedTypes = checkedTypes.map(index => types[index].type_name);
        const selectedCities = checkedCities?.map(index => cities[index]?.id);
        setSelectedCities(checkedCities.map(index => cities[index]?.city_name))
    
        setfilters({
            ...filters,
            types: selectedTypes,
            cities: selectedCities,
          });
      };
    
      // useEffect to watch for changes in checkedTypes and checkedCities
      useEffect(() => {
        updateFilters();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [checkedTypes, checkedCities]);

      useEffect(() => {
            if(dates[0] && !dates[1]){
                setOpen(true)
            } else {
                setfilters({
                            ...filters,
                            dates 
                            });
            }

          
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dates])
      

    useEffect(() => {

        const storedCheckedTypes = JSON.parse(localStorage.getItem('checkedTypes'));
        const storedCheckedCities = JSON.parse(localStorage.getItem('checkedCities'));
      
        if (storedCheckedTypes) {
          setCheckedTypes(storedCheckedTypes);
        }
        if (storedCheckedCities) {
            setCheckedCities(storedCheckedCities);
          }
      }, []);
      
      useEffect(() => {
        // Store the checked items in local storage whenever it changes
        localStorage.setItem('checkedTypes', JSON.stringify(checkedTypes));
      }, [checkedTypes]);

      useEffect(() => {
        // Store the checked items in local storage whenever it changes
        localStorage.setItem('checkedCities', JSON.stringify(checkedCities));
      }, [checkedCities]);

      const clearTypesFilter = () => {
        setCheckedTypes([]);
        setfilters({
          ...filters,
          types: []

        });
        setOpenTypesFilter(false);
      }

      const clearCitiesFilter = () => {
        setCheckedCities([]);
        setfilters({
          ...filters,
          cities: []

        });
        setOpenCitiesFilter(false);
      }

      const clearDatesFilter = () => {
        setDates([]);
        setfilters({
          ...filters,
          dates: [],
        });
        setOpenDatesFilter(false);
      }


    return (
        <Box
            sx={{
                margin: '16px auto',
                width: '92%',
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '9px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}
        >
            <FilterWrapper onClick={filters.cities.length > 0 ? null : FilterCities} $hastypes={filters.cities.length > 0 ? "true" : undefined}>
                <FilterText
                $hastypes={filters.cities.length > 0 ? "true" : undefined} 
                onClick={FilterCities} 
                ref={filterRef}>{filters.cities.length > 1 ? `${selectedCities[0]} + ${filters.cities.length - 1}` : (filters.cities.length === 1 ? `${selectedCities[0] ? selectedCities[0] : 'Ciudad'}` : 'Ciudad')}</FilterText>
                {filters.cities.length > 0 && 
                <Tooltip title="Limpiar">
                    <ClearIcon 
                    onClick={clearCitiesFilter} 
                    style={{
                            color: theme.jodify_colors._text_white,
                            margin: '3px 10px 4px -3px',
                            width: '22px',
                            height: '22px'
                            }}/>
                </Tooltip>}
            </FilterWrapper>
            <FilterWrapper
            onClick={filters.types.length > 0 ? null : FilterTypes} 
            $hastypes={filters.types.length > 0 ? "true" : undefined}>
                <FilterText 
                $hastypes={filters.types.length > 0 ? "true" : undefined} 
                onClick={FilterTypes} 
                ref={filterRef}
                >{filters.types.length > 1 ? `${filters.types[0]} + ${filters.types.length - 1}` : (filters.types.length === 1 ? `${filters.types[0]}` : 'Género')}</FilterText>
                {filters.types.length > 0 && 
                <Tooltip title="Limpiar">
                    <ClearIcon 
                            onClick={clearTypesFilter}                    
                            style={{
                                color: theme.jodify_colors._text_white,
                                margin: '3px 10px 4px -3px',
                                width: '22px',
                                height: '22px'
                            }}/>
                </Tooltip>}
            </FilterWrapper>
            <FilterWrapper onClick={filters.dates.length > 0 ? null : FilterDates} $hastypes={filters.dates[0] || filters.dates[1] ? "true" : undefined}  >
                <FilterText 
                    $hastypes={filters.dates.length > 0 ? "true" : undefined} 
                    onClick={FilterDates} 
                    ref={filterRef}
                    >{filters.dates[0]?.toDateString() === filters.dates[1]?.toDateString() && filters.dates[0] && filters.dates[1] ? `${filters.dates[0]?.toLocaleDateString('es-AR')}` : 
                    filters.dates[1] ? `${filters.dates[0]?.toLocaleDateString('es-AR')} - ${filters.dates[1]?.toLocaleDateString('es-AR')}` : 'Fecha'}
                </FilterText>
                            {(filters.dates[0] || filters.dates[1]) && 
                            <Tooltip title="Limpiar">
                                <ClearIcon onClick={clearDatesFilter}                             
                                style={{
                                    color: theme.jodify_colors._text_white,
                                    margin: '3px 10px 4px -3px',
                                    width: '22px',
                                    height: '22px'
                                }}/>
                            </Tooltip>}
            </FilterWrapper>
            {openCitiesFilter && (
                                <div ref={filterListRef} style={{marginTop: '40px', position: 'absolute'}}>
                                <FilterList cityList={cities} checkedItems={checkedCities} setCheckedItems={setCheckedCities} />
                                </div>
            )}
            
            {openTypesFilter && (
                                <div ref={filterListRef} style={{marginTop: '40px', marginLeft: '80px', position: 'absolute'}}>
                                <FilterList typeList={types} checkedItems={checkedTypes} setCheckedItems={setCheckedTypes} />
                                </div>
            )}

            {openDatesFilter && (

                                <JodifyDatePicker
                                open={open}
                                setOpen={setOpen}
                                setIsOpen={setOpenDatesFilter} 
                                setDateFilter={setDates} 
                                setDefaultValues={filters.dates}
                                style={{marginTop: '40px', marginLeft: '80px', position: 'absolute'}}/>

            )}

            {isFilterOpen && <BackgroundFilters closeDateFilter={setOpenDatesFilter}/>
            }
        </Box>
    )
}

export default FilterEvents;