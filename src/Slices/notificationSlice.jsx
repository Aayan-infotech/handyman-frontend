import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  "http://3.223.253.106:7777/api/pushNotification/sendNotification";

const createNotificationThunk = (name, defaultTitle, defaultBody) =>
  createAsyncThunk(
    `notification/${name}`,
    async (
      { receiverId, title = defaultTitle, body = defaultBody },
      { rejectWithValue }
    ) => {
      try {
        const response = await axios.post(
          API_BASE_URL,
          { title, body, receiverId },
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("hunterToken") ||
                localStorage.getItem("ProviderToken")
              }`,
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

export const acceptJobNotification = createNotificationThunk(
  "jobAcceptedNotification",
  "Provider have accepted your job",
  `Hi your job has been accepted`
);

export const assignedJobNotification = createNotificationThunk(
  "jobAssignedNotification",
  "Message from provider",
  "You have been assigned for this job"
);

export const completedJobNotification = createNotificationThunk(
  "jobCompletedNotification",
  "Message from provider",
  "You have completed this job"
);

export const reviewJobNotification = createNotificationThunk(
  "reviewNotification",
  "Message from provider",
  "You have received feedback from your Hunter"
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    lastNotificationType: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
    clearLastNotificationType: (state) => {
      state.lastNotificationType = null;
    },
  },
  extraReducers: (builder) => {
    const addNotificationCases = (thunk, type) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.notifications.push(action.payload);
          state.lastNotificationType = type;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    addNotificationCases(acceptJobNotification, "jobAccepted");
    addNotificationCases(assignedJobNotification, "jobAssigned");
    addNotificationCases(completedJobNotification, "jobCompleted");
    addNotificationCases(reviewJobNotification, "reviewReceived");
  },
});

export const { clearNotifications, clearLastNotificationType } =
  notificationSlice.actions;
export default notificationSlice.reducer;
