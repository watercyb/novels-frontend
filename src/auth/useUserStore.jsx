import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests } from "../utils/Toast";

const useUserStore = create((set) => ({
  user: {},
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
      if (resUser.data && resUser.data.success) {
        set({ user: resUser.data.user });
        const resLikes = await axiosInstance.get("/likes");
        const resFavs = await axiosInstance.get("/favorites/ids");
        if (
          resLikes.data &&
          resLikes.data.success &&
          resFavs.data &&
          resFavs.data.success
        )
          set({ likes: resLikes.data.list, favorites: resFavs.data.list });
        return resUser.data.user.username;
      } else {
        set({ error: resUser.data.message || "Error logging in" });
      }
      return null;
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error logging in" });
      }
      return null;
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
      if (res.data && res.data.success) {
        set({ user: res.data.user });
        return true;
      } else {
        set({ error: res.data.message || "Error signing up" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
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
      set({ isCheckingAuth: true, error: null });
      const resUser = await axiosInstance.get("/auth");
      if (resUser.data && resUser.data.success) {
        set({ user: resUser.data.user });
        const resLikes = await axiosInstance.get("/likes");
        const resFavs = await axiosInstance.get("/favorites/ids");
        if (
          resLikes.data &&
          resLikes.data.success &&
          resFavs.data &&
          resFavs.data.success
        )
          set({ likes: resLikes.data.list, favorites: resFavs.data.list });
      }
    } catch (error) {
      set({ user: null });
      if (error.response.status == 429) {
        tooManyRequests();
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
      const res = await axiosInstance.post("/auth/logout");
      if (!res.data || !res.data.success)
        set({ error: res.data.message || "Error logout" });
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error logout" });
      }
    } finally {
      document.cookie = "user=; Max-Age=0; path=/";
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
      const res = await axiosInstance.post("/auth/forgot_password", { email });
      if (res.data && res.data.success) {
        return true;
      } else {
        set({ error: res.data.message || "Error forgot password" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
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
      const res = await axiosInstance.post(`/auth/reset_password`, {
        email,
        code,
        password,
      });
      if (res.data && res.data.success) {
        return true;
      } else {
        set({ error: res.data.message || "Error reset password" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
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
      const res = await axiosInstance.post("/auth/update_password", {
        oldPassword,
        newPassword,
      });
      if (res.data && res.data.success) {
        return true;
      } else {
        set({ error: res.data.message || "Error reset password" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
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

      if (res.data && res.data.success) {
        set((state) => ({
          user: {
            ...state.user,
            username: res.data.user.username,
            avatarUrl: res.data.user.avatarUrl,
          },
        }));
        return true;
      } else {
        set({ error: res.data.message || "Error change profile" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error change profile" });
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
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error refresh token" });
      }
    }
  },

  setUser: (user) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useUserStore;
