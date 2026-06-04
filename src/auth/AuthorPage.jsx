import { useParams } from "react-router-dom";
import NovelCard from "../novels/NovelCard";
import useUserStore from "./useUserStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatDateString } from "../utils/formatDate";

const AuthorPage = () => {
  const { authorId } = useParams();
  const { author, isLoadingAuthor, getAuthor } = useUserStore();
  const { t } = useTranslation();

  useEffect(() => {
    getAuthor(authorId);
  }, [authorId, getAuthor]);

  return (
    <div>
      {(isLoadingAuthor || !author) && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {!isLoadingAuthor && author && (
        <div className="container mx-auto max-w-6xl px-4 py-6">
          {/* Author Info */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={author.avatarUrl} alt={author.username} />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold">{author.username}</h1>

                  <p className="text-base-content/70 mt-2">
                    {t("joined_on")} {formatDateString(author.createdAt)}
                  </p>

                  {/* Stats */}
                  <div className="stats stats-horizontal shadow mt-4">
                    <div className="stat">
                      <div className="stat-title">{t("novels")}</div>
                      <div className="stat-value text-primary">
                        {author.novelCount}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">{t("chapters")}</div>
                      <div className="stat-value text-secondary">
                        {author.chapterCount}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">{t("words")}</div>
                      <div className="stat-value text-accent text-3xl">
                        {author.wordCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Novel List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{t("novels")}</h2>

              <div className="badge badge-primary badge-lg">
                {author.novelCount}
              </div>
            </div>

            {author.novels.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2 md:gap-6">
                {author.novels.map((novel) => (
                  <NovelCard key={novel.id} novel={novel} />
                ))}
              </div>
            ) : (
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body items-center text-center">
                  <p className="text-base-content/70">
                    {t("no_novel_published")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;
