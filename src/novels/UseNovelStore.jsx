import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";
import useUserStore from "../auth/useUserStore";

const useNovelStore = create((set) => ({
  novels: [],
  novel: {},
  tags: null,
  page: 0,
  size: 20,
  totalPages: 0,
  error: null,
  isLoading: false,
  isLoadingTags: false,
  isLiking: false,
  isFavoriting: false,

  getNovels: async (search, tags, page, size, sort, asc, type) => {
    try {
      set({ isLoading: true });
      const params = new URLSearchParams();
      if (search && search.trim()) params.append("title", search);
      if (page === undefined) page = -1;
      if (!size) size = 10;
      params.append("page", page);
      params.append("size", size);
      if (sort && sort.length > 0) {
        if (asc) {
          sort += ",asc";
        } else {
          sort += ",desc";
        }
        params.append("sort", sort);
      }
      if (!type) type = "all";
      params.append("type", type);
      if (tags) params.append("tagIds", tags);
      const res = await axiosInstance.get("/novels?" + params.toString());

      if (res.data && res.data.success) {
        const page = res.data.page;
        set({
          novels: page.items || [],
          page: page.page,
          size: page.size,
          totalPages: page.totalPages,
        });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error get novels", true);
    } finally {
      set({ isLoading: false });
    }
  },

  getTags: async () => {
    try {
      set({ isLoadingTags: true });
      const res = await axiosInstance.get("/tags");
      if (res.data && res.data.success) {
        const tags = res.data?.tags ?? [];
        tags.sort((a, b) => b.tagUsage - a.tagUsage);
        set({ tags });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error get tags", true);
    } finally {
      set({ isLoadingTags: false });
    }
  },

  getNovel: async (novelId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/novels/${novelId}`);

      if (res.data && res.data.success) {
        const novel = res.data.novel;
        novel.tags.sort((a, b) =>
          b.tagUsage == a.tagUsage ? a.id - b.id : b.tagUsage - a.tagUsage,
        );
        set({ novel });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ novel: null });
      errorHandler(set, error, "Error get novel", true);
    } finally {
      set({ isLoading: false });
    }
  },

  like: async (novelId) => {
    try {
      set({ isLiking: true });
      const res = await axiosInstance.put(`/likes/${novelId}`);

      if (res.data && res.data.success) {
        useUserStore.getState().addLike(novelId);
        set((state) => ({
          novel: { ...state.novel, likeCount: state.novel.likeCount + 1 },
        }));
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error like novel", true);
    } finally {
      set({ isLiking: false });
    }
  },

  unlike: async (novelId) => {
    try {
      set({ isLiking: true });
      const res = await axiosInstance.delete(`/likes/${novelId}`);

      if (res.data && res.data.success) {
        useUserStore.getState().removeLike(novelId);
        set((state) => ({
          novel: { ...state.novel, likeCount: state.novel.likeCount - 1 },
        }));
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error unlike novel", true);
    } finally {
      set({ isLiking: false });
    }
  },

  addFavorite: async (novelId) => {
    try {
      set({ isFavoriting: true });
      const res = await axiosInstance.put(`/favorites/${novelId}`);

      if (res.data && res.data.success) {
        useUserStore.getState().addFavorite(novelId);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error add favorite", true);
    } finally {
      set({ isFavoriting: false });
    }
  },

  removeFavorite: async (novelId) => {
    try {
      set({ isFavoriting: true });
      const res = await axiosInstance.delete(`/favorites/${novelId}`);

      if (res.data && res.data.success) {
        useUserStore.getState().removeFavorite(novelId);
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error remove favorite", true);
    } finally {
      set({ isFavoriting: false });
    }
  },
}));

export default useNovelStore;
