// src/api/axiosInstance.js
import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const REACT_APP_BASE_URL = "http://54.236.98.193:7777/api/";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL,
  withCredentials: true, // allows sending cookies with requests
});

// Add interceptor to set token from cookies
axiosInstance.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.statusText}`);
    } else {
      console.error("Network error or no response from server");
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
