import { useState } from "react";
import useAdminStore from "../UseAdminStore";
import useUserStore from "../../auth/AseUserStore";
import { useTranslation } from "react-i18next";

const ChangeRoleDialog = ({ changeRoleUser, setChangeRoleUser }) => {
  const [newRole, setNewRole] = useState("");
  const { isUpdatingRole, updateRole } = useAdminStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  const closeHandler = () => {
    setNewRole("");
    setChangeRoleUser(null);
  };

  return (
    <dialog open={changeRoleUser} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-xl mb-4">{t("change_user_role")}</h3>

        {/* User information */}
        <div className="space-y-2 rounded-lg bg-base-200 p-4">
          <div>
            <span className="font-semibold">{t("id")}:</span> {changeRoleUser?.id}
          </div>

          <div>
            <span className="font-semibold">{t("username")}:</span>{" "}
            {changeRoleUser?.username}
          </div>

          <div>
            <span className="font-semibold">{t("email")}:</span>{" "}
            {changeRoleUser?.email}
          </div>

          <div>
            <span className="font-semibold">{t("current_role")}:</span>
            <span className="badge badge-primary px-2 ml-2">
              {t(changeRoleUser?.role)}
            </span>
          </div>
        </div>

        {/* New role */}
        <div className="mt-5">
          <label className="font-semibold">{t("new_role")}</label>

          <select
            className="select select-bordered w-full mt-2"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="" disabled>
              {t("selet_new_role")}
            </option>
            {changeRoleUser?.role != "USER" && (
              <option value="USER">{t("USER")}</option>
            )}
            {changeRoleUser?.role != "AUTHOR" && (
              <option value="AUTHOR">{t("AUTHOR")}</option>
            )}
            {changeRoleUser?.role != "ADMIN" && user?.role === "SUPERADMIN" && (
              <option value="ADMIN">{t("ADMIN")}</option>
            )}
          </select>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            className="btn"
            onClick={closeHandler}
            disabled={isUpdatingRole}
          >
            {t("cancel")}
          </button>

          <button
            className="btn btn-primary min-w-20"
            onClick={async () => {
              if (await updateRole(changeRoleUser.id, newRole)) closeHandler();
            }}
            disabled={isUpdatingRole}
          >
            {isUpdatingRole ? (
              <span className="loading loading-spinner"></span>
            ) : (
              t("update")
            )}
          </button>
        </div>
      </div>

      {/* Click outside */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeHandler}>close</button>
      </form>
    </dialog>
  );
};

export default ChangeRoleDialog;
