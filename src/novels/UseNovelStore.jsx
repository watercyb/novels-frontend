import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { tooManyRequests } from "../utils/Toast";

const useNovelStore = create((set) => ({
  novels: [],
  novel: null,
  tags: null,
  page: 0,
  size: 20,
  totalPages: 0,
  error: null,
  isLoading: false,
  isLoadingTags: false,

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
      const res = (await axiosInstance.get("/novels?" + params.toString())).data
        ?.page;

      if (res) {
        set({
          novels: res.items || [],
          page: res.page,
          size: res.size,
          totalPages: res.totalPages,
        });
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get novels" });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getTags: async () => {
    try {
      set({ isLoadingTags: true });
      const res = await axiosInstance.get("/tags");
      const tags = res.data?.tags ?? [];
      tags.sort((a, b) => b.tagUsage - a.tagUsage);
      set({ tags });
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get novels" });
      }
    } finally {
      set({ isLoadingTags: false });
    }
  },

  getNovel: async (novelId) => {
    try {
      set({ isLoading: true });
      const novel = (await axiosInstance.get(`/novels/${novelId}`))?.data
        ?.novel;
      if (novel) {
        novel.tags.sort((a, b) =>
          b.tagUsage == a.tagUsage ? a.id - b.id : b.tagUsage - a.tagUsage,
        );
        set({ novel });
      }
    } catch (error) {
      if (error.response.status == 429) {
        tooManyRequests();
      } else {
        set({ error: error.response.data.message || "Error get novel" });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useNovelStore;
