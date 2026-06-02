import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests } from "../utils/Toast";

const useCommentStore = create((set, get) => ({
  comments: [],
  page: 0,
  size: 20,
  totalPages: 0,
  isLoadingComments: false,
  isLoadingReplys: false,
  error: null,

  getComments: async (chapterId) => {
    try {
      set({ comment: [], isLoadingComments: true, error: null });
      const size = get().size;
      const params = new URLSearchParams();
      params.append("chapterId", chapterId);
      params.append("page", 0);
      params.append("size", size);
      const res = await axiosInstance.get("/comments?" + params.toString());
      if (res.data && res.data.success) {
        set({
          comments: [...get().comments, ...res.data.page.items],
          totalPages: res.data.page.totalPages,
        });
      } else {
        set({ error: res.data.message || "Error get comments" });
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
      const loadedPages = Math.trunc((len + size - 1) / size);
      if (loadedPages < totalPages) {
        const params = new URLSearchParams();
        params.append("chapterId", chapterId);
        params.append("page", loadedPages);
        params.append("size", size);
        const res = await axiosInstance.get("/comments?" + params.toString());
        if (res.data && res.data.success) {
          set({
            Comments: [...get().Comments, ...res.data.page.items],
            totalPages: res.data.page.totalPages,
          });
        } else {
          set({ error: res.data.message || "Error get comments" });
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
      const res = await axiosInstance.get("/comments?" + params.toString());
      if (res.data && res.data.success) {
        set({
          Comments: get().Comments.map((comment) =>
            comment.id == commentId
              ? { ...comment, replys: res.data.list }
              : comment,
          ),
        });
      } else {
        set({ error: res.data.message || "Error get replys" });
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
