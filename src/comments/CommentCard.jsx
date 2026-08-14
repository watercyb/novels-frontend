import { useState } from "react";
import avatar from "../assets/avatar.png";
import useCommentStore from "./UseCommentStore";
import { useTranslation } from "react-i18next";
import useUserStore from "../auth/AseUserStore";
import DeleteConfirmModel from "./DeleteConfirmModel";
import { formatDateTimeString } from "../utils/formatDate";

const CommentCard = ({
  comment,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
}) => {
  const {
    isPosting,
    isDeleting,
    getReplies,
    postReply,
    deleteComment,
    deleteReply,
  } = useCommentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowReply, setIsShowReply] = useState(false);
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(false);

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        {/* User */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={comment.userAvatarUrl ?? avatar}
                  alt={comment.username}
                />
              </div>
            </div>

            <div className="flex items-center flex-wrap">
              <span className="font-semibold pr-3">{comment.username}</span>

              <div className="text-[12px] mt-0.5 text-base-content/70">
                {formatDateTimeString(comment.createdAt)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(user?.id === comment.userId ||
              user?.role === "ADMIN" ||
              user?.role === "SUPERADMIN") && (
              <button
                className="btn btn-ghost btn-error btn-xs"
                onClick={() => {
                  setDeleteId(comment.id);
                  setOpen(true);
                }}
                disabled={isDeleting}
              >
                {t("delete")}
              </button>
            )}
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => {
                if (replyingTo === comment.id) {
                  setReplyingTo(null);
                  setReplyContent("");
                } else {
                  setReplyingTo(comment.id);
                  setReplyContent("");
                }
              }}
            >
              {t("Reply")}
            </button>
          </div>
        </div>

        {/* Content */}

        <p className="whitespace-pre-wrap">{comment.content}</p>

        {/* Reply button */}
        <div className="flex gap-2">
          {comment.commentCount > 0 && (
            <div>
              <button
                className="btn btn-link btn-sm px-0"
                onClick={async () => {
                  if (!comment.replies) {
                    setIsLoading(true);
                    await getReplies(comment.id);
                    setIsLoading(false);
                    setIsShowReply(true);
                  } else {
                    setIsShowReply(!isShowReply);
                  }
                }}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm ml-4" />
                ) : isShowReply ? (
                  t("hide_replies")
                ) : (
                  `${t("show_replies")} (${comment.commentCount})`
                )}
              </button>
            </div>
          )}
        </div>

        {/* Replies */}

        {isShowReply && (
          <div className="ml-8 mt-3 space-y-3 border-l-2 border-base-300 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex justify-between">
                <div className="flex gap-3">
                  <div className="avatar">
                    <div className="size-8 rounded-full">
                      <img
                        src={reply.userAvatarUrl ?? avatar}
                        alt={reply.username}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center flex-wrap">
                      <div className="font-medium pr-3">{reply.username}</div>
                      <div className="text-[12px] mt-0.5 text-base-content/70">
                        {formatDateTimeString(comment.createdAt)}
                      </div>
                    </div>

                    <div>{reply.content}</div>
                  </div>
                </div>

                <div>
                  {(user?.id === reply.userId ||
                    user?.role === "ADMIN" ||
                    user?.role === "SUPERADMIN") && (
                    <button
                      className="btn btn-ghost btn-error btn-xs"
                      onClick={() => {
                        setDeleteId(reply.id);
                        setOpen(true);
                      }}
                      disabled={isDeleting}
                    >
                      {t("delete")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {replyingTo === comment.id && (
          <div className="mt-3 rounded-box bg-base-100 p-3">
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder={t("reply_to", { username: comment.username })}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />

            <div className="mt-2 flex justify-end gap-2">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
              >
                {t("cancel")}
              </button>

              <button
                className="btn btn-primary btn-sm"
                disabled={isPosting || !replyContent.trim()}
                onClick={async () => {
                  if (await postReply(comment.id, replyContent.trim())) {
                    setReplyingTo(null);
                    setReplyContent("");
                  }
                }}
              >
                {isPosting ? t("posting") : t("post_reply")}
              </button>
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmModel
        open={open}
        setOpen={setOpen}
        onConfirm={() => {
          if (deleteId === comment.id) {
            deleteComment(deleteId);
          } else {
            deleteReply(comment.id, deleteId);
          }
          setDeleteId(null);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CommentCard;
