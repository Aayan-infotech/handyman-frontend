import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://api.tradehunters.com.au/api",
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

// Request Interceptor
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

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Special case: Don't retry refresh token requests
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
        "http://api.tradehunters.com.au/api/auth/refreshtoken",
        { refreshToken, userType },
        {
          baseURL: "http://api.tradehunters.com.au/api",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newToken = res.data.accessToken;
      const tokenKey = userType === "hunter" ? "hunterToken" : "ProviderToken";

      localStorage.setItem(tokenKey, newToken);
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
);

export default axiosInstance;
