import { useEffect, useState } from "react";
import useUserStore from "../auth/useUserStore";
import useMyNovelStore from "./useMyNovelStore";
import { t } from "i18next";
import avatar from "../assets/avatar.png";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import showToast from "../utils/Toast";
import CreateNovelDialog from "./CreateNovelDialog";

const MyNovels = () => {
  const { user, isLoading } = useUserStore();
  const {
    novels,
    isLoadingMyNovels,
    isCreatingNovel,
    isDeletingNovel,
    getNovels,
    createNovel,
    deleteNovel,
  } = useMyNovelStore();
  const [novelToDelete, setNovelToDelete] = useState(null);
  const navigate = useNavigate();
  const [createNovelDialogOpen, setCreateNovelDialogOpen] = useState(null);

  useEffect(() => {
    getNovels();
  }, [getNovels, user]);

  const handleDeleteNovel = async () => {
    if (!novelToDelete?.id) return;
    if (await deleteNovel(novelToDelete.id)) {
      setNovelToDelete(null);
      showToast(t("novel_deleted"), "success");
    }
  };

  return (
    <div>
      {/* Loading */}
      {(isLoadingMyNovels || isLoading) && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {!isLoadingMyNovels && !isLoading && novels && (
        <div className="max-w-4xl mx-auto p-4">
          {/* User Info */}
          <div className="card bg-base-100 shadow-md mb-6">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={user.avatarUrl || avatar} alt={user.username} />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-base-content/70">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Novel List */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title mb-2">{t("my_novels")}</h2>
                <button
                  className="btn btn-primary btn-md w-30"
                  onClick={() => setCreateNovelDialogOpen(true)}
                  disabled={isCreatingNovel}
                >
                  {t("new_novel")}
                </button>
              </div>

              <div className="divide-y divide-base-300">
                {novels.map((novel) => (
                  <div
                    key={novel.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div
                      className="font-medium text-lg cursor-pointer"
                      onClick={() => navigate(`/my-novels/${novel.id}`)}
                    >
                      {novel.title}
                    </div>

                    <button
                      className="btn btn-circle btn-ghost btn-sm text-error mr-4"
                      aria-label="Delete novel"
                      onClick={() => setNovelToDelete(novel)}
                      disabled={isDeletingNovel}
                    >
                      {isDeletingNovel ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {novels.length === 0 && (
                <div className="text-center py-8 text-base-content/60">
                  {t("no_published_novel")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Novel dialog*/}
      <dialog open={novelToDelete} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("confirm_delete")}</h3>
          <p className="py-4">
            {t("to_delete_novel", { title: novelToDelete?.title })}
          </p>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setNovelToDelete(null)}
              disabled={isDeletingNovel}
            >
              {t("cancel")}
            </button>
            <div className="min-w-20">
              <button
                className="btn btn-error w-full"
                onClick={() => {
                  handleDeleteNovel();
                }}
                disabled={isDeletingNovel}
              >
                {isDeletingNovel ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  t("delete")
                )}
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <CreateNovelDialog
        createNovelDialogOpen={createNovelDialogOpen}
        setCreateNovelDialogOpen={setCreateNovelDialogOpen}
        isCreatingNovel={isCreatingNovel}
        createNovel={createNovel}
      />
    </div>
  );
};

export default MyNovels;
