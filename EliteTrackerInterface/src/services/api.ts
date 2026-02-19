import axios from "axios";
import { localStorageKey } from "../constants/localStorageKey";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userData = localStorage.getItem(localStorageKey);

  const token: string = userData && JSON.parse(userData).token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
