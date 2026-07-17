import DOMPurify from "dompurify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useChapterStore from "./UseChapterStore";
import NotFoundPage from "../main/NotFoundPage";
import Content from "./Content";
import ChapterNavigation from "./ChapterNavigation";
import { formatDateTimeString } from "../utils/formatDate";
import { useTranslation } from "react-i18next";
import { Clock3, User } from "lucide-react";
import CommentBox from "../comments/CommentBox";

const ChapterPage = () => {
  const { chapterId } = useParams();
  const { chapter, prv, next, isLoadingChapter, getChapter } =
    useChapterStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingChapter) {
      getChapter(chapterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, getChapter]);

  useEffect(() => {
    if (!isLoadingChapter && chapter?.id == chapterId) {
      document.title =
        (chapter?.title ?? "") +
        " - " +
        (chapter?.novelTitle ?? "") +
        " - Cat Novels";
      document.activeElement?.blur();
      navigate(`/chapter/${chapterId}`, { replace: true });
    }
  }, [chapter, chapterId, isLoadingChapter, navigate]);

  const cleanHTML = DOMPurify.sanitize(chapter?.content ?? "");

  return (
    <>
      {/* Loading */}
      {isLoadingChapter && !chapter && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {/* No Chapter */}
      {!isLoadingChapter && !chapter && <NotFoundPage />}
      {!isLoadingChapter && chapter && (
        <div className="min-h-screen bg-base-200 py-8">
          <div className="mx-auto max-w-4xl px-1 md:px-4">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">{chapter.title}</h1>

              <div className="mt-3 flex items-center justify-between text-sm text-base-content/70 mx-2">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{chapter.author}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock3 size={14} />
                  <span>{formatDateTimeString(chapter.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Top Navigation */}
            <ChapterNavigation
              prv={prv}
              next={next}
              novelId={chapter.novelId}
            />

            {/* Content */}
            <div className="card bg-base-100 shadow-none md:shadow-lg my-6">
              <div className="card-body md:px-12 md:py-10">
                <Content content={cleanHTML} />
              </div>
            </div>

            {/* Bottom Navigation */}
            <ChapterNavigation prv={prv} next={next} />

            {/* Comments */}
            <div className="card bg-base-100 shadow-none md:shadow-lg my-6">
              <CommentBox chapterId={chapter.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterPage;
