import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useUserStore = create((set) => ({
  user: {},
  author: {},
  error: null,
  favorites: [],
  likes: [],
  isLoading: false,
  isCheckingAuth: false,
  isLoadingAuthor: false,

  login: async (email, password) => {
    try {
      set({ isLoading: true });
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
        ) {
          set({ likes: resLikes.data.list, favorites: resFavs.data.list });
        } else {
          throw new Error(resUser.data);
        }
        return resUser.data.user.username;
      } else {
        throw new Error(resUser.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error logging in", false);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.post("/auth/signup", {
        username,
        email,
        password,
      });
      if (res.data && res.data.success) {
        set({ user: res.data.user });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error signing up", false);
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
        ) {
          set({ likes: resLikes.data.list, favorites: resFavs.data.list });
        } else {
          throw new Error(resUser.data);
        }
      } else {
        throw new Error(resUser.data);
      }
    } catch (error) {
      set({ user: null });
      errorHandler(set, error, "Error check auth", false);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.post("/auth/logout");
      if (!res.data || !res.data.success) throw new Error(res.data);
    } catch (error) {
      errorHandler(set, error, "Error logout", false);
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
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error forgot password", false);
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
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error reset password", false);
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
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error reset password", false);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (avatarImage, username) => {
    try {
      set({ isLoading: true, error: null });
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
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error change profile", true);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    try {
      await axiosInstance.post("/auth/refresh");
    } catch (error) {
      errorHandler(set, error, "Error get novel", false);
    }
  },

  getAuthor: async (authorId) => {
    try {
      set({ isLoadingAuthor: true, error: null });
      const res = await axiosInstance.get(`/auth/${authorId}`);
      if (res.data && res.data.success) {
        set({ author: res.data.user });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ author: null });
      errorHandler(set, error, "Error get author", false);
    } finally {
      set({ isLoadingAuthor: false });
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
