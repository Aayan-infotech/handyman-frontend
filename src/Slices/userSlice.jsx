import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance";

export const getProviderUser = createAsyncThunk(
  "User/getProviderUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("ProviderToken");
    try {
      const response = await axiosInstance.get("/auth/getProviderProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      const response = await axiosInstance.get("/auth/getHunterProfile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("hunterToken")}`,
        },
      });

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
      const response = await axiosInstance.post(
        // Use POST request to send data in the body
        `/auth/changePassword/${id}`,
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
      const response = await axiosInstance.post(
        // Use POST request to send data in the body
        `/auth/changePassword/${id}`,
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
