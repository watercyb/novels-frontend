import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "./useUserStore";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useUserStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (await login(email, password)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            {t("welcome_back")}
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder={t("email_address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />

            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-base-content/70 hover:underline"
              >
                {t("forgot_password")}
              </Link>
            </div>

            {error && (
              <p className="text-error font-semibold text-sm">{error}</p>
            )}

            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                t("login")
              )}
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-base-200 flex justify-center">
          <p className="text-sm text-base-content/70">
            {t("do_not_have_account")}{" "}
            <Link
              to="/signup"
              state={{ from: location.state?.from }}
              className="text-primary hover:underline"
            >
              {t("sign_up")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
