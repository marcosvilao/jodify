

export const setSearchData = (results) => ({
    type: 'SET_SEARCH_RESULTS',
    payload: results,
  });

  export const setEvents = (events) => ({
    type: 'SET_EVENTS',
    payload: events,
  });

export const fetchCities = async () => {
    try {
        const response = await fetch(`http://localhost:3001/cities`);
        if (response.ok) {
          const data = await response.json();
          return data
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}

export const fetchTypes = async () => {
  try {
      const response = await fetch(`http://localhost:3001/types`);
      if (response.ok) {
        const data = await response.json();
        return data
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}