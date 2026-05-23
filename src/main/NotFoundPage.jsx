import { Link } from "react-router-dom";
import PageNotFound from "../assets/PageNotFound.png";
import { useTranslation } from "react-i18next";
const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-175 px-6">
      <div className="w-full text-center">
        {/* Image */}
        <img
          src={PageNotFound}
          alt="Page not found"
          className="w-3xl mx-auto mb-2 opacity-80"
        />

        {/* Notice */}
        <div className="text-3xl opacity-100 font-bold mb-2">
          {t("page_not_found_a")}
        </div>

        <div className="text-2xl opacity-70 mb-8">{t("page_not_found_b")}</div>

        {/* Back Button */}
        <Link to="/" className="btn btn-primary rounded-xl px-8">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
