import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    events: [],
    searchEvents: [],
    filterEvents: [],
    isFiltering: false,
    isSearching: false
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setSearchEvents: (state, action) => {
      state.searchEvents = action.payload;
    },
    setFilterEvents: (state, action) => {
      state.filterEvents = action.payload;
    },
    setIsFiltering: (state, action) => {
      state.isFiltering = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    }
  },
});

export const { setEvents, setSearchEvents, setFilterEvents, setIsFiltering, setIsSearching } = searchSlice.actions;
export default searchSlice.reducer;
