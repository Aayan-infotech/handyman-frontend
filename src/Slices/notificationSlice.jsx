import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance";
const API_BASE_URL = "/pushNotification/sendNotification";

const createNotificationThunk = (name, defaultTitle, defaultBody) =>
  createAsyncThunk(
    `notification/${name}`,
    async (
      { jobId, receiverId, title = defaultTitle, body = defaultBody },
      { rejectWithValue }
    ) => {
      try {
        const response = await axiosInstance.post(
          API_BASE_URL,
          { title, body, receiverId, jobId },
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
  "Provider is ready to quote your job",
);

export const assignedJobNotification = createNotificationThunk(
  "jobAssignedNotification",
  "Message from Hunter",
  // "You have been assigned for this job"
);

export const completedJobNotification = createNotificationThunk(
  "jobCompletedNotification",
  "Message from Hunter",
  "You have completed this job"
);

export const reviewJobNotification = createNotificationThunk(
  "reviewNotification",
  "Message from Hunter",
  "You have received feedback"
);

export const messageNotification = createNotificationThunk(
  "messageHunterNotification",
  " New message from Hunter",
  // "You have a new Message from "
  //  `You have a new Message from ${} for the job ${}`
);

export const messageNotificationProvider = createNotificationThunk(
  "messageHunterNotification",
  " New message from Hunter",
  "You have a new Message from "
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

    addNotificationCases(messageNotification, "messageReceived");
  },
});

export const { clearNotifications, clearLastNotificationType } =
  notificationSlice.actions;
export default notificationSlice.reducer;
