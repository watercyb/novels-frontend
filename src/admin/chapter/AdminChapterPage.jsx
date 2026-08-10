import { useState } from "react";
import { t } from "i18next";
import { Trash2, CircleCheck, FileText } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import cover from "../../assets/cover.png";
import i18n from "../../locales/i18n";
import showToast from "../../utils/Toast";
import useAdminStore from "../UseAdminStore";

const AdminChapterPage = () => {
  const navigate = useNavigate();
  const { novel, isLoadingNovel, operation, deleteChapter } = useAdminStore();
  const [chapterToDelete, setChapterToDelete] = useState(null);

  return (
    <div>
      {/* Loading */}
      {isLoadingNovel && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {/* No Novel */}
      {!isLoadingNovel && !novel?.id && (
        <div className="flex h-full min-h-125 items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">👤</div>

            <h2 className="text-2xl font-semibold">
              {t("please_select_novel")}
            </h2>

            <p className="mt-2 text-base-content/60">
              {t("select_novel_from_novels_tab")}
            </p>
          </div>
        </div>
      )}
      {/* Operation */}
      {operation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-lg font-medium">{t(operation)}</span>
          </div>
        </div>
      )}
      {!isLoadingNovel && novel?.id && (
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
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold wrap-break-word">
                      {novel.title}
                    </h1>
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
                  <div className="flex justify-between">
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

              {/* Description */}
              <div className="relative bg-base-200 mt-4 p-4 pr-6 text-lg">
                <div className="">{novel.description}</div>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title mb-2">{t("novel_chapters")}</h2>
              </div>

              <div className="divide-y divide-base-300">
                {novel.chapters.map(
                  (chapter, idx) =>
                    chapter.orderIndex != 0 && (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div
                          className="flex font-medium text-lg gap-4 min-w-0 cursor-pointer truncate"
                          onClick={() => {
                            if (chapter.published) {
                              document.activeElement?.blur();
                              navigate(`/chapter/${chapter.id}`);
                            } else {
                              showToast(t("cannot_view_unpublished_chapter"), "error");
                            }
                          }}
                        >
                          <div className="shrink-0">#{idx}</div>
                          <div className="">{chapter.title}</div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div>
                            {!chapter.published ? (
                              <div
                                className="tooltip mt-1"
                                data-tip={t("chapter_not_published")}
                              >
                                <FileText size={19} className="text-gray-500" />
                              </div>
                            ) : (
                              <div
                                className="tooltip mt-1"
                                data-tip={t("chapter_published")}
                              >
                                <CircleCheck
                                  size={19}
                                  className="text-green-500"
                                />
                              </div>
                            )}
                          </div>

                          <button
                            className="btn btn-circle btn-ghost btn-sm text-error mr-4"
                            aria-label="Delete novel"
                            onClick={() => setChapterToDelete(chapter)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
      <dialog open={chapterToDelete} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("confirm_delete")}</h3>
          <p className="py-4">
            {t("to_delete_novel", { title: chapterToDelete?.title })}
          </p>

          <div className="modal-action">
            <button className="btn" onClick={() => setChapterToDelete(null)}>
              {t("cancel")}
            </button>
            <button
              className="btn btn-error"
              onClick={async () => {
                const chapterid = chapterToDelete.id;
                setChapterToDelete(null);
                if (await deleteChapter(chapterid))
                  showToast(t("chapter_deleted"), "success");
              }}
            >
              {t("delete")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminChapterPage;
