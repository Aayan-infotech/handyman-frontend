import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProviderUser = createAsyncThunk(
  "User/getProviderUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://54.236.98.193:7777/api/auth/getProviderProfile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ProviderToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHunterUser = createAsyncThunk(
  "User/getHunterUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://54.236.98.193:7777/api/auth/getHunterProfile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const handleChangePassword = createAsyncThunk(
  "/User/changePassword",
  async ({ id, oldPassword, newPassword }, { rejectWithValue }) => {
    // Destructure id and password from the argument
    try {
      const response = await axios.post(
        // Use POST request to send data in the body
        `http://54.236.98.193:7777/api/auth/changePassword/${id}`,
        { oldPassword, newPassword }, // Send the password data in the request body
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`, // Include token if needed
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

export const handleEditProfile = createAsyncThunk(
  "/User/changePassword",
  async ({ id, oldPassword, newPassword }, { rejectWithValue }) => {
    // Destructure id and password from the argument
    try {
      const response = await axios.post(
        // Use POST request to send data in the body
        `http://54.236.98.193:7777/api/auth/changePassword/${id}`,
        { oldPassword, newPassword }, // Send the password data in the request body
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("hunterToken") ||
              localStorage.getItem("ProviderToken")
            }`, // Include token if needed
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors and send them to the reducer
    }
  }
);

const initialState = {
  user: [],
  status: "idle",
  error: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProviderUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProviderUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getProviderUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getHunterUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHunterUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getHunterUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleChangePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      });
  },
});

export default UserSlice.reducer;
