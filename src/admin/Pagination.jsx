import { useTranslation } from "react-i18next";
import useAdminStore from "./UseAdminStore";

const Pagination = () => {
  const { currentPage, totalPages, lastSearch, getUsersByPage } =
    useAdminStore();
  const { t } = useTranslation();

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (currentPage < 4) {
      return [0, 1, 2, 3, 4, "...", totalPages - 1];
    }

    if (currentPage > totalPages - 5) {
      return [
        0,
        "...",
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
      ];
    }

    return [
      0,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages - 1,
    ];
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        className="btn btn-outline"
        disabled={currentPage <= 0 || !lastSearch}
        onClick={() => getUsersByPage(currentPage - 1)}
      >
        {t("previous")}
      </button>

      {getPages().map((page, idx) => (
        <button
          key={idx}
          className={`btn btn-sm ${
            currentPage === page ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => getUsersByPage(page)}
          disabled={!lastSearch || page === "..."}
        >
          {page === "..." ? page : page + 1}
        </button>
      ))}

      <button
        className="btn btn-outline"
        disabled={currentPage >= totalPages - 1 || !lastSearch}
        onClick={() => getUsersByPage(currentPage + 1)}
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
