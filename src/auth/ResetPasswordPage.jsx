import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import useUserStore from "./UseUserStore";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, error, resetPassword, clearError } = useUserStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    document.title = t("forgot_password_title") + " - Cat Novels";
  }, [t]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (await resetPassword(email, code, password)) {
      document.activeElement?.blur();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            {t("reset_password")}
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <PasswordStrengthMeter password={password} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={20} />
              ) : (
                t("reset")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
