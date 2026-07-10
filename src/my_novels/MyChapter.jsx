import { useParams } from "react-router-dom";
import ChapterEditor from "../editor/ChapterEditor";
import useMyNovelStore from "./useMyNovelStore";
import { useEffect, useState } from "react";
import NotFoundPage from "../main/NotFoundPage";
import { useTranslation } from "react-i18next";
import { hasDraft, loadDraft, saveDraft } from "../utils/localStorage";
import showToast from "../utils/Toast";
import PublishChapterDialog from "./PublishChapterDialog";

const MyChapter = () => {
  const { chapterId } = useParams();
  const {
    chapter,
    isLoadingChapter,
    operation,
    getChapter,
    publishChapter,
    createOrUpdateChapter,
    clearChapter,
  } = useMyNovelStore();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [loadDraftDialogOpen, setLoadDraftDialogOpen] = useState(0);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const [isLoadedDraft, setIsLoadedDraft] = useState(false);
  const [comfirmSaveDialogOpen, setComfirmSaveDialogOpen] = useState(false);
  const [chapterToPublish, setChapterToPublish] = useState(null);

  useEffect(() => {
    if (!isLoadingChapter) getChapter(chapterId);
    return () => clearChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, clearChapter, getChapter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(chapter?.title ?? "");
    setContent(chapter?.content ?? "");
    setHasLocalDraft(hasDraft(chapter?.id));
    if (chapter && !isLoadedDraft) {
      setIsLoadedDraft(true);
      if (hasDraft(chapter?.id))
        setTimeout(() => setLoadDraftDialogOpen(5), 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter]);

  const handleSaveChapter = async () => {
    saveDraft(chapter?.id, title, content);
    if (
      await createOrUpdateChapter(chapter.novelId, chapter.id, title, content)
    )
      showToast(t("chapter_saved"), "success");
  };

  return (
    <>
      {/* Loading */}
      {(isLoadingChapter || !chapter) && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}

      {/* No Chapter */}
      {!isLoadingChapter && !chapter && <NotFoundPage />}

      {/* Operation */}
      {operation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-lg font-medium">{t(operation)}</span>
          </div>
        </div>
      )}

      {/* Editor */}
      {!isLoadingChapter && chapter && (
        <div className="max-w-5xl mx-auto w-full p-6 flex flex-col gap-6">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">{t("edit_chapter")}</h1>
            {!chapter?.published ? (
              <button
                className="btn btn-success"
                onClick={() => setChapterToPublish(chapter)}
              >
                {t("publish")}
              </button>
            ) : (
              <div className="pr-4 pt-2 text-success font-bold">
                {t("published")}
              </div>
            )}
          </div>

          {/* Chapter Title */}
          <div className="form-control">
            <label className="label mb-2">
              <span className="label-text font-medium">{t("title")}</span>
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder={t("enter_title")}
              value={title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Chapter Content */}
          <div className="flex flex-col gap-2">
            <label className="label">
              <span className="label-text font-medium">{t("content")}</span>
            </label>

            <ChapterEditor content={content} setContent={setContent} />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              <button
                className="btn btn-outline btn-error"
                onClick={() => setResetDialogOpen(true)}
              >
                {t("reset")}
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  setLoadDraftDialogOpen(3);
                }}
                disabled={!hasLocalDraft}
              >
                {t("load_draft")}
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  saveDraft(chapter?.id, title, content);
                  setHasLocalDraft(true);
                  showToast(t("draft_saved"), "success");
                }}
              >
                {t("save_draft")}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!chapter?.published) {
                    handleSaveChapter();
                  } else {
                    setComfirmSaveDialogOpen(true);
                  }
                }}
              >
                {t("save")}
              </button>
            </div>
          </div>

          {/* Reset Chapter Dialog */}
          <dialog open={resetDialogOpen} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{t("reset_chapter")}</h3>
              <p className="py-4">{t("confirm_reset")}</p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setResetDialogOpen(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  className="btn btn-error"
                  onClick={() => {
                    setTitle(chapter?.title ?? "");
                    setContent(chapter?.content ?? "");
                    setResetDialogOpen(false);
                  }}
                >
                  {t("reset")}
                </button>
              </div>
            </div>
          </dialog>

          {/* Load Draft Dialog */}
          <dialog open={loadDraftDialogOpen & 1} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {loadDraftDialogOpen & 2 ? t("load_draft") : t("draft_found")}
              </h3>
              <p className="py-4">
                {loadDraftDialogOpen == 1
                  ? t("confirm_load")
                  : t("confirm_auto_load")}
              </p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setLoadDraftDialogOpen(loadDraftDialogOpen ^ 1);
                  }}
                >
                  {t("cancel")}
                </button>

                <button
                  className="btn btn-error"
                  onClick={() => {
                    const data = loadDraft(chapter.id);
                    if (data) {
                      setTitle(data.title);
                      setContent(data.content);
                      showToast(t("draft_loaded"), "success");
                    } else {
                      showToast(t("no_draft_found"), "error");
                    }
                    setLoadDraftDialogOpen(loadDraftDialogOpen ^ 1);
                  }}
                >
                  {t("load")}
                </button>
              </div>
            </div>
          </dialog>

          {/* Comfirm Save Dialog */}
          <dialog open={comfirmSaveDialogOpen} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{t("published_chapter")}</h3>
              <p className="py-4">{t("confirm_save")}</p>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setComfirmSaveDialogOpen(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  className="btn btn-error"
                  onClick={() => {
                    setComfirmSaveDialogOpen(false);
                    handleSaveChapter();
                  }}
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </dialog>

          {/* Comfirm Publish Dialog */}
          <PublishChapterDialog
            chapterToPublish={chapterToPublish}
            setChapterToPublish={setChapterToPublish}
            publishChapter={publishChapter}
          />
        </div>
      )}
    </>
  );
};

export default MyChapter;
