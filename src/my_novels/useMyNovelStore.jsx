import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useMyNovelStore = create((set, get) => ({
  novels: [],
  novel: {},
  isLoadingMyNovels: false,
  isLoadingMyNovel: false,
  isUpdatingTitle: false,
  isUpdateingTags: false,
  isUpdatingCover: false,
  isCreatingNovel: false,
  isDeletingNovel: false,

  getNovels: async () => {
    try {
      set({ isLoadingMyNovels: true });
      const res = await axiosInstance.get("/novels/my-novels");
      if (res.data && res.data.success) {
        set({ novels: res.data.novels });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ novels: [] });
      errorHandler(set, error, "Error get novels", false);
    } finally {
      set({ isLoadingMyNovels: false });
    }
  },

  getNovel: async (novelId) => {
    try {
      set({ isLoadingMyNovel: true });
      const res = await axiosInstance.get(`/novels/my-novels/${novelId}`);
      if (res.data && res.data.success) {
        set({ novel: res.data.novel });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ novel: {} });
      errorHandler(set, error, "Error get novel", false);
    } finally {
      set({ isLoadingMyNovel: false });
    }
  },

  updateTitle: async (novelId, title) => {
    try {
      set({ isUpdatingTitle: true });
      const formData = new FormData();
      formData.append("id", novelId);
      formData.append("title", title);
      const res = await axiosInstance.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.success) {
        set({ novel: { ...get().novel, title: res.data.novel.title } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error update title", true);
      return false;
    } finally {
      set({ isUpdatingTitle: false });
    }
  },

  updateCoverImage: async (novelId, coverImage) => {
    try {
      set({ isUpdatingCover: true });
      const formData = new FormData();
      formData.append("id", novelId);
      formData.append("coverImage", coverImage);
      const res = await axiosInstance.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.success) {
        set({ novel: { ...get().novel, coverUrl: res.data.novel.coverUrl } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error update cover", true);
      return false;
    } finally {
      set({ isUpdatingCover: false });
    }
  },

  createNovel: async (coverImage, title, description, type, tags) => {
    try {
      set({ isCreatingNovel: true });
      const formData = new FormData();
      if (coverImage) formData.append("coverImage", coverImage);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("tags", tags);
      const res = await axiosInstance.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.success) {
        set({ novels: [res.data.novel, ...get().novels] });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete novel", true);
      return false;
    } finally {
      set({ isCreatingNovel: false });
    }
  },

  deleteNovel: async (novelId) => {
    try {
      set({ isDeletingNovel: true });
      const res = await axiosInstance.delete(`/novels/${novelId}`);
      if (res.data && res.data.success) {
        set({
          novels: [...get().novels.filter((novel) => novel.id != novelId)],
        });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error create novel", true);
      return false;
    } finally {
      set({ isDeletingNovel: false });
    }
  },
}));

export default useMyNovelStore;
