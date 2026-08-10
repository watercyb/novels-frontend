import { useEffect, useRef, useState } from "react";
import useUserStore from "../auth/UseUserStore";
import useMyNovelStore from "./useMyNovelStore";
import { t } from "i18next";
import {
  SquarePen,
  Trash2,
  CircleCheck,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NotFoundPage from "../main/NotFoundPage";
import cover from "../assets/cover.png";
import i18n from "../locales/i18n";
import showToast from "../utils/Toast";
import UpdateTagDialog from "./UpdateTagDialog";
import PublishChapterDialog from "./PublishChapterDialog";
import ArrangeChapterDialog from "./ArrangeChapterDialog";

const MyNovel = () => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useUserStore();
  const {
    novel,
    isLoadingMyNovel,
    isUpdatingTitle,
    isUpdatingTags,
    isUpdatingDescription,
    operation,
    getNovel,
    updateTitle,
    updateCoverImage,
    updateDescription,
    createOrUpdateChapter,
    deleteChapter,
    publishChapter,
  } = useMyNovelStore();
  const [chapterToDelete, setChapterToDelete] = useState(null);
  const [newTitle, setNewTitle] = useState(null);
  const fileInputRef = useRef(null);
  const [updateTagDialogOpen, setUpdateTagDialogOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(null);
  const [chapterToPublish, setChapterToPublish] = useState(null);
  const [chapterToMove, setChapterToMove] = useState(null);

  useEffect(() => {
    getNovel(novelId);
  }, [novelId, getNovel]);

  useEffect(() => {
    if (!isLoadingMyNovel && novel?.id == novelId) {
      document.title =
        t("my_novels") + " - " + (novel?.title ?? "") + " - Cat Novels";
    }
  }, [isLoadingMyNovel, novel?.id, novel?.title, novelId]);

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file && (await updateCoverImage(novelId, file)))
      showToast(t("cover_updated"), "success");
  };

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
      {/* Operation */}
      {operation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-lg font-medium">{t(operation)}</span>
          </div>
        </div>
      )}
      {!isLoadingMyNovel && !isLoading && novel.chapters && (
        <div className="max-w-4xl mx-auto p-4">
          {/* User Info */}
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                <div
                  className="cursor-pointer group relative"
                  onClick={() => fileInputRef.current.click()}
                >
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
                  <SquarePen className="absolute opacity-0 size-5 group-hover:opacity-60 top-1 right-1 bg-base-100 text-base-content" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleCoverChange}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <div className="flex justify-between">
                    <h1 className="text-4xl font-bold wrap-break-word">
                      {novel.title}
                    </h1>

                    {isUpdatingTitle ? (
                      <span className="loading loading-spinner loading-lg size-5 opacity-60 mr-2"></span>
                    ) : (
                      <SquarePen
                        className="size-4 cursor-pointer opacity-60 mr-2"
                        onClick={() => {
                          setNewTitle(novel.title);
                        }}
                      />
                    )}
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

                    {isUpdatingTags ? (
                      <span className="loading loading-spinner loading-lg size-5 opacity-60 mr-2"></span>
                    ) : (
                      <SquarePen
                        className="size-4 cursor-pointer opacity-60 mr-2"
                        onClick={() => {
                          setUpdateTagDialogOpen(true);
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

              {/* Description */}
              <div className="relative bg-base-200 mt-4 p-4 pr-6 text-lg">
                <div className="">{novel.description}</div>
                <div className="absolute top-2 right-2">
                  {isUpdatingDescription ? (
                    <span className="loading loading-spinner loading-lg size-5 opacity-60"></span>
                  ) : (
                    <SquarePen
                      className="size-4 cursor-pointer opacity-60"
                      onClick={() => {
                        setNewDescription(novel.description);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title mb-2">{t("novel_chapters")}</h2>
                <button
                  className="btn btn-primary btn-md w-33"
                  onClick={async () => {
                    if (
                      await createOrUpdateChapter(
                        Number(novelId),
                        null,
                        t("new_chapter_title"),
                        "",
                      )
                    )
                      showToast(t("chapter_created"), "success");
                  }}
                >
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
                        <div
                          className="flex font-medium text-lg gap-4 min-w-0 cursor-pointer truncate"
                          onClick={() => {
                            document.activeElement?.blur();
                            navigate(`/my-novels/chapter/${chapter.id}`);
                          }}
                        >
                          <div className="shrink-0">#{idx}</div>
                          <div className="">{chapter.title}</div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <button
                            className="btn btn-circle btn-ghost btn-sm text-blue-600 hover:text-blue-700"
                            aria-label="Move chapter"
                            onClick={() => setChapterToMove(chapter)}
                          >
                            <ArrowRightLeft size={18} />
                          </button>

                          <div>
                            {!chapter.published ? (
                              <div
                                className="tooltip cursor-pointer mt-1"
                                data-tip={t("chapter_not_published")}
                                onClick={() => setChapterToPublish(chapter)}
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
                const chapter = chapterToDelete;
                setChapterToDelete(null);
                if (await deleteChapter(chapter))
                  showToast(t("chapter_deleted"), "success");
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
              disabled={isUpdatingTitle}
            >
              {t("cancel")}
            </button>

            <button
              className="btn btn-primary"
              onClick={async () => {
                const title = newTitle;
                if (await updateTitle(novel.id, title)) {
                  showToast(t("cover_updated"), "success");
                  setNewTitle(null);
                }
              }}
              disabled={isUpdatingTitle}
            >
              {isUpdatingTitle ? (
                <div className="min-w-10">
                  <span className="loading loading-spinner"></span>
                </div>
              ) : (
                t("update")
              )}
            </button>
          </div>
        </div>
      </dialog>
      {/* Update Description Dialog */}
      <dialog open={newDescription != null} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{t("edit_title")}</h3>

          <textarea
            className="textarea textarea-bordered w-full h-32"
            value={newDescription ?? ""}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setNewDescription(null);
              }}
              disabled={isUpdatingDescription}
            >
              {t("cancel")}
            </button>

            <button
              className="btn btn-primary"
              onClick={async () => {
                const description = newDescription;
                if (await updateDescription(novel.id, description)) {
                  showToast(t("description_updated"), "success");
                  setNewDescription(null);
                }
              }}
              disabled={isUpdatingDescription}
            >
              {isUpdatingDescription ? (
                <div className="min-w-10">
                  <span className="loading loading-spinner"></span>
                </div>
              ) : (
                t("update")
              )}
            </button>
          </div>
        </div>
      </dialog>

      <UpdateTagDialog
        updateTagDialogOpen={updateTagDialogOpen}
        setUpdateTagDialogOpen={setUpdateTagDialogOpen}
      />

      {/* Comfirm Publish Dialog */}
      <PublishChapterDialog
        chapterToPublish={chapterToPublish}
        setChapterToPublish={setChapterToPublish}
        publishChapter={publishChapter}
      />

      {/* Arrange Chapter Dialog */}
      <ArrangeChapterDialog
        chapterToMove={chapterToMove}
        setChapterToMove={setChapterToMove}
        publishChapter={publishChapter}
      />
    </div>
  );
};

export default MyNovel;
