
import React, { useState, useEffect } from 'react';
import { Wrapper, SearchContainer, SearchInput, SearchButton, Span } from './SearchfieldStyles';
import { useDispatch } from 'react-redux';
import theme from '../../jodifyStyles';
import { setSearchData } from '../../storage/searchSlice';

function Searchfield() {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const handleInputClick = () => {
    setIsInputClicked(true);

    // Reset animation after a delay (e.g., 300ms)
    setTimeout(() => {
      setIsInputClicked(false);
    }, 1000);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`https://jodify.vercel.app/events/search?searchQuery=${inputValue}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          dispatch(setSearchData(data));
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (inputValue || inputValue === '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      dispatch(setSearchData([]));
    }
  }, [inputValue, dispatch]);

  const handleSubmit = () => {
    dispatch(setSearchData(searchResults));
    console.log('search Dispatch')
  }

  return (
    <Wrapper>
      <SearchContainer $isInputClicked={isInputClicked} color={theme.colors._color_bg_card}>
        <SearchInput
          color={theme.colors._color_bg}
          placeholder='Escribe el nombre de un evento o Dj'
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
        />
        <SearchButton onClick={handleSubmit}>
          <Span className="material-symbols-outlined">search</Span>
        </SearchButton>
      </SearchContainer>
    </Wrapper>
  );
}

export default Searchfield;
