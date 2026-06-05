import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useMyNovelStore = create((set) => ({
  novels: [],
  isLoadingMyNovels: false,

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
      errorHandler(set, error, "Error get novels", false);
      return null;
    } finally {
      set({ isLoadingMyNovels: false });
    }
  },
}));

export default useMyNovelStore;
