import Language from "../locales/Language";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import UserButton from "../auth/UserButton";

export default function Topbar() {
  const { t } = useTranslation();

  return (
    <div className="navbar bg-base-100 shadow-md px-12">
      {/* Left Side */}
      <div className="flex items-center gap-8 flex-1">
        {/* Logo */}
        <a className="text-2xl font-bold cursor-pointer">MyLogo</a>

        {/* Menu Items */}
        <ul className="hidden md:flex menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/">{t("menu_home")}</Link>
          </li>
          <li>
            <Link to="/all">{t("menu_all_novels")}</Link>
          </li>
          <li>
            <Link to="/ori">{t("menu_ori_novels")}</Link>
          </li>
          <li>
            <Link to="/tran">{t("menu_tran_novels")}</Link>
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
