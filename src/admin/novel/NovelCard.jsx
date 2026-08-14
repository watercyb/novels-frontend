import { Link } from "react-router-dom";
import cover from "../../assets/cover.png";
import { useTranslation } from "react-i18next";
import { formatDateTimeString } from "../../utils/formatDate";
import { Heart, BookOpen, FileText, Clock3, Star, Trash2 } from "lucide-react";
import useUserStore from "../../auth/UseUserStore";
import useAdminStore from "../UseAdminStore";

const NovelCard = ({ novel, setNovelToDelete }) => {
  const { t } = useTranslation();
  const { favorites } = useUserStore();
  const isFavorite = favorites.has(Number(novel.id));
  const { getNovel } = useAdminStore();

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
      title={novel.title.trim().length == 0 ? t("untitled") : novel.title}
    >
      <div className="card-body p-2 md:p-6 relative">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Cover */}
          <Link
            to={"/admin/chapters"}
            onClick={(e) => {
              e.currentTarget.blur();
              getNovel(novel.id);
            }}
          >
            <div className="relative">
              <img
                src={
                  novel.coverUrl && novel.coverUrl.startsWith("http")
                    ? novel.coverUrl
                    : cover
                }
                alt={novel.title}
                onError={(e) => {
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = cover;
                }}
                className="md:w-28 md:h-40 rounded-xl object-contain shrink-0 [image-rendering:-webkit-optimize-contrast]"
              />

              {isFavorite && (
                <Star className="absolute top-1 right-1 fill-red-500 text-red-500 size-5 sm:size-5 md:size-4" />
              )}
            </div>
          </Link>

          {/* Info */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Title */}
            <Link
              to={"/admin/chapters"}
              onClick={(e) => {
                e.currentTarget.blur();
                getNovel(novel.id);
              }}
            >
              <h2 className="text-xl md:text-2xl font-bold line-clamp-2">
                {novel.title.trim().length == 0 ? t("untitled") : novel.title}
              </h2>
            </Link>

            {/* Author */}
            <div className="mt-2 hidden md:flex">
              <Link
                to={`/author/${novel.userId}`}
                onClick={(e) => e.currentTarget.blur()}
              >
                <div className="badge badge-primary badge-outline">
                  {novel.author}
                </div>
              </Link>
            </div>

            {/* Last Update */}
            <div className="mt-1 md:mt-3">
              <p className="text-sm opacity-70 mb-1 hidden md:flex">
                {t("last_update")}
              </p>

              <p className="font-medium line-clamp-1">
                {novel.lastChapterTitle}
              </p>

              <div className="items-center gap-2 text-sm opacity-70 mt-1 hidden md:flex">
                <Clock3 size={14} />

                <span>{formatDateTimeString(novel.lastUpdatedAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mt-auto mb-1 pt-2 md:pt-5 text-sm">
              <div className="flex items-center gap-1">
                <Heart size={16} className="text-error" />

                <span>{novel.likeCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <BookOpen size={16} />

                <span>{novel.chapterCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <FileText size={16} />

                <span>{novel.wordCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute top-4 right-4 text-red-500 cursor-pointer"
          onClick={() => setNovelToDelete(novel)}
        >
          <Trash2 size={18} />
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
