import { useTranslation } from "react-i18next";
import useAdminStore from "../UseAdminStore";

const Pagination = () => {
  const { userCurrentPage, userTotalPages, lastSearch, getUsersByPage } =
    useAdminStore();
  const { t } = useTranslation();

  const getPages = () => {
    if (userTotalPages <= 7) {
      return Array.from({ length: userTotalPages }, (_, i) => i);
    }

    if (userCurrentPage < 4) {
      return [0, 1, 2, 3, 4, "...", userTotalPages - 1];
    }

    if (userCurrentPage > userTotalPages - 5) {
      return [
        0,
        "...",
        userTotalPages - 5,
        userTotalPages - 4,
        userTotalPages - 3,
        userTotalPages - 2,
        userTotalPages - 1,
      ];
    }

    return [
      0,
      "...",
      userCurrentPage - 1,
      userCurrentPage,
      userCurrentPage + 1,
      "...",
      userTotalPages - 1,
    ];
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        className="btn btn-outline"
        disabled={userCurrentPage <= 0 || !lastSearch}
        onClick={() => getUsersByPage(userCurrentPage - 1)}
      >
        {t("previous")}
      </button>

      {getPages().map((page, idx) => (
        <button
          key={idx}
          className={`btn btn-sm ${
            userCurrentPage === page ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => getUsersByPage(page)}
          disabled={!lastSearch || page === "..."}
        >
          {page === "..." ? page : page + 1}
        </button>
      ))}

      <button
        className="btn btn-outline"
        disabled={userCurrentPage >= userTotalPages - 1 || !lastSearch}
        onClick={() => getUsersByPage(userCurrentPage + 1)}
      >
        {t("next")}
      </button>
    </div>
  );
};

export default Pagination;
