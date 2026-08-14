import { useEffect } from "react";
import useHomepageStore from "./UseHomepageStore";
import NovelCard from "./NovelCard";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { topTen, recentTen, isLoadingHomepage, getHomepage } =
    useHomepageStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Cat Novels";
    getHomepage();
  }, [getHomepage]);

  return (
    <>
      {/* Loading */}
      {(isLoadingHomepage || topTen == null || recentTen == null) && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {!isLoadingHomepage && topTen != null && recentTen != null && (
        <div className="flex flex-col gap-2 mx-auto max-w-6xl px-6 py-6 space-y-8">
          {/* Top Views */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t("top_views_week")}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
              {topTen.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          </div>

          {/* Recent Updated */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t("recent_updated")}</h2>

              <Link
                to="/all"
                className="text-sm text-primary hover:underline"
                onClick={(e) => e.currentTarget.blur()}
              >
                {t("view_more")}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {recentTen.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Homepage;
