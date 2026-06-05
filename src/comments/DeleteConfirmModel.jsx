import { t } from "i18next";

const DeleteConfirmModel = ({ open, setOpen, onConfirm }) => {
  return (
    <dialog open={open} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("confirm_delete")}</h3>
        <p className="py-4">{t("to_delete_comment")}</p>

        <div className="modal-action">
          <button className="btn" onClick={() => setOpen(false)}>
            {t("cancel")}
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            {t("delete")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmModel;
