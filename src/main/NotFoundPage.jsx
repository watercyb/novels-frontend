import { Link } from "react-router-dom";
import PageNotFound from "../assets/PageNotFound.png";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
const NotFoundPage = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg mr-4"></span>
        {t("loading")}
      </div>
    );
  }

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
          {t("back_to_home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
