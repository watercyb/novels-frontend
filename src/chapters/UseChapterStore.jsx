import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useChapterStore = create((set, get) => ({
  chapters: [],
  size: 5,
  totalItems: -1,
  error: false,
  isLoadingChpaters: false,

  getChapters: async (novelId, reload) => {
    try {
      set({ isLoadingChpaters: true, error: false });
      let page;
      const totalItems = get().totalItems;
      const size = get().size;
      const length = get().chapters.length;

      if (totalItems == -1 || reload) {
        set({ totalItems: 0 });
        set({ chapters: [] });
        page = 0;
      } else {
        if (length == totalItems) return;
        page = Math.floor((length + size - 1) / size);
      }
      const params = new URLSearchParams();
      params.append("novelId", novelId);
      params.append("page", page);
      params.append("size", size);
      const res = (await axiosInstance.get("/chapters?" + params.toString()))
        .data?.page;
      if (!res || !res.items || !res.totalPages) {
        set({ error: true });
      } else {
        if (res.page * res.size === get().chapters.length) {
          set({
            chapters: [...get().chapters, ...res.items],
            totalItems: res.totalItems,
          });
        }
      }
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error get chapters" });
      }
    } finally {
      set({ isLoadingChpaters: false });
    }
  },
}));

export default useChapterStore;
