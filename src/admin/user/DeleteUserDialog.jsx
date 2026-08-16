import { useState } from "react";
import useAdminStore from "../UseAdminStore";
import showToast from "../../utils/Toast";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { Loader } from "lucide-react";

const DeleteUserDialog = ({ userToDelete, setUserToDelete }) => {
  const [confirmation, setConfirmation] = useState("");
  const { isDeletingUser, deleteUser } = useAdminStore();
  const [deletionReason, setDeletionReason] = useState("");

  if (!userToDelete) return null;

  const canDelete = confirmation === userToDelete.username;

  const handleDelete = async () => {
    if (!canDelete) return;

    if (await deleteUser(userToDelete.id, deletionReason))
      showToast(t("account_deleted"), "success");

    onClose();
  };

  const onClose = () => {
    setDeletionReason("");
    setConfirmation("");
    setUserToDelete(null);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-xl font-bold text-error">{t("delete_account")}</h3>

        <p className="mt-3">{t("delete_account_text")}</p>

        {/* User information */}
        <div className="mt-4 space-y-2 rounded-lg bg-base-200 p-4">
          <div>
            <span className="font-semibold">{t("id")}:</span> {userToDelete.id}
          </div>

          <div>
            <span className="font-semibold">{t("username")}:</span>{" "}
            {userToDelete.username}
          </div>

          <div>
            <span className="font-semibold">{t("email")}:</span>{" "}
            {userToDelete.email}
          </div>

          <div>
            <span className="font-semibold">{t("role")}:</span>{" "}
            <span className="badge badge-primary">{userToDelete.role}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-5">
          <label className="form-control w-full">
            <div className="label mb-1">
              <span className="label-text">{t("deletion_reason")}</span>
            </div>

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder={t("deletion_reason_placeholder")}
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              rows={3}
            />
          </label>
        </div>

        {/* Confirmation */}
        <div className="mt-3">
          <label className="label mb-1">
            <span className="label-text">
              <Trans
                i18nKey="type_username_to_confirm"
                values={{ username: userToDelete.username }}
                components={{
                  strong: <strong />,
                }}
              />
            </span>
          </label>

          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={userToDelete.username}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={isDeletingUser}>
            {t("cancel")}
          </button>

          <button
            className="btn btn-error min-w-32"
            disabled={!canDelete || isDeletingUser}
            onClick={handleDelete}
          >
            {isDeletingUser ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              t("delete_account")
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteUserDialog;
