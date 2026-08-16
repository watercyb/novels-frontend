import { Link } from "react-router-dom";
import { t } from "i18next";
import { Trans } from "react-i18next";

const CommentRepliedMessage = ({ message }) => {
  let content;
  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">{t("unable_display_message")}</p>;
  }

  if (content.replyCommentContent === null)
    return (
      <p>
        <Trans
          i18nKey="reply_deleted"
          values={{ username: content.username}}
          components={{
            user: (
              <Link
                to={`/author/${content.userId}`}
                className="link link-primary font-semibold"
              />
            )
          }}
        />
      </p>
    );

  const truncate = (text) => {
    if (!text) return "";
    return text.length > 150 ? `${text.slice(0, 150)}...` : text;
  };

  return (
    <div className="space-y-2">
      <p>
        <Trans
          i18nKey="reply_comment"
          values={{ username: content.username, title: content.title }}
          components={{
            user: (
              <Link
                to={`/author/${content.userId}`}
                className="link link-primary font-semibold"
              />
            ),
            chapter: (
              <Link
                to={`/chapter/${content.chapterId}`}
                className="link link-primary font-semibold"
              />
            ),
          }}
        />
      </p>
      {content.parentCommentContent && (
        <div className="rounded-lg bg-base-200 px-2 py-1 text-sm text-base-content/60">
          <span className="font-medium">{t("your_comment")}</span> “
          {truncate(content.parentCommentContent)}”
        </div>
      )}
      {content.replyCommentContent && (
        <div className="rounded-lg bg-base-200 px-2 py-1 text-sm">
          <span className="font-medium">{t("reply")}</span> “
          {truncate(content.replyCommentContent)}”
        </div>
      )}
    </div>
  );
};

export default CommentRepliedMessage;
