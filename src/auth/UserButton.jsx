import { useEffect } from "react";
import useUserStore from "./useUserStore";
import avatar from "../assets/avatar.png";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { checkUserCookie } from "../utils/cookie";
import showToast from "../utils/Toast";

const UserButton = () => {
  const { user, checkAuth, logout } = useUserStore();
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const runAuthCheck = async () => {
      if (checkUserCookie()) {
        await checkAuth();
      } else {
        await logout();
      }
    };
    runAuthCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <button className="btn btn-ghost btn-circle ">
        <img
          src={user?.avatarUrl || avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      <ul
        className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg border border-base-300"
      >
        {!user ? (
          <li>
            <Link
              to="/login"
              state={{ from: location }}
              onClick={(e) => e.currentTarget.blur()}
              replace
            >
              {t("menu_login_signup")}
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/profile" onClick={(e) => e.currentTarget.blur()}>
                {t("menu_profile")}
              </Link>
            </li>
            <li>
              <Link to="/my-novels" onClick={(e) => e.currentTarget.blur()}>
                {t("my_novels")}
              </Link>
            </li>
            <li>
              <Link
                to="/update-password"
                onClick={(e) => e.currentTarget.blur()}
              >
                {t("update_password")}
              </Link>
            </li>
            <li>
              <div
                onClick={async () => {
                  await logout();
                  showToast(t("logout_successful"), "success");
                }}
              >
                {t("logout")}
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default UserButton;
