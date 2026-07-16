import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useHomepageStore = create((set) => ({
  topTen: null,
  recentTen: null,
  isLoadingHomepage: false,

  getHomepage: async () => {
    try {
      set({ isLoadingHomepage: false });
      const res = await axiosInstance.get("/homepage");
      if (res.data && res.data.success) {
        set({
          topTen: [...(res.data.topTen ?? []), ...(res.data.topTen ?? [])],
          recentTen: [...(res.data.topTen ?? []), ...(res.data.topTen ?? [])],
        });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({
        topTen: [],
        recentTen: [],
      });
      errorHandler(set, error, "Error get comments", true);
    } finally {
      set({ isLoadingHomepage: false });
    }
  },
}));

export default useHomepageStore;
