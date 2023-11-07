import React, { useEffect, useState } from 'react';
import { Wrapper, FilterWrapper, GridWrapper, TextWrapper , CityWrapper, Box } from './FilterStyles'
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css'; // Import the styles
import 'react-date-range/dist/theme/default.css'; // Import the theme
import { useDispatch } from 'react-redux';
import theme from '../../jodifyStyles';
import DatePicker3 from '../Calendar/JodifyDatePicker';
import format from 'date-fns/format'


function Filters() {
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
      date: [{
        startDate: null,
        endDate: null,
        key: 'selection'
      }],
      city: '',
      type: '',
    });

    const [cities, setCities] = useState([])
    const [types, setTypes] = useState([])
    const dispatch = useDispatch();
    let selectedCity;
    let selectedType;
    let selectedDate;

    const updateSelectedFilters = (key, value) => {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [key]: value,
      }));
    };

    const handleDateClick = () => {
      setIsDateModalOpen(true)
    }


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters])
    

    const fetchCities = async () => {
        try {
            const response = await fetch(`http://localhost:3001/cities`);
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
            const response = await fetch(`http://localhost:3001/types`);
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

  
    if(selectedFilters.city.trim() !== ""){
      selectedCity = cities.filter(city => city.id === selectedFilters.city)
    }


    if(selectedFilters.type.trim() !== ""){
      selectedType = types.filter(type => type.type_name === selectedFilters.type)
    }

    const startDate = selectedFilters.date[0].startDate;
    const endDate = selectedFilters?.date[0].endDate;
  
    const formattedValue = startDate && endDate
      ? `${format(startDate, "dd/MM")} al ${format(endDate, "dd/MM")}`
      : 'Fecha' ;

  return (
    <Wrapper>
        <Box>
        <FilterWrapper style={selectedFilters.city.trim() !== "" ? {backgroundColor: '#E8DEF8', borderColor: '#E8DEF8'} : {backgroundColor: '', borderColor: '#C6C6C6'}}>
            <p style={{marginBottom: '20px', color: theme.colors._jodify_text_black}} onClick={openModal}>{selectedFilters.city.trim() !== "" ? selectedCity[0].city_name : "Ciudad"}</p>
            {selectedCity && (
            <span onClick={() => updateSelectedFilters('city', '')} className="material-symbols-outlined">
            close
            </span>
            )}
        </FilterWrapper>
         
            <Modal
            isOpen={isCityModalOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                position: 'absolute',
                right:'auto',
                left: 'auto',
                translate: isCityModalOpen ? 'translateX(-50%) translateY(0%)' : 'translateX(-50%) translateY(100%)',
                backgroundColor: '#DBDBDB',
                width: '343.188px',
                height: '40%',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 2s',
              },
              overlay: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
        
        
        <FilterWrapper  style={formattedValue !== 'Fecha' ? {backgroundColor: '#E8DEF8', borderColor: '#E8DEF8', width: 'fit-content'} : {backgroundColor: '', borderColor: '#C6C6C6'}}>
            <p style={{
              marginBottom: '20px',
              color: theme.colors._jodify_text_black,
              whiteSpace: 'nowrap',   
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
            }} onClick={handleDateClick}>
              {formattedValue}
            </p>
            {formattedValue !== 'Fecha' && (
            <span onClick={() => updateSelectedFilters('date', [{
              startDate: null,
              endDate: null,
              key:'selection'
            }])} className="material-symbols-outlined">
            close
            </span>
            )}

        </FilterWrapper>
            <DatePicker3
                SetIsOpen= {setIsDateModalOpen}
                IsOpen={isDateModalOpen}
                SetRange={updateSelectedFilters}
                Range={selectedFilters.date}/>
        
        <FilterWrapper style={selectedFilters.type.trim() !== "" ? {backgroundColor: '#E8DEF8', borderColor: '#E8DEF8'} : {backgroundColor: '', borderColor: '#C6C6C6'}}>
            <p style={{marginBottom: '20px', color: theme.colors._jodify_text_black}} onClick={openTypeModal}>{selectedFilters.type.trim() !== "" ? selectedType[0].type_name : "Género"}</p>
        {selectedType && (
            <span onClick={() => updateSelectedFilters('type', '')} className="material-symbols-outlined">
            close
            </span>
            )}
        </FilterWrapper>
        <Modal
            isOpen={isTypeModalOpen}
            onRequestClose={closeTypeModal}
            style={{
              content: {
                position: 'absolute',
                bottom: '0',             // Position the modal at the bottom
                left: '50%',             // Center it horizontally
                transform: isTypeModalOpen ? 'translateX(-50%) translateY(50vh)' : 'translateX(-50%) translateY(100vh)',  // Hide it below the screen
                backgroundColor: '#DBDBDB',
                width: '343.188px',
                height: 'auto',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              },
              overlay: {
                display: 'flex',
                alignItems: 'flex-end',  // Adjust this to center the modal vertically
                justifyContent: 'center',
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

        {/* <TypeModal
          setType={handleTypeClick}
          data={types}
          isOpen={isTypeModalOpen}
          onClose={closeTypeModal}
         /> */}
    </Wrapper>
  )
}

export default Filters
