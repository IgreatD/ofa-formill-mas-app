import axios from "axios";
import { getToken } from "./auth";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

http.interceptors.response.use((response) => {
  return response;
});

export default http;
