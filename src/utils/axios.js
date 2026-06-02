import axios from "axios";
import useUserStore from "../auth/useUserStore";
import { checkUserCookie } from "./cookie";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/auth/refresh")
    ) {
      await useUserStore.getState().logout();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!checkUserCookie()) return Promise.reject(error);

      try {
        await useUserStore.getState().refresh();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
