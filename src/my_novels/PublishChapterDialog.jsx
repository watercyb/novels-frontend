import { t } from "i18next";
import showToast from "../utils/Toast";

const PublishChapterDialog = ({
  chapterToPublish,
  setChapterToPublish,
  publishChapter,
}) => {
  return (
    <dialog open={chapterToPublish} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("confirm_publish_title")}</h3>
        <p className="py-4">{t("confirm_publish")}</p>
        <div className="modal-action">
          <button className="btn" onClick={() => setChapterToPublish(null)}>
            {t("cancel")}
          </button>

          <button
            className="btn btn-error"
            onClick={async () => {
              setChapterToPublish(null);
              if (await publishChapter(chapterToPublish))
                showToast(t("chapter_published_success"), "success");
            }}
          >
            {t("publish")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default PublishChapterDialog;
