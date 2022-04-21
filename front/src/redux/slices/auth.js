import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosGraphql from "../../tools/axios";
import { LOGIN } from "../../graphql/auth";

const initialState = {
  token: null,
  loading: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_TOKEN(state, action) {
      state.token = action.payload;
    },
    SET_LOADING(state, action) {
      state.loading = action.payload;
    },
    SET_ERROR(state, action) {
      state.error = action.payload;
    },
  },
});

export const getToken = (state) => {
  return state.auth.token;
};

export const loginThunk = createAsyncThunk(
  "login",
  async (args, { dispatch }) => {
    dispatch(authSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({ query: LOGIN, variables: { args } });
    dispatch(authSlice.actions.SET_LOADING(false));
    dispatch(authSlice.actions.SET_ERROR(resp.errors));
    dispatch(authSlice.actions.SET_TOKEN(resp.data.login.token));
    return resp;
  }
);

export default authSlice.reducer;
