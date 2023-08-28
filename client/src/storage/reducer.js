// reducers/searchResults.js
const initialState = {
    events : []
};

const searchResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return  {...state, events: action.payload}
    default:
      return state;
  }
};

export default searchResultsReducer;
