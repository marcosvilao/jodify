import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    events: [],
    searchEvents: [],
    filterEvents: [],
    cities: [],
    types: [],
    isFiltering: false,
  },
  reducers: {
    setEvents: (state, action) => {
      action.payload.forEach(dateObject => {

        const dateKey = Object.keys(dateObject)[0];
        const eventsArray = dateObject[dateKey];


        const existingDateIndex = state.events.findIndex(
          existingDateObject => Object.keys(existingDateObject)[0] === dateKey
        );

        if (existingDateIndex === -1) {

          state.events.push({ [dateKey]: eventsArray });
        } else {

          state.events[existingDateIndex][dateKey].push(...eventsArray);
        }
      });
    },
    setFilterEvents: (state, action) => {
      state.filterEvents = action.payload;
    },
    setIsFiltering: (state, action) => {
      state.isFiltering = action.payload;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setTypes: (state, action) => {
      state.types = action.payload;
    }
  },
});

export const { setEvents, setFilterEvents, setIsFiltering, setCities, setTypes } = searchSlice.actions;
export default searchSlice.reducer;
