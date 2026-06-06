import { useEffect, useState } from "react";
import useUserStore from "../auth/useUserStore";
import useMyNovelStore from "./useMyNovelStore";
import { t } from "i18next";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NotFoundPage from "../main/NotFoundPage";
import cover from "../assets/cover.png";
import i18n from "../locales/i18n";
import useNovelStore from "../novels/UseNovelStore";

const MyNovel = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useUserStore();
  const {
    novel,
    isLoadingMyNovel,
    isUpdatingTitle,
    isUpdateingTags,
    getNovel,
    updateTitle,
  } = useMyNovelStore();
  const [deleteChapter, setDeleteChapter] = useState(null);
  const [newTitle, setNewTitle] = useState(null);
  const { tags, isLoadingTags, getTags } = useNovelStore();

  useEffect(() => {
    getNovel(novelId);
  }, [novelId, getNovel]);

  return (
    <div>
      {/* Loading */}
      {(isLoadingMyNovel || isLoading) && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {/* No Novel */}
      {!isLoading && !isLoadingMyNovel && !novel.chapters && <NotFoundPage />}
      {!isLoadingMyNovel && !isLoading && novel.chapters && (
        <div className="max-w-4xl mx-auto p-4">
          {/* User Info */}
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="cursor-pointer group relative">
                  <img
                    src={
                      novel.coverUrl && novel.coverUrl.startsWith("http")
                        ? novel.coverUrl
                        : cover
                    }
                    alt={novel.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cover;
                    }}
                    className="p-6 md:p-0 md:w-36 md:h-51 rounded-2xl object-cover shrink-0 shadow-md"
                  />
                  <SquarePen className="absolute opacity-0 group-hover:opacity-100 top-1 right-1 bg-base-100 text-base-content" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold wrap-break-word">
                      {novel.title}
                    </h1>

                    {isUpdatingTitle ? (
                      <span className="loading loading-spinner loading-lg size-5"></span>
                    ) : (
                      <SquarePen
                        className="size-5 cursor-pointer"
                        onClick={() => {
                          setNewTitle(novel.title);
                        }}
                      />
                    )}
                  </div>

                  {/* Author */}
                  <div className="mt-3">
                    <Link to={`/author/${novel.userId}`}>
                      <div className="badge badge-primary badge-outline">
                        {novel.author}
                      </div>
                    </Link>
                  </div>

                  {/* Tags */}
                  <div className="flex justify-between">
                    <div className="flex flex-wrap gap-2 mt-4">
                      {novel.tags?.map((tag) => (
                        <div
                          key={tag.id}
                          className="badge badge-outline badge-secondary cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/all?search=&sortBy=Latest+Updated&sortOrder=desc&page=1&tags=${tag.id}`,
                            )
                          }
                        >
                          {i18n.language == "en" ? tag.name : tag.nameCN}
                        </div>
                      ))}
                    </div>

                    {isUpdateingTags ? (
                      <span className="loading loading-spinner loading-lg size-5"></span>
                    ) : (
                      <SquarePen
                        className="size-5 cursor-pointer"
                        onClick={() => {
                          if (tags === null) getTags();
                        }}
                      />
                    )}
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
            </div>
          </div>

          {/* Novel List */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title mb-2">{t("my_novels")}</h2>
                <button className="btn btn-primary btn-md">
                  {t("new_chapter")}
                </button>
              </div>

              <div className="divide-y divide-base-300">
                {novel.chapters.map(
                  (chapter, idx) =>
                    chapter.orderIndex != 0 && (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex font-medium text-lg gap-4 min-w-0 truncate">
                          <div className="shrink-0">#{idx}</div>
                          <div className="">{chapter.title}</div>
                        </div>

                        <button
                          className="btn btn-circle btn-ghost btn-sm text-error mr-4"
                          aria-label="Delete novel"
                          onClick={() => setDeleteChapter(chapter)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ),
                )}
              </div>

              {novel.chapters.length <= 1 && (
                <div className="text-center py-8 text-base-content/60">
                  {t("no_published_novel")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapter Delete Dialog */}
      <dialog open={deleteChapter} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("confirm_delete")}</h3>
          <p className="py-4">
            {t("to_delete_novel", { title: deleteChapter?.title })}
          </p>

          <div className="modal-action">
            <button className="btn" onClick={() => setDeleteChapter(null)}>
              {t("cancel")}
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                setDeleteChapter(null);
              }}
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </dialog>

      {/* Update Title Dialog */}
      <dialog open={newTitle != null} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{t("edit_title")}</h3>

          <input
            type="text"
            className="input input-bordered w-full"
            value={newTitle ?? ""}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter title"
          />

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setNewTitle(null);
              }}
            >
              {t("cancel")}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                updateTitle(novel.id, newTitle);
                setNewTitle(null);
              }}
            >
              {t("update")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyNovel;
