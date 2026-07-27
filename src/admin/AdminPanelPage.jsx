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

const AdminPanelPage = () => {
  const { user } = useUserStore();

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
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>

            <nav className="p-4">
              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  General
                </div>

                <NavLink to="/admin" end className={linkClass}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>
              </div>

              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  User Management
                </div>

                <NavLink to="/admin/users" className={linkClass}>
                  <Users size={18} />
                  Users
                </NavLink>

                <NavLink to="/admin/messages" className={linkClass}>
                  <MessageSquare size={18} />
                  Messages
                </NavLink>
              </div>

              <div className="mb-6">
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  Content Management
                </div>

                <NavLink to="/admin/novels" className={linkClass}>
                  <BookOpen size={18} />
                  Novels
                </NavLink>

                <NavLink to="/admin/chapters" className={linkClass}>
                  <FileText size={18} />
                  Chapters
                </NavLink>
              </div>

              <div>
                <div className="mb-2 px-2 text-xs font-semibold uppercase opacity-60">
                  Site
                </div>

                <NavLink to="/admin/notices" className={linkClass}>
                  <Bell size={18} />
                  Notices
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
