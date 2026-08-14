import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useChapterStore from "../chapters/UseChapterStore";
import useNovelStore from "./UseNovelStore";
import cover from "../assets/cover.png";
import { Link } from "react-router-dom";
import NotFoundPage from "../main/NotFoundPage";
import { useTranslation } from "react-i18next";
import CommentBox from "../comments/CommentBox";
import i18n from "../locales/i18n";
import { Heart, Star } from "lucide-react";
import useUserStore from "../auth/AseUserStore";

const NovelPage = () => {
  const { novelId } = useParams();
  const {
    novel,
    isLoading,
    isLiking,
    isFavoriting,
    getNovel,
    like,
    unlike,
    addFavorite,
    removeFavorite,
  } = useNovelStore();
  const { chapters, totalItems, error, getChapters } = useChapterStore();
  const loaderRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { likes, favorites } = useUserStore();

  useEffect(() => {
    getNovel(novelId);
    getChapters(novelId, true);
  }, [getChapters, getNovel, novelId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          !isLoading &&
          !error &&
          chapters.length < totalItems
        ) {
          await getChapters(novelId, false);
        }
      },
      {
        rootMargin: "300px",
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, getChapters, chapters.length, totalItems, novelId]);

  useEffect(() => {
    if (!isLoading && novel?.id == novelId)
      document.title = novel.title + " - Cat Novels";
  }, [isLoading, novel, novelId]);

  return (
    <div>
      {/* Loading */}
      {isLoading && !novel?.author && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {/* No Novel */}
      {!isLoading && !novel && <NotFoundPage />}
      {!isLoading && novel?.author && (
        <div className="min-h-screen bg-base-200">
          <div className="bg-base-100 md:shadow-lg md:border-b md:border-base-300">
            {/* Novel Info */}
            <div className="max-w-7xl mx-auto p-2 md:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Cover */}

                <div className="relative">
                  <img
                    src={
                      novel.coverUrl && novel.coverUrl.startsWith("http")
                        ? novel.coverUrl
                        : cover
                    }
                    alt={novel.title}
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = cover;
                    }}
                    className="p-6 md:p-0 md:w-36 md:h-51 rounded-2xl object-cover shrink-0 shadow-md"
                  />

                  <div className="absolute top-9 right-9 gap-4 flex md:hidden">
                    {isFavoriting && (
                      <span className="loading loading-spinner loading-lg size-6 mb-0.5"></span>
                    )}
                    {!isFavoriting && (
                      <Star
                        className={
                          favorites.has(Number(novelId))
                            ? "fill-red-500 text-red-500 cursor-pointer"
                            : "text-red-500 cursor-pointer"
                        }
                        onClick={() => {
                          if (!favorites.has(Number(novelId))) {
                            addFavorite(novelId);
                          } else {
                            removeFavorite(novelId);
                          }
                        }}
                      />
                    )}
                    <div>
                      {isLiking && (
                        <span className="loading loading-spinner loading-lg size-6 mb-0.5"></span>
                      )}
                      {!isLiking && (
                        <Heart
                          className={
                            likes.has(Number(novelId))
                              ? "fill-red-500 text-red-500 cursor-pointer"
                              : "text-red-500 cursor-pointer"
                          }
                          onClick={() => {
                            if (!likes.has(Number(novelId))) {
                              like(novelId);
                            } else {
                              unlike(novelId);
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold wrap-break-word">
                      {novel.title.trim().length == 0
                        ? t("untitled")
                        : novel.title}
                    </h1>

                    <div className="gap-4 hidden md:flex">
                      <div>
                        {isFavoriting && (
                          <span className="loading loading-spinner loading-lg size-6 mb-0.5"></span>
                        )}
                        {!isFavoriting && (
                          <Star
                            className={
                              favorites.has(Number(novelId))
                                ? "fill-red-500 text-red-500 cursor-pointer"
                                : "text-red-500 cursor-pointer"
                            }
                            onClick={() => {
                              if (!favorites.has(Number(novelId))) {
                                addFavorite(novelId);
                              } else {
                                removeFavorite(novelId);
                              }
                            }}
                          />
                        )}
                      </div>
                      <div>
                        {isLiking && (
                          <span className="loading loading-spinner loading-lg size-6 mb-0.5"></span>
                        )}
                        {!isLiking && (
                          <Heart
                            className={
                              likes.has(Number(novelId))
                                ? "fill-red-500 text-red-500 cursor-pointer"
                                : "text-red-500 cursor-pointer"
                            }
                            onClick={() => {
                              if (!likes.has(Number(novelId))) {
                                like(novelId);
                              } else {
                                unlike(novelId);
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="mt-3">
                    <Link
                      to={`/author/${novel.userId}`}
                      onClick={(e) => e.currentTarget.blur()}
                    >
                      <div className="badge badge-primary badge-outline">
                        {novel.author}
                      </div>
                    </Link>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {novel.tags?.map((tag) => (
                      <div
                        key={tag.id}
                        className="badge badge-outline badge-secondary cursor-pointer"
                        onClick={() => {
                          document.activeElement?.blur();
                          navigate(
                            `/all?search=&sortBy=Latest+Updated&sortOrder=desc&page=1&tags=${tag.id}`,
                          );
                        }}
                      >
                        {i18n.language == "en" ? tag.name : tag.nameCN}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                    <div className="stats shadow bg-base-200">
                      <div className="stat px-4 py-3">
                        <div className="stat-title">{t("type")}</div>
                        <div className="stat-value text-lg">
                          {t(novel.type)}
                        </div>
                      </div>
                    </div>

                    <div className="stats shadow bg-base-200">
                      <div className="stat px-4 py-3">
                        <div className="stat-title">{t("chapters")}</div>
                        <div className="stat-value text-lg">
                          {novel.chapterCount}
                        </div>
                      </div>
                    </div>

                    <div className="stats shadow bg-base-200">
                      <div className="stat px-4 py-3">
                        <div className="stat-title">{t("words")}</div>
                        <div className="stat-value text-lg">
                          {novel.wordCount}
                        </div>
                      </div>
                    </div>

                    <div className="stats shadow bg-base-200">
                      <div className="stat px-4 py-3">
                        <div className="stat-title">{t("likes")}</div>
                        <div className="stat-value text-lg">
                          {novel.likeCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Update */}
              {novel.lastChapterTitle && (
                <div className="mt-6">
                  <div className="text-sm opacity-60 md-1">
                    {t("latest_update")}
                  </div>

                  <div className="bg-base-200 rounded-2xl px-5 py-4">
                    <div className="font-medium wrap-break-word">
                      {novel.lastChapterTitle}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold md-2">{t("description")}</h2>
                <div className="bg-base-200 rounded-2xl p-5 leading-7 whitespace-pre-wrap wrap-break-word">
                  {novel.description}
                </div>
              </div>
            </div>

            {/* Chapter List */}
            <div className="max-w-7xl mx-auto py-6 md:p-6">
              <div className="pt-6 px-2 md:px-6 pb-4 bg-base-200">
                <div className="flex items-center justify-between md-5 mx-2 mb-4 md:mx-0">
                  <h2 className="text-3xl font-bold">{t("chapters")}</h2>

                  <div className="text-sm opacity-70">
                    {t("loaded")} {chapters.length - 1} / {totalItems - 1}
                  </div>
                </div>

                <div className="grid gap-1">
                  {chapters.map((chapter, index) =>
                    chapter.orderIndex == 0 ? (
                      <div key={chapter.id} />
                    ) : (
                      <div
                        key={chapter.id}
                        className="bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all border border-base-300"
                      >
                        <Link
                          to={`/chapter/${chapter.id}`}
                          onClick={(e) => e.currentTarget.blur()}
                        >
                          <button className="w-full text-left px-5 py-2 cursor-pointer">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-lg truncate">
                                  {chapter.title}
                                </div>
                              </div>

                              <div className="badge badge-outline shrink-0">
                                #{index}
                              </div>
                            </div>
                          </button>
                        </Link>
                      </div>
                    ),
                  )}
                </div>

                {/* Infinite Scroll Trigger */}
                <div ref={loaderRef} className="flex justify-center mt-4">
                  {isLoading ? (
                    <span className="loading loading-spinner loading-lg"></span>
                  ) : (
                    chapters.length < totalItems &&
                    (error ? (
                      <div
                        onClick={() => getChapters(novelId, false)}
                        className="text-sm opacity-60 cursor-pointer hover:opacity-100 hover:underline"
                      >
                        {t("error_load_chapters")}
                      </div>
                    ) : (
                      <div className="text-sm opacity-60">
                        {t("scroll_to_load")}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-1 py-6 md:p-6">
              <CommentBox chapterId={chapters[0]?.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovelPage;
