import React, { useEffect, useState } from 'react';
import { Wrapper, FilterWrapper, GridWrapper, TextWrapper , CityWrapper, Box } from './FilterStyles'
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css'; // Import the theme
import Datepicker from '../Calendar/DatePicker';
import { useDispatch } from 'react-redux';
import { setSearchData } from '../../storage/searchSlice';


function Filters() {
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
      date: '',
      city: '',
      type: '',
    });
    const [cities, setCities] = useState([])
    const [types, setTypes] = useState([])
    const dispatch = useDispatch();
    let selectedCity;
    let selectedType;

    const updateSelectedFilters = (key, value) => {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [key]: value,
      }));
    };


    const openModal = () => {
        setIsCityModalOpen(true);
    };

    const closeModal = () => {
        setIsCityModalOpen(false);
    };
    
    const openTypeModal = () => {
        setIsTypeModalOpen(true);
      };
    
    const closeTypeModal = () => {
        setIsTypeModalOpen(false);
      };
    
    useEffect(() => {
      fetchCities()
      fetchTypes()
      filter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters])
    
  

    const fetchCities = async () => {
        try {
            const response = await fetch(`https://jodify.vercel.app/cities`);
            if (response.ok) {
              const data = await response.json();
              setCities(data);
            } else {
              console.error('Error fetching data');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    const fetchTypes = async () => {
        try {
            const response = await fetch(`https://jodify.vercel.app/types`);
            if (response.ok) {
              const data = await response.json();
              setTypes(data);
            } else {
              console.error('Error fetching data');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }

    const handleCityClick = (cityId) => {
      updateSelectedFilters('city', cityId);
      closeModal();
    };

    const handleTypeClick = (typeName) => {
      updateSelectedFilters('type', typeName);
      closeTypeModal();
    };

    const filter = async () => {
      try {
        const date = selectedFilters.date // Replace this with the selected date
        const utcDate = date ? date.toISOString() : ''; // Convert to UTC ISO format
        const response = await fetch(`https://jodify.vercel.app/events/filters?city=${selectedFilters.city}&date=${utcDate}&type=${selectedFilters.type}`);
        if (response.ok) {
          const data = await response.json();
          dispatch(setSearchData(data));

        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if(selectedFilters.city.trim() !== ""){
      selectedCity = cities.filter(city => city.id === selectedFilters.city)
    }

    if(selectedFilters.type.trim() !== ""){
      selectedType = types.filter(type => type.type_name === selectedFilters.type)

    }

  return (
    <Wrapper>
        <Box>
        <FilterWrapper style={selectedFilters.city.trim() !== "" ? {backgroundColor: '#ECD8F5'} : {backgroundColor: ''}}>
            {selectedCity && (
            <span onClick={() => updateSelectedFilters('city', '')} className="material-symbols-outlined">
            done
            </span>
            )}
            <p style={{marginBottom: '20px'}} onClick={openModal}>{selectedFilters.city.trim() !== "" ? selectedCity[0].city_name : "Ciudad"}</p>
        </FilterWrapper>
        <Modal
            isOpen={isCityModalOpen}
            onRequestClose={closeModal}
            style={{
            content: {
                display: 'flex',
                backgroundColor: '#DBDBDB',
                width: '70%',
                maxWidth: '300px',
                height: '70%',
                padding: '8px',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                margin: 'auto auto'
          },
        }}
      >
        <GridWrapper>
          {cities?.map(city => (
                <CityWrapper key={city.id} onClick={() => handleCityClick(city.id)}>
                    <TextWrapper key={city.id}>{city.city_name}</TextWrapper>
                </CityWrapper>
          ))}
        </GridWrapper>
        <button onClick={closeModal}>Close</button>
        </Modal>
        <FilterWrapper>
            <Datepicker 
              isOpen={isDateModalOpen}
              onSelect={date => updateSelectedFilters('date', date)}
            />
        </FilterWrapper>
        
        <FilterWrapper style={selectedFilters.type.trim() !== "" ? {backgroundColor: '#ECD8F5'} : {backgroundColor: ''}}>
        {selectedType && (
            <span onClick={() => updateSelectedFilters('type', '')} className="material-symbols-outlined">
            done
            </span>
            )}
            <p style={{marginBottom: '20px'}} onClick={openTypeModal}>{selectedFilters.type.trim() !== "" ? selectedType[0].type_name : "Género"}</p>
        </FilterWrapper>
        <Modal
            isOpen={isTypeModalOpen}
            onRequestClose={closeTypeModal}
            style={{
            content: {
                display: 'flex',
                backgroundColor: '#DBDBDB',
                width: '70%',
                maxWidth: '300px',
                height: '70%',
                padding: '8px',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                margin: 'auto auto'
          },
        }}
      >
        <GridWrapper>
          {types?.map(type => (
                <CityWrapper key={type.id} onClick={() => handleTypeClick(type.type_name)}>
                    <TextWrapper key={type}>{type.type_name}</TextWrapper>
                </CityWrapper>
          ))}
        </GridWrapper>
        <button onClick={closeTypeModal}>Close</button>
        </Modal>
        </Box>
        
    </Wrapper>
  )
}

export default Filters
