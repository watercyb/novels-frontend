import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests } from "../utils/Toast";

const useChapterStore = create((set, get) => ({
  chapters: [],
  chapter: null,
  prv: null,
  next: null,
  size: 5,
  totalItems: -1,
  error: false,
  isLoadingChpaters: false,
  isLoadingChapter: false,

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
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get chapters" });
      }
    } finally {
      set({ isLoadingChpaters: false });
    }
  },

  getChapter: async (chapterId) => {
    try {
      set({ isLoadingChapter: true, error: false });
      const params = new URLSearchParams();
      params.append("adjacent", true);
      const res = (
        await axiosInstance.get(
          "/chapters/" + chapterId + "?" + params.toString(),
        )
      ).data?.chapter;
      if (!res || res.length == 0) {
        set({ error: true });
      } else {
        if (res[1].orderIndex != 0) {
          set({ prv: res[1] });
        } else {
          set({ prv: null });
        }
        if (res[2]) {
          set({ next: res[2] });
        } else {
          set({ next: null });
        }
        set({ chapter: res[0] });
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get chapter" });
      }
    } finally {
      set({ isLoadingChapter: false });
    }
  },
}));

export default useChapterStore;
