import Language from "../locales/Language";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import UserButton from "../auth/UserButton";

export default function Topbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-md px-2 lg:px-12">
      {/* Left Side */}
      <div className="flex items-center gap-2 md:gap-8 flex-1">
        {/* Logo */}
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => {
            navigate("/", { replace: true });
          }}
        >
          <img src="/favicon.png" alt="Cat Novels" className="size-10" />
          <a className="text-[26px] oswald font-bold text-[#673ab7] hidden md:flex">
            Cat Novels
          </a>
        </div>

        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn m-1">
            ☰
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-10 w-46 p-2 shadow"
          >
            <li>
              <Link to="/" onClick={(e) => e.currentTarget.blur()}>
                {t("menu_home")}
              </Link>
            </li>
            <li>
              <Link to="/all" onClick={(e) => e.currentTarget.blur()}>
                {t("menu_all_novels")}
              </Link>
            </li>
            <li>
              <Link to="/ori" onClick={(e) => e.currentTarget.blur()}>
                {t("menu_ori_novels")}
              </Link>
            </li>
            <li>
              <Link to="/tran" onClick={(e) => e.currentTarget.blur()}>
                {t("menu_tran_novels")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Menu Items */}
        <ul className="hidden md:flex menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/" onClick={(e) => e.currentTarget.blur()}>
              {t("menu_home")}
            </Link>
          </li>
          <li>
            <Link to="/all" onClick={(e) => e.currentTarget.blur()}>
              {t("menu_all_novels")}
            </Link>
          </li>
          <li>
            <Link to="/ori" onClick={(e) => e.currentTarget.blur()}>
              {t("menu_ori_novels")}
            </Link>
          </li>
          <li>
            <Link to="/tran" onClick={(e) => e.currentTarget.blur()}>
              {t("menu_tran_novels")}
            </Link>
          </li>
        </ul>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <Language />
        <UserButton />
      </div>
    </div>
  );
}
