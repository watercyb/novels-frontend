import { useEffect, useState } from "react";
import {
  Heart,
  BookOpen,
  FileText,
  Clock3,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import useNovelStore from "./UseNovelStore";
import { useTranslation } from "react-i18next";
import { formatDateString } from "../utils/formatDate";

const NovelPage = ({ type }) => {
  const { novels, isLoading, getNovels, page, totalPages } = useNovelStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "Latest Updated";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const currentPage = Number(searchParams.get("page") || "1");
  const [keywords, setKeywords] = useState(search);
  const { t } = useTranslation();

  let title = t("menu_all_novels");
  if (type == "original") {
    title = t("menu_ori_novels");
  } else if (type == "translation") {
    title = t("menu_tran_novels");
  }
  const sortOptions = [
    "Chapters",
    "Latest Updated",
    "Likes",
    "Relevance",
    "Words",
  ];

  const sortDetails = {
    Chapters: ["Chapters", "desc", "chapter_count", t("sort_chapter")],
    "Latest Updated": [
      "Latest Updated",
      "desc",
      "last_updated_at",
      t("sort_lastest"),
    ],
    Likes: ["Likes", "desc", "like_count", t("sort_like")],
    Relevance: ["Relevance", "desc", "", t("sort_relevance")],
    Words: ["Words", "desc", "word_count", t("sort_word")],
  };

  const updateParams = (newParams) => {
    setSearchParams({
      search,
      sortBy,
      sortOrder,
      page: currentPage,
      ...newParams,
    });
  };

  useEffect(() => {
    getNovels(
      search,
      null,
      currentPage - 1,
      20,
      sortDetails[sortBy][2],
      sortOrder == "asc",
      type,
    ); //search, tags, page, size, sort, asc, type
  }, [currentPage, getNovels, search, sortOrder, sortBy, type]);

  const sortChangeHandler = (name) => {
    const selection = sortDetails[name]
      ? sortDetails[name]
      : sortDetails["Latest Updated"];

    let newSortOrder;
    if (name === sortBy) {
      if (name === "Relevance") return;
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      newSortOrder = selection[1];
    }
    updateParams({ page: 1, sortBy: name, sortOrder: newSortOrder });
  };
  
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>

          <div className="flex justify-center items-center gap-2 my-4">
            {/* Search */}
            <label className="input input-bordered flex justify-center items-center gap-2 w-full sm:w-80">
              <Search size={18} />

              <input
                type="text"
                className="grow"
                placeholder={t("search_novels")}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </label>

            <button
              onClick={() => {
                if (keywords != search) {
                  updateParams({ search: keywords, sortBy: "Relevance" });
                }
              }}
              className="btn btn-outline"
            >
              {t("search")}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Sort */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn">
                {t("sort")}: {sortDetails[sortBy][3]}{" "}
                {sortBy != "Relevance" && (sortOrder === "asc" ? "↑" : "↓")}
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-10 w-56 p-2 shadow"
              >
                {sortOptions.map((name) => (
                  <li key={name}>
                    <button onClick={() => sortChangeHandler(name)}>
                      <span>{sortDetails[name][3]}</span>

                      {name === sortBy && name != "Relevance" && (
                        <span className="text-xs opacity-70">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Novel List */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {novels.map((novel) => (
              <div
                key={novel.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
              >
                <div className="card-body">
                  <div className="flex gap-5">
                    {/* Cover */}
                    <img
                      src={novel.coverUrl}
                      alt={novel.title}
                      className="w-28 h-40 rounded-xl object-cover shrink-0"
                    />

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0">
                      {/* Title */}
                      <h2 className="text-2xl font-bold line-clamp-2">
                        {novel.title}
                      </h2>

                      {/* Author */}
                      <div className="mt-2">
                        <div className="badge badge-primary badge-outline">
                          {novel.author}
                        </div>
                      </div>

                      {/* Last Update */}
                      <div className="mt-3">
                        <p className="text-sm opacity-70 mb-1">
                          {t("last_update")}
                        </p>

                        <p className="font-medium line-clamp-1">
                          {novel.lastChapterTitle}
                        </p>

                        <div className="flex items-center gap-2 text-sm opacity-70 mt-1">
                          <Clock3 size={14} />

                          <span>{formatDateString(novel.lastUpdatedAt)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 mt-auto pt-5 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart size={16} className="text-error" />

                          <span>{novel.likeCount.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <BookOpen size={16} />

                          <span>{novel.chapterCount.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <FileText size={16} />

                          <span>{novel.wordCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && novels.length === 0 && (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold mb-2">No novels found</h2>

            <p className="opacity-70">Try changing your search or sorting.</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 0 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              className="btn btn-outline"
              disabled={currentPage <= 1}
              onClick={() => {
                const newPage = Math.min(
                  Math.max(currentPage - 1, 1),
                  totalPages,
                );
                if (newPage != currentPage) updateParams({ page: newPage });
              }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="font-medium">
              Page {page + 1} / {totalPages}
            </div>

            <button
              className="btn btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => {
                const newPage = Math.max(
                  Math.min(currentPage + 1, totalPages),
                  1,
                );
                if (newPage != currentPage) updateParams({ page: newPage });
              }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelPage;
