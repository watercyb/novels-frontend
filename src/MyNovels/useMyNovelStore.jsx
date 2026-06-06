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

  //if (avatarImage) formData.append("avatarImage", avatarImage);
}));

export default useMyNovelStore;
