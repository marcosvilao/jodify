import { GET_CART } from "../actions/types.js";

const initialState = {
  cart: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        cart: action.payload,
      };

    default:
      return { ...state };
  }
};

export default rootReducer;
