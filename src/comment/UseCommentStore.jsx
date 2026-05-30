import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests } from "../utils/Toast";

const useCommentStore = create((set, get) => ({
  Comments: [],
  page: 0,
  size: 20,
  totalPages: 0,
  isLoadingComments: false,
  isLoadingReplys: false,
  error: null,

  getComments: async (chapterId) => {
    try {
      set({ isLoadingComments: true, error: null });
      const size = get().size;
      const params = new URLSearchParams();
      params.append("chapterId", chapterId);
      params.append("page", 0);
      params.append("size", size);
      const res = (await axiosInstance.get("/comments?" + params.toString()))
        .data?.page;
      if (!res || !res.items || !res.totalPages) {
        set({ error: true });
      } else {
        set({
          Comments: [...get().Comments, ...res.items],
          totalPages: res.totalPages,
        });
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get comments" });
      }
    } finally {
      set({ isLoadingComments: false });
    }
  },

  getMoreComments: async (chapterId) => {
    try {
      set({ isLoadingComments: true, error: null });
      const len = get().Comments.length;
      const size = get().size;
      const totalPages = get().totalPages;
      const loadedPages = Math.trunc(len / size);
      if (loadedPages + 1 < totalPages) {
        const params = new URLSearchParams();
        params.append("chapterId", chapterId);
        params.append("page", loadedPages + 1);
        params.append("size", size);
        const res = (await axiosInstance.get("/comments?" + params.toString()))
          .data?.page;
        if (!res || !res.items || !res.totalPages) {
          set({ error: true });
        } else {
          set({
            Comments: [...get().Comments, ...res.items],
            totalPages: res.totalPages,
          });
        }
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get comments" });
      }
    } finally {
      set({ isLoadingComments: false });
    }
  },

  getReplys: async (commentId) => {
    try {
      set({ isLoadingReplys: true, error: null });
      const params = new URLSearchParams();
      params.append("commentId", commentId);
      const res = (await axiosInstance.get("/comments?" + params.toString()))
        .data?.list;
      if (!res) {
        set({ error: true });
      } else {
        set({
          Comments: get().Comments.map((comment) =>
            comment.id == commentId ? { ...comment, replys: res } : comment,
          ),
        });
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get replys" });
      }
    } finally {
      set({ isLoadingReplys: false });
    }
  },
}));

export default useCommentStore;
