import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useMessageStore = create((set, get) => ({
  messages: [],
  size: 20,
  totalItems: -1,
  isLoadingMessages: false,

  getMessages: async (reload) => {
    try {
      set({ isLoadingMessages: true, error: false });
      let page;
      const totalItems = get().totalItems;
      const size = get().size;
      const length = get().messages.length;

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
        if (res.data.page.page * res.data.page.size === get().messages.length) {
          set({
            messages: [...get().messages, ...res.data.page.items],
            totalItems: res.data.page.totalItems,
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
}));

export default useMessageStore;
