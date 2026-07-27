import { create } from "zustand";
import errorHandler from "../utils/ErrorHandler";
import axiosInstance from "../utils/axios";

const useAdminStore = create((set, get) => ({
  users: [],
  isLoading: false,
  currentPage: 0,
  size: 20,
  totalPages: 0,
  lastSearch: null,

  getUsers: async (idOrEmail, username, role, page) => {
    if (get().isLoading) return true;
    try {
      set({ isLoading: true });
      const params = new URLSearchParams();
      if (idOrEmail) {
        if (!idOrEmail.includes("@")) {
          params.append("id", idOrEmail);
        } else {
          params.append("email", idOrEmail);
        }
        const res = await axiosInstance.get("/admin/user?" + params.toString());
        if (res.data && res.data.success) {
          set({ users: [res.data.user], currentPage: 1, totalPages: 1 });
        } else {
          throw new Error(res.data);
        }
      } else {
        if (username && username.trim()) params.append("username", username);
        if (role && role.trim()) params.append("role", role);
        if (!page) page = 0;
        params.append("page", page);
        params.append("size", get().size);
        const res = await axiosInstance.get("/admin/user?" + params.toString());
        if (res.data && res.data.success) {
          set({
            users: res.data.users.items,
            currentPage: res.data.users.page,
            totalPages: res.data.users.totalPages,
          });
        } else {
          throw new Error(res.data);
        }
      }
      set({ lastSearch: [idOrEmail, username, role] });
      return true;
    } catch (error) {
      set({
        users: [],
        currentPage: 0,
        totalPages: 0,
      });
      errorHandler(set, error, "Error get users", false);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getUsersByPage: async (page) => {
    if (get().lastSearch) get().getUsers(...get().lastSearch, page);
  },
}));

export default useAdminStore;
