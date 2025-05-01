import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://18.209.91.97:7787/api",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("hunterToken") ||
      localStorage.getItem("ProviderToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if this is an authentication error
    if (error.response?.status === 401) {
      // Special case: If this is a refresh token request itself, don't retry
      if (originalRequest.url.includes("refreshtoken")) {
        localStorage.clear();
        window.location.href = "/welcome";
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        localStorage.getItem("hunterRefreshToken") ||
        localStorage.getItem("ProviderRefreshToken");
      const userType = localStorage.getItem("hunterToken")
        ? "hunter"
        : "provider";

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/welcome";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "http://18.209.91.97:7787/api/auth/refreshtoken",
          { refreshToken, userType },
          {
            // Important: Don't use axiosInstance here to avoid infinite loop
            baseURL: "http://18.209.91.97:7787/api",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const newToken = res.data.accessToken;

        // Store the new token
        if (userType === "hunter") {
          localStorage.setItem("hunterToken", newToken);
        } else {
          localStorage.setItem("ProviderToken", newToken);
        }

        // Update default headers
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/welcome";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
