import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const useNovelStore = create((set) => ({
  novels: [],
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
      if (!size) size = 20;
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
      if (tags) params.append("tagIds", tags.join(" "));
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
        toast.error("Too many requests, please slow down");
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
      set({ tags: res.data.tags ?? [] });
    } catch (error) {
      if (error.response.status == 429) {
        toast.error("Too many requests, please slow down");
      } else {
        set({ error: error.response.data.message || "Error get novels" });
      }
    } finally {
      set({ isLoadingTags: false });
    }
  },
}));

export default useNovelStore;
