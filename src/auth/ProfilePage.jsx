import { useEffect, useRef, useState } from "react";
import useUserStore from "./useUserStore";
import avatar from "../assets/avatar.png";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import showToast from "../utils/Toast";

export default function ProfilePage() {
  const { user } = useUserStore();
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || avatar);
  const fileInputRef = useRef(null);
  const [isLoadingUser, setIsLoadingUser] = useState(user?.username == null);
  const [avatarFile, setAvatarFile] = useState(null);
  const { isLoading, updateProfile } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("menu_profile") + " - Cat Novels";
  }, [t]);

  if (user.username && isLoadingUser) {
    setIsLoadingUser(false);
    setUsername(user.username);
    setAvatarUrl(user.avatarUrl);
  }

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

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
          <h2 className="text-3xl font-bold text-center mb-6">
            {t("user_profile")}
          </h2>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div
              className="avatar cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
                <img src={avatarUrl} alt="Avatar" className="object-cover" />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold">
                  {t("update")}
                </div>
              </div>
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
