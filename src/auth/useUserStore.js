import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  user: [],
  error: null,
  favorites: [],
  likes: [],
  isLoading: false,
  isCheckingAuth: false,

  login: async (email, password) => {
    try {
      set({ isLoading: true, isRateLimited: false });
      const resUser = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: resUser.data.user });
      const resLikes = await axiosInstance.get("/likes");
      const resFavs = await axiosInstance.get("/favorites/ids");
      set({ likes: resLikes.data.list, favorites: resFavs.data.list });
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error logging in" });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null, isRateLimited: false });
      const res = await axiosInstance.post("/auth/signup", {
        username,
        email,
        password,
      });
      set({ user: res.data.user });
      return true;
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error signing up" });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      console.log(getCookie("accessToken"));
      console.log(getCookie("refreshToken"));
      set({ isCheckingAuth: true, error: null });
      const resUser = await axiosInstance.get("/auth");
      set({ user: resUser.data.user });
      const resLikes = await axiosInstance.get("/likes");
      const resFavs = await axiosInstance.get("/favorites/ids");
      set({ likes: resLikes.data.list, favorites: resFavs.data.list });
    } catch (error) {
      set({ user: null });
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else if (error.response.status != 401) {
        set({ error: error.response.data.message || "Error check auth" });
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error logout" });
      }
    } finally {
      set({
        user: null,
        likes: [],
        favorites: [],
      });
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post("/auth/forgot_password", { email });
      return true;
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error forgot password" });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email, code, password) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post(`/auth/reset_password`, {
        email,
        code,
        password,
      });
      return true;
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error reset password" });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (oldPassword, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post("/auth/update_password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password updated successfully");
      return true;
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error change password" });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (avatarImage, username) => {
    try {
      set({ isLoading: true, error: null, isRateLimited: false });
      const formData = new FormData();
      formData.append("username", username);
      if (avatarImage) formData.append("avatarImage", avatarImage);
      const res = await axiosInstance.post("/auth/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        user: {
          ...state.user,
          username: res.data.user.username,
          avatarUrl: res.data.user.avatarUrl,
        },
      }));
      toast.success("User updated successfully");
      return true;
    } catch (error) {
      if (error.response.status == 429) {
        set({ isRateLimited: true });
        set({ error: "Too many requests, please slow down" });
      } else {
        set({ error: error.response.data.message || "Error change username" });
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    try {
      await axiosInstance.post("/auth/refresh");
    } catch (error) {
      if (error.response.status == 429)
        toast.error("Too many requests, please slow down");
    }
  },

  setUser: (user) => {
    set({ user });
  },
}));

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }

  return null;
};

export default useUserStore;
