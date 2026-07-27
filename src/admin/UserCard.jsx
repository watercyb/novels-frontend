import { useTranslation } from "react-i18next";
import UserRole from "../utils/UserRole";
import { useEffect, useRef } from "react";

const UserCard = ({ user, menuUserId, setMenuUserId }) => {
  const { t } = useTranslation();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuUserId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setMenuUserId]);

  return (
    <tr className="hover">
      <td>{user.id}</td>

      <td>{user.username}</td>

      <td>{user.email}</td>

      <td>
        <div className="tooltip block w-full" data-tip={t(user.role)}>
          <UserRole user={user} />
        </div>
      </td>

      <td>
        <div className="flex gap-2">
          <button className="btn btn-xs btn-primary">{t("view")}</button>

          <div className="dropdown dropdown-end">
            <button
              className="btn btn-xs btn-warning"
              onClick={() => {
                setMenuUserId(menuUserId === user.id ? null : user.id);
              }}
            >
              {t("edit")}
            </button>

            {menuUserId === user.id && (
              <div
                ref={menuRef}
                className="absolute right-0 top-8 z-50 w-44 rounded-lg bg-base-100 shadow-lg border border-base-300 p-2"
              >
                <button
                  className=" w-full text-left px-3 py-2 rounded-md hover:bg-base-200"
                  onClick={() => {
                    console.log("1");
                  }}
                >
                  {t("change_role")}
                </button>

                <div className="divider my-1"></div>

                <button
                  className="w-full text-left px-3 py-2 rounded-md text-error hover:bg-error/10"
                  onClick={() => {
                    console.log("3");
                  }}
                >
                  {t("delete")}
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;
