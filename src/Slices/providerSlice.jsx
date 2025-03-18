import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProviderNearbyJobs = createAsyncThunk(
  "/Provider/getProviderNearbyJobs",
  async (
    { businessType, services, latitude, longitude, radius, page, limit },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://54.236.98.193:7777/api/provider/getNearbyJobs`,
        {
          businessType,
          services,
          latitude,
          longitude,
          radius,
          page,
          limit,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

export const getProviderJobs = createAsyncThunk(
  "/Provider/getProviderJobs",
  async (
    { businessType, latitude, longitude, radius },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://54.236.98.193:7777/api/provider/getJobs`,
        {
          businessType,
          longitude,
          latitude,
          radius,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

export const getGuestProviderJobs = createAsyncThunk(
  "/Provider/getProviderJobs",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://54.236.98.193:7777/api/provider/getNearbyJobsForGuest`,
        {
          latitude,
          longitude,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

export const getGuestProviderJobId = createAsyncThunk(
  "/Provider/getProviderJobs",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://54.236.98.193:7777/api/provider/getJobByIdForGuest/${id}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

const initialState = {
  provider: [],
  status: "idle",
  error: null,
};

const ProviderSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProviderNearbyJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProviderNearbyJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getProviderNearbyJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getProviderJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProviderJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getProviderJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getGuestProviderJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGuestProviderJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getGuestProviderJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getGuestProviderJobId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGuestProviderJobId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getGuestProviderJobId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ProviderSlice.reducer;
