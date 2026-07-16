import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChapterNavigation = ({ prv, next, novelId }) => {
  const { t } = useTranslation();

  return (
    <div className="navbar bg-base-100 rounded-box shadow-sm px-4">
      <div className="navbar-start">
        {prv ? (
          <Link
            to={`/chapter/${prv.id}`}
            className="btn btn-outline border-base-300"
            title={prv.title}
            onClick={(e) => e.currentTarget.blur()}
          >
            ← {t("previous")}
          </Link>
        ) : (
          <button className="btn btn-outline border-base-300" disabled>
            ← {t("no_prv_chapter")}
          </button>
        )}
      </div>

      <div className="navbar-center">
        <Link
          to={`/novel/${novelId}`}
          className="btn btn-ghost"
          onClick={(e) => e.currentTarget.blur()}
        >
          {t("chapter_list")}
        </Link>
      </div>

      <div className="navbar-end">
        {next ? (
          <Link
            to={`/chapter/${next.id}`}
            className="btn btn-outline border-base-300"
            title={next.title}
            onClick={(e) => e.currentTarget.blur()}
          >
            {t("next")} →
          </Link>
        ) : (
          <button className="btn btn-outline border-base-300" disabled>
            {t("no_next_chapter")} →
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterNavigation;
