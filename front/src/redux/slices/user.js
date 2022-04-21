import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosGraphql from "../../tools/axios";
import {
  GET_USER,
  REGISTER,
  UPDATE_USER,
  DELETE_USER,
} from "../../graphql/user";

const initialState = {
  users: [],
  count: 0,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SET_USERS(state, action) {
      state.users = action.payload;
    },
    SET_COUNT(state, action) {
      state.count = action.payload;
    },
    SET_LOADING(state, action) {
      state.loading = action.payload;
    },
    SET_ERROR(state, action) {
      state.error = action.payload;
    },
  },
});

export const getUsers = createAsyncThunk(
  "getUsers",
  async (args, { dispatch }) => {
    dispatch(userSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({ query: GET_USER, variables: { args } });
    resp.errors && dispatch(userSlice.actions.SET_ERROR(resp.errors));
    if (resp.data) {
      dispatch(userSlice.actions.SET_COUNT(resp.data.getUsers.count));
      dispatch(userSlice.actions.SET_USERS(resp.data.getUsers.users));
    }
    dispatch(userSlice.actions.SET_LOADING(false));
    return resp;
  }
);

export const mutateUser = createAsyncThunk(
  "mutateUser",
  async (args, { dispatch }) => {
    dispatch(userSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({
      query: !args.id ? REGISTER : UPDATE_USER,
      variables: { args },
    });
    resp.errors && dispatch(userSlice.actions.SET_ERROR(resp.errors));
    dispatch(userSlice.actions.SET_LOADING(false));
    return resp;
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id, { dispatch }) => {
    dispatch(userSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({
      query: DELETE_USER,
      variables: { id },
    });
    resp.errors && dispatch(userSlice.actions.SET_ERROR(resp.errors));
    dispatch(userSlice.actions.SET_LOADING(false));
    return resp;
  }
);

export default userSlice.reducer;
