import { useParams } from "react-router-dom";
import ChapterEditor from "../editor/ChapterEditor";
import useMyNovelStore from "./useMyNovelStore";
import { useEffect, useState } from "react";
import NotFoundPage from "../main/NotFoundPage";
import { useTranslation } from "react-i18next";

const MyChapter = () => {
  const { chapterId } = useParams();
  const {
    chapter,
    isLoadingChapter,
    operation,
    getChapter,
    publishChapter,
    createOrUpdateChapter,
  } = useMyNovelStore();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [loadDraftDialogOpen, setLoadDraftDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingChapter) getChapter(chapterId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, getChapter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(chapter?.title ?? "");
    setContent(chapter?.content ?? "");
  }, [chapter]);

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
            <button
              className="btn btn-success"
              onClick={() => {
                publishChapter();
              }}
            >
              {t("publish")}
            </button>
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
                  setLoadDraftDialogOpen(true);
                }}
              >
                {t("load_draft")}
              </button>

              <button className="btn btn-outline" onClick={() => {}}>
                {t("save_draft")}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  createOrUpdateChapter(
                    chapter.novelId,
                    chapter.chapterId,
                    title,
                    content,
                  );
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
          <dialog open={loadDraftDialogOpen} className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">{t("load_draft")}</h3>

              <p className="py-4">{t("confirm_load")}</p>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setLoadDraftDialogOpen(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  className="btn btn-error"
                  onClick={() => {
                    setLoadDraftDialogOpen(false);
                  }}
                >
                  {t("load")}
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};

export default MyChapter;
