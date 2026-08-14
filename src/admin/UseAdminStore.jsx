import { create } from "zustand";
import errorHandler from "../utils/ErrorHandler";
import axiosInstance from "../utils/axios";

const useAdminStore = create((set, get) => ({
  users: [],
  counts: {},
  user: null,
  novel: null,
  messages: null,
  unreadCount: null,
  isLoading: false,
  isLoadingCounts: false,
  isUpdatingRole: false,
  userCurrentPage: 0,
  userSize: 20,
  userTotalPages: 0,
  messageSize: 20,
  messageTotalItems: -1,
  lastSearch: null,
  isLoadingUser: false,
  isDeletingUser: false,
  operation: null,
  isLoadingNovel: false,
  isLoadingUnreadCount: false,
  isLoadingMessages: false,

  getUsers: async (idOrEmail, username, role, page) => {
    if (get().isLoading) return true;
    try {
      set({ isLoading: true });
      const params = new URLSearchParams();
      if (idOrEmail) {
        if (typeof idOrEmail === "number" || !idOrEmail.includes("@")) {
          params.append("id", idOrEmail);
        } else {
          params.append("email", idOrEmail);
        }
        const res = await axiosInstance.get("/admin/user?" + params.toString());
        if (res.data && res.data.success) {
          set({
            users: [res.data.user],
            userCurrentPage: 1,
            userTotalPages: 1,
          });
        } else {
          throw new Error(res.data);
        }
      } else {
        if (username && username.trim()) params.append("username", username);
        if (role && role.trim()) params.append("role", role);
        if (!page) page = 0;
        params.append("page", page);
        params.append("size", get().userSize);
        const res = await axiosInstance.get("/admin/user?" + params.toString());
        if (res.data && res.data.success) {
          set({
            users: res.data.users.items,
            userCurrentPage: res.data.users.page,
            userTotalPages: res.data.users.totalPages,
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
        userCurrentPage: 0,
        userTotalPages: 0,
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

  getUnreadCount: async () => {
    try {
      set({ isLoadingUnreadCount: true });
      const res = await axiosInstance.get("/admin/messages/count");
      if (res.data && res.data.success) {
        set({ unreadCount: res.data.unreadCount });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ unreadCount: 0 });
      errorHandler(set, error, "Error get unread count", false);
    } finally {
      set({ isLoadingUnreadCount: false });
    }
  },

  getMessages: async (reload) => {
    try {
      set({ isLoadingMessages: true, error: false });
      let page;
      const totalItems = get().messageTotalItems;
      const size = get().messageSize;
      const length = get().messages?.length ?? 0;

      if (totalItems == -1 || reload) {
        set({ totalItems: 0, chapters: [] });
        page = 0;
      } else {
        if (length == totalItems) return;
        page = Math.floor((length + size - 1) / size);
      }
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("size", size);
      const res = await axiosInstance.get(
        "/admin/messages?" + params.toString(),
      );
      if (res.data && res.data.success) {
        if (
          res.data.messages.page * res.data.messages.size ===
          (get().messages?.length ?? 0)
        ) {
          set({
            messages: [...(get().messages ?? []), ...res.data.messages.items],
            totalItems: res.data.messages.totalItems,
          });
        }
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error get messages", true);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  readMessage: async (messageId) => {
    try {
      set({ error: false });
      const res = await axiosInstance.post(`/admin/messages/${messageId}`);
      if (res.data && res.data.success) {
        set({
          messages: get().messages.map((message) =>
            message?.id == messageId ? { ...message, read: true } : message,
          ),
        });
        set({ unreadCount: get().unreadCount - 1 });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error read message", true);
    }
  },
}));

export default useAdminStore;
