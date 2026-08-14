import { useEffect, useRef, useState } from "react";
import useUserStore from "./UseUserStore";
import avatar from "../assets/avatar.png";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import showToast from "../utils/Toast";
import { SquarePen } from "lucide-react";
import UserRole from "../utils/UserRole";

export default function ProfilePage() {
  const { user } = useUserStore();
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || avatar);
  const fileInputRef = useRef(null);
  const [isLoadingUser, setIsLoadingUser] = useState(user?.username == null);
  const [avatarFile, setAvatarFile] = useState(null);
  const { isLoading, isRequestingUpdate, updateProfile, updateRole } =
    useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("menu_profile") + " - Cat Novels";
  }, [t]);

  if (user.username && isLoadingUser) {
    setIsLoadingUser(false);
    setUsername(user.username);
    setAvatarUrl(user?.avatarUrl || avatar);
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      setAvatarFile(file);
    }
  };

  const handleUpdate = async () => {
    if (avatarFile || user.username != username) {
      if (await updateProfile(avatarFile, username)) {
        showToast(t("profile_updated"), "success");
        setAvatarFile(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6 relative">
            {t("user_profile")}
            <div
              className="absolute top-1 right-1 cursor-pointer"
              onClick={async () => {
                if (
                  user.role === "USER" &&
                  !isRequestingUpdate &&
                  (await updateRole())
                )
                  showToast(t("role_request_sent"), "success");
              }}
            >
              <div
                className="tooltip block w-full"
                data-tip={
                  user.role === "USER" ? t("update_role") : t(user.role)
                }
              >
                {isRequestingUpdate ? (
                  <Loader className="animate-spin mx-auto" size={20} />
                ) : (
                  <UserRole user={user} />
                )}
              </div>
            </div>
          </h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="avatar cursor-pointer group relative"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img src={avatarUrl} alt="Avatar" className="object-cover" />
              </div>
              <SquarePen className="absolute opacity-0 group-hover:opacity-60 top-1 right-1 bg-base-100 text-base-content" />
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Username */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">{t("username")}</span>
            </label>

            <input
              type="text"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">{t("email")}</span>
            </label>

            <input
              type="email"
              className="input input-bordered w-full"
              value={user?.email ?? ""}
              disabled
            />
          </div>

          {/* Update Button */}
          <button className="btn btn-primary w-full" onClick={handleUpdate}>
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              t("update")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
