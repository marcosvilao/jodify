import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    events: [],
  },
  reducers: {
    setSearchData: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { setSearchData } = searchSlice.actions;
export default searchSlice.reducer;