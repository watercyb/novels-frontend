import { useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import useUserStore from "./useUserStore";
import { useTranslation } from "react-i18next";
import showToast from "../utils/Toast";

const UpdatePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isLoading, error, updatePassword } = useUserStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (await updatePassword(oldPassword, newPassword)) {
     showToast(t("password_updated"), { id: "success" });
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            {t("update_password")}
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="password"
              placeholder={t("old_password")}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input input-bordered w-full"
            />

            <input
              type="password"
              placeholder={t("new_password")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <PasswordStrengthMeter password={newPassword} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={20} />
              ) : (
                t("update")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdatePasswordPage;
