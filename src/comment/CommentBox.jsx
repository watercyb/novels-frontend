import { useEffect, useState } from "react";
import useCommentStore from "./UseCommentStore";
import { useTranslation } from "react-i18next";
import CommentCard from "./CommentCard";

export default function CommentBox({ chapterId }) {
  const {
    comments,
    size,
    totalPages,
    isLoadingComments,
    isPosting,
    getComments,
    getMoreComments,
    postComment,
  } = useCommentStore();
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();

  const [newComment, setNewComment] = useState("");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    getComments(chapterId);
  }, [chapterId, getComments]);

  const handleNext = async () => {
    if (currentPage + 1 < totalPages) {
      if (Math.trunc((comments.length + size - 1) / size) <= currentPage + 1)
        await getMoreComments(chapterId);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrv = async () => {
    if (currentPage - 1 >= 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="border border-base-300 rounded-box bg-base-100 p-4">
        {/* Header */}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t("comments")}</h2>
        </div>

        {/* Loading */}
        {isLoadingComments && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg mr-4"></span>
            {t("loading")}
          </div>
        )}

        {/* Empty State */}

        {!isLoadingComments && comments.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-5xl mb-2">💬</div>

            <h3 className="text-lg font-semibold">No comments yet</h3>

            <p className="text-sm opacity-70">{t("first_comment")}</p>
          </div>
        )}

        {!isLoadingComments && (
          <div className="space-y-4">
            {/* Comments */}

            <div className="card bg-base-200 mb-6">
              <div className="card-body">
                <h3 className="font-semibold">{t("leave_comment")}</h3>

                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  placeholder={t("write_comment")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <div className="flex justify-end">
                  <button
                    className="btn btn-primary"
                    disabled={isPosting || !newComment.trim()}
                    onClick={async () => {
                      if (await postComment(chapterId, newComment.trim())) {
                        setNewComment("");
                        setCurrentPage(0);
                        await getComments(chapterId);
                      }
                    }}
                  >
                    {isPosting ? t("posting") : t("post_comment")}
                  </button>
                </div>
              </div>
            </div>

            {comments
              .slice(currentPage * size, currentPage * size + size)
              .map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                />
              ))}

            {/* Pagination */}

            <div className="flex justify-center gap-2">
              <button
                className="btn"
                disabled={currentPage === 0}
                onClick={handlePrv}
              >
                Previous
              </button>

              <span className="flex items-center px-2">
                Page {Math.min(currentPage + 1, totalPages)} / {totalPages}
              </span>

              <button
                className="btn"
                disabled={currentPage + 1 >= totalPages}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
