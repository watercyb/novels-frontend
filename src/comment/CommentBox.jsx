import { useEffect, useState } from "react";
import useCommentStore from "./UseCommentStore";
import { useTranslation } from "react-i18next";

export default function CommentBox({ chapterId }) {
  const {
    comments,
    size,
    totalPages,
    isLoadingComments,
    isLoadingReplys,
    getComments,
    getMoreComments,
    getReplys,
  } = useCommentStore();
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getComments(chapterId);
  }, [chapterId, getComments]);

  const handleNext = async () => {
    if (
      currentPage + 1 < totalPages &&
      Math.trunc((comments.length + size - 1) / size) <= currentPage + 1
    ) {
      await getMoreComments(chapterId);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="border border-base-300 rounded-box bg-base-100 p-4">
        {/* Header */}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Comments</h2>
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

            <p className="text-sm opacity-70">
              Be the first person to leave a comment.
            </p>
          </div>
        )}

        {!isLoadingComments && (
          <div className="space-y-4">
            {/* Comments */}

            {comments
              .slice(currentPage * size, currentPage * size + size)
              .map((comment) => (
                <div key={comment.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    {/* User */}

                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={comment.userAvatarUrl}
                            alt={comment.username}
                          />
                        </div>
                      </div>

                      <span className="font-semibold">{comment.username}</span>
                    </div>

                    {/* Content */}

                    <p className="whitespace-pre-wrap">{comment.content}</p>

                    {/* Reply button */}

                    {comment.commentCount > 0 && (
                      <div>
                        <button
                          className="btn btn-link btn-sm px-0"
                          onClick={() => getReplys(comment.id)}
                        >
                          {comment.replies
                            ? "Hide Replies"
                            : `Show Replies (${comment.commentCount})`}
                        </button>
                      </div>
                    )}

                    {/* Replies */}

                    {isLoadingReplys[comment.id] && (
                      <span className="loading loading-spinner loading-sm" />
                    )}

                    {comment.replies && (
                      <div className="ml-8 mt-3 space-y-3 border-l-2 border-base-300 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                <img
                                  src={reply.userAvatarUrl}
                                  alt={reply.username}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="font-medium">
                                {reply.username}
                              </div>

                              <div>{reply.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Pagination */}

            <div className="flex justify-center gap-2">
              <button className="btn" disabled={currentPage === 0}>
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
