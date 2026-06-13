import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

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
      const res = await axiosInstance.get("/chapters?" + params.toString());
      if (res.data && res.data.success) {
        if (res.data.page.page * res.data.page.size === get().chapters.length) {
          set({
            chapters: [...get().chapters, ...res.data.page.items],
            totalItems: res.data.page.totalItems,
          });
        }
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error get novchaptersel", true);
    } finally {
      set({ isLoadingChpaters: false });
    }
  },

  getChapter: async (chapterId) => {
    try {
      set({ isLoadingChapter: true, error: false, chapter: null });
      const params = new URLSearchParams();
      params.append("adjacent", true);
      const res = await axiosInstance.get(
        "/chapters/" + chapterId + "?" + params.toString(),
      );
      if (res.data && res.data.success) {
        const chapter = res.data.chapter;
        if (chapter[1].orderIndex != 0) {
          set({ prv: chapter[1] });
        } else {
          set({ prv: null });
        }
        if (chapter[2]) {
          set({ next: chapter[2] });
        } else {
          set({ next: null });
        }
        set({ chapter: chapter[0] });
        return chapter[0];
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error get chapter", true);
      return null;
    } finally {
      set({ isLoadingChapter: false });
    }
  },
}));

export default useChapterStore;
