import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosGraphql from "../../tools/axios";
import {
  ADD_PARKING,
  DELETE_PARKING,
  GET_PARKINGS,
  UPDATE_PARKING,
} from "../../graphql/parking";

const initialState = {
  parkings: [],
  count: 0,
  loading: false,
  error: null,
};

export const parkingSlice = createSlice({
  name: "parking",
  initialState,
  reducers: {
    SET_PARKINGS(state, action) {
      state.parkings = action.payload;
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

export const mutateParking = createAsyncThunk(
  "mutateParkin",
  async (args, { dispatch }) => {
    dispatch(parkingSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({
      query: !args.id ? ADD_PARKING : UPDATE_PARKING,
      variables: { args },
    });
    resp.errors && dispatch(parkingSlice.actions.SET_ERROR(resp.errors));
    dispatch(parkingSlice.actions.SET_LOADING(false));

    return resp;
  }
);

export const getParkings = createAsyncThunk(
  "getParkings",
  async (args, { dispatch }) => {
    dispatch(parkingSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({
      query: GET_PARKINGS,
      variables: { args },
    });
    resp.errors && dispatch(parkingSlice.actions.SET_ERROR(resp.errors));
    dispatch(parkingSlice.actions.SET_LOADING(false));
    dispatch(parkingSlice.actions.SET_COUNT(resp.data.getPlaceParkings.count));
    dispatch(
      parkingSlice.actions.SET_PARKINGS(resp.data.getPlaceParkings.parkings)
    );
    return resp;
  }
);

export const deleteParking = createAsyncThunk(
  "deleteParking",
  async (id, { dispatch }) => {
    dispatch(parkingSlice.actions.SET_LOADING(true));
    const resp = await axiosGraphql({
      query: DELETE_PARKING,
      variables: { id },
    });
    resp.errors && dispatch(parkingSlice.actions.SET_ERROR(resp.errors));
    dispatch(parkingSlice.actions.SET_LOADING(false));
    return resp;
  }
);

export default parkingSlice.reducer;
