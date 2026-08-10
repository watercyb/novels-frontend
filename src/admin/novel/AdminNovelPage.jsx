import { t } from "i18next";
import useAdminStore from "../UseAdminStore";
import NovelCard from "./NovelCard";
import { formatDateString } from "../../utils/formatDate";
import UserRole from "../../utils/UserRole";
import DeleteNovelDialog from "./DeleteNovelDialog";
import { useState } from "react";

const AdminNovelPage = () => {
  const { user, isLoadingUser, operation } = useAdminStore();
  const [novelToDelete, setNovelToDelete] = useState(null);

  return (
    <>
      {/* Loading */}
      {isLoadingUser && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {/* No User */}
      {!isLoadingUser && !user?.username && (
        <div className="flex h-full min-h-125 items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-50">👤</div>

            <h2 className="text-2xl font-semibold">
              {t("please_select_user")}
            </h2>

            <p className="mt-2 text-base-content/60">
              {t("select_user_from_users_tab")}
            </p>
          </div>
        </div>
      )}
      {/* Operation */}
      {operation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-lg font-medium">{t(operation)}</span>
          </div>
        </div>
      )}
      {!isLoadingUser && user?.username && (
        <div className="container mx-auto max-w-6xl px-4 py-6">
          {/* Author Info */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.avatarUrl} alt={user.username} />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left w-fit">
                  <h1 className="flex items-center text-3xl font-bold">
                    {user.username}
                    <div className="ml-2">
                      <div
                        className="tooltip block w-full"
                        data-tip={t(user.role)}
                      >
                        <UserRole user={user} />
                      </div>
                    </div>
                  </h1>

                  <p className="text-base-content/70 mt-2">
                    {t("joined_on")} {formatDateString(user.createdAt)}
                  </p>

                  {/* Stats */}
                  <div className="stats stats-horizontal shadow mt-4">
                    <div className="stat">
                      <div className="stat-title">{t("novels")}</div>
                      <div className="stat-value text-primary">
                        {user.novelCount}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">{t("chapters")}</div>
                      <div className="stat-value text-secondary">
                        {user.chapterCount}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">{t("words")}</div>
                      <div className="stat-value text-accent text-3xl">
                        {user.wordCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Novel List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t("novels")}</h2>

              <div className="badge badge-primary badge-lg">
                {user.novelCount}
              </div>
            </div>

            {user.novels.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2 md:gap-6">
                {user.novels.map((novel) => (
                  <NovelCard
                    key={novel.id}
                    novel={novel}
                    setNovelToDelete={setNovelToDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body items-center text-center">
                  <p className="text-base-content/70">
                    {t("no_novel_published")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DeleteNovelDialog
            novelToDelete={novelToDelete}
            setNovelToDelete={setNovelToDelete}
          />
        </div>
      )}
    </>
  );
};

export default AdminNovelPage;
