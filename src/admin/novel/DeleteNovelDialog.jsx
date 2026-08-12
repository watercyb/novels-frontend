import useAdminStore from "../UseAdminStore";
import showToast from "../../utils/Toast";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { useState } from "react";

const DeleteNovelDialog = ({ novelToDelete, setNovelToDelete }) => {
  const { deleteNovel } = useAdminStore();
  const [reason, setReason] = useState("");

  if (!novelToDelete) return null;

  const handleDelete = async () => {
    onClose();
    if (await deleteNovel(novelToDelete.id, reason))
      showToast(t("novel_deleted"), "success");
    setReason("");
  };

  const onClose = () => {
    setNovelToDelete(null);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold text-error">{t("delete_novel")}</h3>

        <p className="mt-3">
          <Trans
            i18nKey="delete_novel_text"
            values={{ title: novelToDelete.title }}
            components={{
              strong: <strong />,
            }}
          />
        </p>

        {/* Deletion reason */}
        <div className="mt-4">
          <label className="label">
            <span className="label-text font-medium pb-1">
              {t("deletion_reason")}
            </span>
          </label>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder={t("deletion_reason_placeholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            {t("cancel")}
          </button>

          <button className="btn btn-error min-w-32" onClick={handleDelete}>
            {t("delete_novel")}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteNovelDialog;
