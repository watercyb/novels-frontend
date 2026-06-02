import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests, unauthorized } from "../utils/Toast";

const useCommentStore = create((set, get) => ({
  comments: [],
  page: 0,
  size: 5,
  totalPages: 0,
  isLoadingComments: false,
  isLoadingReplies: false,
  isPosting: false,
  error: null,

  getComments: async (chapterId) => {
    try {
      if (get().isLoadingComments) return;
      set({
        comments: [],
        isLoadingComments: true,
        totalPages: 0,
        error: null,
      });
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
      const len = get().comments.length;
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
            comments: [...get().comments, ...res.data.page.items],
            totalPages: res.data.page.totalPages,
          });
        } else {
          set({ error: res.data.message || "Error get comments" });
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get comments" });
      }
    } finally {
      set({ isLoadingComments: false });
    }
  },

  getReplies: async (commentId) => {
    try {
      set({ isLoadingReplies: true, error: null });
      const params = new URLSearchParams();
      params.append("commentId", commentId);
      const res = await axiosInstance.get("/comments?" + params.toString());
      if (res.data && res.data.success) {
        set({
          comments: get().comments.map((comment) =>
            comment.id == commentId
              ? { ...comment, replies: res.data.list }
              : comment,
          ),
        });
        return true;
      } else {
        set({ error: res.data.message || "Error get replies" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get replies" });
      }
      return false;
    } finally {
      set({ isLoadingReplies: false });
    }
  },

  postComment: async (chapterId, content) => {
    try {
      set({ comment: [], isPosting: true, error: null });
      const res = await axiosInstance.post("/comments", { chapterId, content });
      if (res.data && res.data.success) {
        return true;
      } else {
        set({ error: res.data.message || "Error post comment" });
        return false;
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else if (error.response.status == 401) {
        unauthorized();
      } else {
        set({ error: error.response.data.message || "Error post comment" });
      }
      return false;
    } finally {
      set({ isPosting: false });
    }
  },

  postReply: async (parentId, content) => {
    try {
      set({ isPosting: true, error: null });
      const res = await axiosInstance.post("/comments", { parentId, content });
      if (res.data && res.data.success) {
        console.log(get().comments);
        set({
          comments: get().comments.map((comment) =>
            comment.id == parentId
              ? {
                  ...comment,
                  replies: [res.data.comment, ...(comment.replies ?? [])],
                  commentCount: comment.commentCount + 1,
                }
              : comment,
          ),
        });
        console.log(get().comments);
        return true;
      } else {
        set({ error: res.data.message || "Error post reply" });
        return false;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status == 429) {
        tooManyRequests();
      } else if (error.response.status == 401) {
        unauthorized();
      } else {
        set({ error: error.response.data.message || "Error post reply" });
      }
      return false;
    } finally {
      set({ isPosting: false });
    }
  },
}));

export default useCommentStore;
