import { useState } from "react";
import { Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../utils/PasswordStrengthMeter";
import useUserStore from "./useUserStore";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isLoading, error, signup } = useUserStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (await signup(name, email, password)) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-box shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">
            {t("create_account")}
          </h2>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              placeholder={t("full_name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />

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
                t("sign_up_button")
              )}
            </button>
          </form>
        </div>

        <div className="px-8 py-4 bg-base-200 flex justify-center">
          <p className="text-sm text-base-content/70">
            {t("already_have_account")}{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
