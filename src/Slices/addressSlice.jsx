import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAddress = createAsyncThunk(
  "Address/getAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://3.223.253.106:7777/api/address/addresses-by-id",
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ??
              localStorage.getItem("providerToken")
            }`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState: {
    address: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
