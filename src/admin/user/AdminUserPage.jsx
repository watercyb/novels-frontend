import { useState } from "react";
import UserCard from "./UserCard";
import useAdminStore from "../UseAdminStore";
import Pagination from "./Pagination";
import { useTranslation } from "react-i18next";
import ChangeRoleDialog from "./ChangeRoleDialog";
import DeleteUserDialog from "./DeleteUserDialog";

const AdminUserPage = () => {
  const [searchMode, setSearchMode] = useState("id");
  const [idOrEmail, setIdOrEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(0);
  const { users, isLoading, getUsers } = useAdminStore();
  const [menuUser, setMenuUser] = useState(null);
  const { t } = useTranslation();
  const [changeRoleUser, setChangeRoleUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex gap-2">
            <button
              className={`btn ${searchMode === "id" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSearchMode("id")}
            >
              {t("id_email")}
            </button>

            <button
              className={`btn ${searchMode === "name" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSearchMode("name")}
            >
              {t("username_role")}
            </button>
          </div>

          {searchMode === "id" ? (
            <div className="flex gap-3 mt-4">
              <input
                className="input input-bordered flex-1"
                placeholder={t("user_id_email")}
                value={idOrEmail}
                onChange={(e) => setIdOrEmail(e.target?.value)}
              />

              <button
                className="btn btn-primary"
                onClick={async () => getUsers(idOrEmail)}
              >
                {t("search")}
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <input
                className="input input-bordered flex-1"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target?.value)}
              />

              <select
                className="select select-bordered max-w-50"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value={0}>{t("all_roles")}</option>
                <option value={"USER"}>{t("USER")}</option>
                <option value={"AUTHOR"}>{t("AUTHOR")}</option>
                <option value={"ADMIN"}>{t("ADMIN")}</option>
                <option value={"SUPERADMIN"}>{t("SUPERADMIN")}</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => {
                  getUsers(null, username, role, 0);
                }}
              >
                {t("search")}
              </button>
            </div>
          )}
        </div>
      </div>

      <table className="table table-zebra table-fixed w-full">
        <thead>
          <tr>
            <th className="w-16">{t("id")}</th>
            <th className="w-48">{t("username")}</th>
            <th>{t("email")}</th>
            <th className="w-32">{t("role")}</th>
            <th className="w-32">{t("action")}</th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="skeleton h-4 w-8"></div>
                  </td>

                  <td>
                    <div className="skeleton h-4 w-32"></div>
                  </td>

                  <td>
                    <div className="skeleton h-4 w-48"></div>
                  </td>

                  <td>
                    <div className="skeleton h-4 w-16"></div>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <div className="skeleton h-8 w-12"></div>
                      <div className="skeleton h-8 w-12"></div>
                    </div>
                  </td>
                </tr>
              ))
            : users.map((user) => (
                <UserCard
                  key={user.id}
                  cardUser={user}
                  menuUser={menuUser}
                  setMenuUser={setMenuUser}
                  setChangeRoleUser={setChangeRoleUser}
                  setUserToDelete={setUserToDelete}
                />
              ))}
        </tbody>
      </table>

      {!isLoading && users.length === 0 && (
        <div className="mt-4 rounded-lg border border-base-300 bg-base-200 p-8 text-center">
          <div className="text-lg font-semibold">{t("no_user_found")}</div>

          <div className="mt-1 text-sm text-base-content/70">
            {t("no_user_found_text")}
          </div>
        </div>
      )}

      <Pagination />
      <ChangeRoleDialog
        changeRoleUser={changeRoleUser}
        setChangeRoleUser={setChangeRoleUser}
      />

      <DeleteUserDialog
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
      />
    </div>
  );
};

export default AdminUserPage;
