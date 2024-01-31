import { GET_CART } from "./types.js";
import axios from "axios";

export function getCarts() {
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const userEmail = localStorage.getItem("email");

  return async function (dispatch) {
    let results = await axios.get(`${axiosUrl}/api/cart/${userEmail}`);

    return dispatch({
      type: GET_CART,
      payload: results.data,
    });
  };
}