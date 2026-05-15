import { useEffect } from "react";
import useUserStore from "./useUserStore";
import avatar from "../assets/avatar.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const UserButton = () => {
  const { user, checkAuth, logout } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    const runAuthCheck = async () => {
      await checkAuth();
    };
    runAuthCheck();
  }, []);

  return (
    <div className="dropdown dropdown-hover dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <img
          src={user?.avatarUrl || avatar}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-lg border border-base-300"
      >
        {!user ? (
          <li>
            <Link to="/login">{t("menu_login_signup")}</Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/profile">{t("menu_profile")}</Link>
            </li>
            <li>
              <div onClick={()=>{logout();}}>{t("logout")}</div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default UserButton;
