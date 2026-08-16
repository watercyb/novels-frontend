import { useTranslation } from "react-i18next";
import UserRole from "../../utils/UserRole";
import { useEffect, useRef } from "react";
import useUserStore from "../../auth/UseUserStore";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../UseAdminStore";

const UserCard = ({
  cardUser,
  menuUser,
  setMenuUser,
  setChangeRoleUser,
  setUserToDelete,
  setRecipient,
}) => {
  const { t } = useTranslation();
  const menuRef = useRef(null);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { getUser } = useAdminStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuUser(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuUser]);

  return (
    <tr className="hover">
      <td>{cardUser.id}</td>

      <td>{cardUser.username}</td>

      <td>{cardUser.email}</td>

      <td>
        <div className="tooltip block w-full" data-tip={t(cardUser.role)}>
          <UserRole user={cardUser} />
        </div>
      </td>

      <td>
        <div className="flex gap-2">
          <button
            className="btn btn-xs btn-primary"
            onClick={() => {
              getUser(cardUser.id);
              navigate("/admin/novels");
            }}
          >
            {t("view")}
          </button>

          <div className="dropdown dropdown-end">
            <button
              className="btn btn-xs btn-warning"
              onClick={() => {
                setMenuUser(menuUser?.id === cardUser.id ? null : cardUser);
              }}
              disabled={user.id === cardUser.id}
            >
              {t("edit")}
            </button>

            {menuUser?.id === cardUser.id && (
              <div
                ref={menuRef}
                className="absolute right-0 top-8 z-50 w-44 rounded-lg bg-base-100 shadow-lg border border-base-300 p-2"
              >
                {user.id != cardUser.id && (
                  <button
                    className=" w-full text-left px-3 py-2 rounded-md hover:bg-base-200"
                    onClick={() => {
                      setRecipient(cardUser);
                    }}
                  >
                    {t("send_message")}
                  </button>
                )}

                {user.id != cardUser.id &&
                  cardUser.role != "SUPERADMIN" &&
                  (user.role === "SUPERADMIN" ||
                    cardUser.role === "USER" ||
                    cardUser.role === "AUTHOR") && (
                    <button
                      className=" w-full text-left px-3 py-1 rounded-md hover:bg-base-200"
                      onClick={() => {
                        setChangeRoleUser(menuUser);
                      }}
                    >
                      {t("change_role")}
                    </button>
                  )}

                <div className="divider my-0"></div>

                {user.id != cardUser.id &&
                  cardUser.role != "SUPERADMIN" &&
                  (user.role === "SUPERADMIN" ||
                    cardUser.role === "USER" ||
                    cardUser.role === "AUTHOR") && (
                    <button
                      className="w-full text-left px-3 py-1 rounded-md text-error hover:bg-error/10"
                      onClick={async () => {
                        setUserToDelete(cardUser);
                      }}
                    >
                      {t("delete")}
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;
