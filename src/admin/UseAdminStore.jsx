import { create } from "zustand";
import errorHandler from "../utils/ErrorHandler";
import axiosInstance from "../utils/axios";

const useAdminStore = create((set, get) => ({
  users: [],
  counts: {},
  user: null,
  novel: null,
  isLoading: false,
  isLoadingCounts: false,
  isUpdatingRole: false,
  currentPage: 0,
  size: 20,
  totalPages: 0,
  lastSearch: null,
  isLoadingUser: false,
  isDeletingUser: false,
  operation: null,
  isLoadingNovel: null,

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

  getCounts: async () => {
    try {
      set({ isLoadingCounts: true });
      const res = await axiosInstance.get("/admin/count");
      if (res.data && res.data.success) {
        set({ counts: res.data.counts });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ counts: {} });
      errorHandler(set, error, "Error get counts", false);
    } finally {
      set({ isLoadingCounts: false });
    }
  },

  updateRole: async (userId, role) => {
    try {
      set({ isUpdatingRole: true });
      const res = await axiosInstance.post(`/admin/user/${userId}`, { role });
      if (res.data && res.data.success) {
        set({
          users: get().users.map((user) =>
            user.id === userId ? { ...user, role } : user,
          ),
        });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ counts: {} });
      errorHandler(set, error, "Error update role", true);
      return false;
    } finally {
      set({ isUpdatingRole: false });
    }
  },

  getUser: async (userId) => {
    try {
      set({ isLoadingUser: true, error: null });
      const res = await axiosInstance.get(`/auth/${userId}`);
      if (res.data && res.data.success) {
        set({ user: res.data.user });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ user: null });
      errorHandler(set, error, "Error get user", false);
    } finally {
      set({ isLoadingUser: false });
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ isDeletingUser: true, error: null });
      const res = await axiosInstance.delete(`/admin/user/${userId}`);
      if (res.data && res.data.success) {
        if (get().user?.id == userId) set({ user: null });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete user", true);
      return false;
    } finally {
      set({ isDeletingUser: false });
    }
  },

  deleteNovel: async (novelId, reason) => {
    try {
      if (!get().user) return;
      set({ operation: "deleting_novel", error: null });
      const params = new URLSearchParams();
      params.append("reason", reason);
      const res = await axiosInstance.delete(
        `/admin/novels/${novelId}?` + params.toString(),
      );
      if (res.data && res.data.success) {
        set({
          user: {
            ...get().user,
            novels: get().user.novels.filter((novel) => novel.id != novelId),
          },
        });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete novel", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },

  getNovel: async (novelId) => {
    try {
      set({ isLoadingNovel: true });
      const res = await axiosInstance.get(`/admin/novels/${novelId}`);
      if (res.data && res.data.success) {
        set({ novel: res.data.novel });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ novel: {} });
      errorHandler(set, error, "Error get novel", true);
    } finally {
      set({ isLoadingNovel: false });
    }
  },

  deleteChapter: async (chapterId, reason) => {
    try {
      if (!get().novel) return;
      set({ operation: "deleting_chapter", error: null });
      const params = new URLSearchParams();
      params.append("reason", reason);
      const res = await axiosInstance.delete(
        `/admin/chapters/${chapterId}?` + params.toString(),
      );
      if (res.data && res.data.success) {
        set({
          novel: {
            ...get().novel,
            chapters: get().novel.chapters.filter(
              (chapter) => chapter.id != chapterId,
            ),
          },
        });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete chapter", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },
}));

export default useAdminStore;
