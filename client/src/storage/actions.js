

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
        const response = await fetch(`https://jodify.vercel.app/cities`);
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
      const response = await fetch(`https://jodify.vercel.app/types`);
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