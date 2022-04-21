import axios from "axios";
import { store } from "../redux";
import { getToken } from "../redux/slices/auth";

const axiosGraphql = async (args, headers = {}) => {
  const state = store.getState();
  const { data } = await axios.post(process.env.REACT_APP_API_URL, args, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken(state)}`,
    },
  });
  return {
    data: data.data,
    errors: data.errors || null,
  };
};

export default axiosGraphql;
