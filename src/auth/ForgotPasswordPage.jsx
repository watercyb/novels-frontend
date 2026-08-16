import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "./UseUserStore";
import { useTranslation } from "react-i18next";
import showToast from "../utils/Toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading, error, forgotPassword, clearError } = useUserStore();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    document.title = t("reset_password") + " - Cat Novels";
  }, [t]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (await forgotPassword(email)) {
      showToast(t("reset_email_sent"), "success");
      document.activeElement?.blur();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            {t("forgot_password_title")}
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="email"
              placeholder={t("email_address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={20} />
              ) : (
                t("send_verification_email")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
