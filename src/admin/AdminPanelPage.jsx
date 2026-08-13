import { NavLink, Outlet } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Bell,
  LayoutDashboard,
} from "lucide-react";
import useUserStore from "../auth/UseUserStore";
import NotFoundPage from "../main/NotFoundPage";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import useAdminStore from "./UseAdminStore";

const AdminPanelPage = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const { unreadCount, isLoadingUnreadCount, getUnreadCount } = useAdminStore();

  useEffect(() => {
    document.title = t("admin_panel") + " - Cat Novels";
  }, [t]);

  useEffect(() => {
    if (!isLoadingUnreadCount) getUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUnreadCount]);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
      isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"
    }`;

  return (
    <>
      {user?.role != "ADMIN" && user?.role != "SUPERADMIN" && <NotFoundPage />}
      {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-base-100">
            <div className="border-b p-6">
              <h1 className="text-2xl font-bold">{t("admin_panel")}</h1>
            </div>

            <nav className="p-4">
              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  {t("general")}
                </div>

                <NavLink to="/admin" end className={linkClass}>
                  <LayoutDashboard size={18} />
                  {t("dashboard")}
                </NavLink>
              </div>

              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  {t("user_management")}
                </div>

                <NavLink to="/admin/users" className={linkClass}>
                  <Users size={18} />
                  {t("users_tab")}
                </NavLink>

                <NavLink
                  to="/admin/messages"
                  className={`${linkClass} flex items-center gap-2`}
                >
                  <MessageSquare size={18} />
                  <span>{t("messages")}</span>

                  {unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              </div>

              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  {t("content_management")}
                </div>

                <NavLink to="/admin/novels" className={linkClass}>
                  <BookOpen size={18} />
                  {t("novels")}
                </NavLink>

                <NavLink to="/admin/chapters" className={linkClass}>
                  <FileText size={18} />
                  {t("chapters")}
                </NavLink>
              </div>

              <div>
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  {t("site")}
                </div>

                <NavLink to="/admin/notices" className={linkClass}>
                  <Bell size={18} />
                  {t("notices")}
                </NavLink>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-base-200 p-6">
            <Outlet />
          </main>
        </div>
      )}
    </>
  );
};

export default AdminPanelPage;
