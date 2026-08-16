import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";
import useUserStore from "../auth/UseUserStore";

const useMessageStore = create((set, get) => ({
  messages: null,
  size: 20,
  totalItems: -1,
  isLoadingMessages: false,
  isSendingMessage: false,

  getMessages: async (reload) => {
    try {
      set({ isLoadingMessages: true, error: false });
      let page;
      const totalItems = get().totalItems;
      const size = get().size;
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
      const res = await axiosInstance.get("/messages?" + params.toString());

      if (res.data && res.data.success) {
        if (
          res.data.page.page * res.data.page.size ===
          (get().messages?.length ?? 0)
        ) {
          set({
            messages: [...(get().messages ?? []), ...res.data.page.items],
          });
        }
        set({
          totalItems: res.data.page.totalItems,
        });
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
      const res = await axiosInstance.post(`/messages/${messageId}`);
      if (res.data && res.data.success) {
        set({
          messages: get().messages.map((message) =>
            message?.id == messageId ? { ...message, read: true } : message,
          ),
        });
        useUserStore.getState().updateUnread(-1);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error read message", true);
    }
  },

  deleteMessage: async (message) => {
    try {
      set({ error: false });
      const res = await axiosInstance.delete(`/messages/${message.id}`);
      if (res.data && res.data.success) {
        set({
          messages: get().messages.filter((msg) => msg?.id != message.id),
        });
        if (!message.read) useUserStore.getState().updateUnread(-1);
        set({totalItems: get().totalItems - 1});
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete message", true);
    }
  },

  sendMessage: async (recipientId, content) => {
    try {
      set({ isSendingMessage: true, error: false });
      const res = await axiosInstance.post("/messages", {
        recipientId,
        content,
      });
      if (res.data && res.data.success) {
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete message", true);
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));

export default useMessageStore;
