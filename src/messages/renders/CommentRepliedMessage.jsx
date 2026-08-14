import { Link } from "react-router-dom";
import { t } from "i18next";

const CommentRepliedMessage = ({ message }) => {
  let content;
  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">{t("unable_display_message")}</p>;
  }

  const truncate = (text) => {
    if (!text) return "";
    return text.length > 150 ? `${text.slice(0, 150)}...` : text;
  };

  return (
    <div className="space-y-2">
      <p>
        <Link
          to={`/author/${content.userId}`}
          className="link link-primary font-semibold"
        >
          {content.username}
        </Link>
        replied to your comment on
        <Link
          to={`/chapter/${content.chapterId}`}
          className="link link-primary font-semibold"
        >
          {content.title}
        </Link>
      </p>
      {content.parentCommentContent && (
        <div className="rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/60">
          <span className="font-medium">Your comment: </span> “
          {truncate(content.parentCommentContent)}”
        </div>
      )}
      {content.replyCommentContent && (
        <div className="rounded-lg bg-base-200 px-3 py-2 text-sm">
          <span className="font-medium">Reply: </span> “
          {truncate(content.replyCommentContent)}”
        </div>
      )}
    </div>
  );
};

export default CommentRepliedMessage;
