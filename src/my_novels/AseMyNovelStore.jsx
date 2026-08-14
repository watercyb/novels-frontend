import { create } from "zustand";
import axiosInstance from "../utils/axios";
import errorHandler from "../utils/ErrorHandler";

const useMyNovelStore = create((set, get) => ({
  novels: [],
  novel: {},
  chapter: null,
  error: null,
  isLoadingMyNovels: false,
  isLoadingMyNovel: false,
  isUpdatingTitle: false,
  isUpdatingTags: false,
  isCreatingNovel: false,
  isDeletingNovel: false,
  isUpdatingDescription: false,
  isLoadingChapter: false,
  isValidInput: false,
  operation: null,

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
      set({ operation: "update_cover" });
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
      set({ operation: null });
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
      set({ operation: "deleting_novel" });
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
      set({ operation: null });
    }
  },

  updateTags: async (novelId, tags) => {
    try {
      set({ isUpdatingTags: true });
      const formData = new FormData();
      formData.append("id", novelId);
      formData.append("tags", tags);
      const res = await axiosInstance.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.success) {
        set({ novel: { ...get().novel, tags: res.data.novel.tags } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error update tags", true);
      return false;
    } finally {
      set({ isUpdatingTags: false });
    }
  },

  updateDescription: async (novelId, description) => {
    try {
      set({ isUpdatingDescription: true });
      const formData = new FormData();
      formData.append("id", novelId);
      formData.append("description", description);
      const res = await axiosInstance.post("/novels", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.success) {
        set({
          novel: { ...get().novel, description: res.data.novel.description },
        });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error update description", true);
      return false;
    } finally {
      set({ isUpdatingDescription: false });
    }
  },

  getChapter: async (chapterId) => {
    try {
      if (chapterId == -1) {
        set({ chapter: { id: -1, title: "", content: "" } });
        return true;
      }
      set({ isLoadingChapter: true });
      const res = await axiosInstance.get(
        `/chapters/my-novels/${chapterId}?adjacent=false`,
      );
      if (res.data && res.data.success) {
        set({ chapter: res.data.chapter[0] });
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      set({ chapter: null });
      errorHandler(set, error, "Error get chapter", false);
    } finally {
      set({ isLoadingChapter: false });
    }
  },

  createOrUpdateChapter: async (novelId, chapterId, title, content) => {
    try {
      set({
        operation: chapterId ? "save_chapter" : "create_chapter",
      });
      const res = await axiosInstance.post("/chapters", {
        novelId,
        chapterId,
        title,
        content,
      });
      if (res.data && res.data.success) {
        if (get().novel.chapters) {
          if (
            !get().novel.chapters.find((chapter) => chapter.id == chapterId)
          ) {
            set({
              novel: {
                ...get().novel,
                chapters: [...get().novel.chapters, res.data.chapter[0]],
              },
            });
          } else {
            set({
              novel: {
                ...get().novel,
                chapters: get().novel.chapters.map((chapter) =>
                  chapter.id == chapterId
                    ? chapter
                    : { ...chapter, title, content },
                ),
              },
            });
          }
        }
        set({ chapter: { ...get().chapter, title, content } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error create or update chapter", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },

  deleteChapter: async (chapterToDelete) => {
    try {
      set({ operation: "deleting_chapter" });
      const res = await axiosInstance.delete(`/chapters/${chapterToDelete.id}`);
      if (res.data && res.data.success) {
        const newNovel = {
          ...get().novel,
          chapters: get().novel.chapters.filter(
            (chapter) => chapter.id != chapterToDelete.id,
          ),
        };
        if (chapterToDelete.published) {
          newNovel.chapterCount--;
          newNovel.wordCount -= chapterToDelete.wordCount;
        }
        set({ novel: newNovel });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error delete chapter", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },

  publishChapter: async (chapterToPublish) => {
    try {
      set({ operation: "publish_chapter" });
      const res = await axiosInstance.post(
        `/chapters/${chapterToPublish.id}/publish`,
      );
      if (res.data && res.data.success) {
        if (get().novel.chapters) {
          const newNovel = { ...get().novel };
          newNovel.chapters = get().novel.chapters.map((chapter) =>
            chapter.id != chapterToPublish.id
              ? chapter
              : { ...chapter, published: true },
          );
          newNovel.wordCount += chapterToPublish.wordCount;
          newNovel.chapterCount++;
          set({ novel: newNovel });
        }
        set({ chapter: { ...get().chapter, published: true } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error publish chapter", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },

  clearChapter: () => {
    set({ chapter: null });
  },

  moveChapter: async (targetChapterId, movingChapterId) => {
    try {
      set({ operation: "moving_chapter" });
      const res = await axiosInstance.post("/chapters/move", {
        targetChapterId,
        movingChapterId,
      });
      if (res.data && res.data.success) {
        const newChapter = res.data.chapter[0];
        console.log(newChapter);
        const newChapters = get().novel.chapters.filter(
          (chapter) => chapter.id != newChapter.id,
        );
        let idx = 0;
        while (
          idx < newChapters.length &&
          newChapters[idx].orderIndex < newChapter.orderIndex
        ) {
          idx++;
        }
        if (
          idx < newChapters.length &&
          newChapters[idx].orderIndex == newChapter.orderIndex
        ) {
          for (let i = idx; i < newChapters.length; i++) {
            newChapters[i].orderIndex++;
          }
        }
        newChapters.splice(idx, 0, newChapter);
        set({ novel: { ...get().novel, chapters: newChapters } });
        return true;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      errorHandler(set, error, "Error move chapter", true);
      return false;
    } finally {
      set({ operation: null });
    }
  },
}));

export default useMyNovelStore;
