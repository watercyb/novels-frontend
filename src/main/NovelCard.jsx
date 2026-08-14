import { Link } from "react-router-dom";
import cover from "../assets/cover.png";
import { Heart, BookOpen, FileText, Star } from "lucide-react";
import useUserStore from "../auth/UseUserStore";
import { t } from "i18next";

const NovelCard = ({ novel }) => {
  const { favorites } = useUserStore();
  const isFavorite = favorites.has(Number(novel.id));

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition overflow-hidden"
      title={novel.title.trim().length == 0 ? t("untitled") : novel.title}
    >
      {/* Cover */}
      <Link to={`/novel/${novel.id}`} onClick={(e) => e.currentTarget.blur()}>
        <div className="relative w-full">
          <img
            src={
              novel.coverUrl && novel.coverUrl.startsWith("http")
                ? novel.coverUrl
                : cover
            }
            alt={novel.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = cover;
            }}
            className="w-full aspect-3/4 object-cover rounded-lg [image-rendering:-webkit-optimize-contrast] p-1"
          />

          {isFavorite && (
            <Star className="absolute top-2 right-2 fill-red-500 text-red-500 size-5" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="card-body p-3 gap-0">
        {/* Title */}
        <Link to={`/novel/${novel.id}`} onClick={(e) => e.currentTarget.blur()}>
          <h2 className="text-lg font-bold line-clamp-2 min-h-14 hover:text-primary">
            {novel.title.trim().length == 0 ? t("untitled") : novel.title}
          </h2>
        </Link>

        {/* Last Chapter */}
        <div className="mt-1">
          <p className="text-sm font-medium line-clamp-1 min-h-5">
            {novel.lastChapterTitle}
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-2 pt-2 border-t border-base-300 text-sm">
          <div className="flex items-center gap-1">
            <Heart size={15} className="text-error" />
            <span>{novel.likeCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <BookOpen size={15} />
            <span>{novel.chapterCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <FileText size={15} />
            <span>{novel.wordCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelCard;
