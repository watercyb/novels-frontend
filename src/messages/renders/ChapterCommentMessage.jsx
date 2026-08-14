import { t } from "i18next";
import { Link } from "react-router-dom";

const ChapterCommentMessage = ({ message }) => {
  let content;
  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">{t("unable_display_message")}</p>;
  }

  const commentPreview =
    content.commentContent?.length > 150
      ? `${content.commentContent.slice(0, 150)}...`
      : content.commentContent;

  return (
    <div className="space-y-2">
      <p>
        <Link
          to={`/author/${content.userId}`}
          className="link link-primary font-semibold"
        >
          {content.username}
        </Link>
        commented on your chapter
        <Link
          to={`/chapter/${content.chapterId}`}
          className="link link-primary font-semibold"
        >
          {content.title}
        </Link>
      </p>
      {commentPreview && (
        <div className="rounded-lg bg-base-200 px-3 py-2 text-sm text-base-content/80">
          “{commentPreview}”
        </div>
      )}
    </div>
  );
};

export default ChapterCommentMessage;
