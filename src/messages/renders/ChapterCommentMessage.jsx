import { t } from "i18next";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";

const ChapterCommentMessage = ({ message }) => {
  let content;
  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">{t("unable_display_message")}</p>;
  }

  if (content.commentContent === null)
    return (
      <p>
        <Trans
          i18nKey="comment_deleted"
          values={{ username: content.username }}
          components={{
            user: (
              <Link
                to={`/author/${content.userId}`}
                className="link link-primary font-semibold"
              />
            ),
          }}
        />
      </p>
    );

  const commentPreview =
    content.commentContent?.length > 150
      ? `${content.commentContent.slice(0, 150)}...`
      : content.commentContent;

  return (
    <div className="space-y-2">
      <p>
        <Trans
          i18nKey="comment_chapter"
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
      {commentPreview && (
        <div className="rounded-lg bg-base-200 px-2 py-1 text-sm text-base-content/80">
          “{commentPreview}”
        </div>
      )}
    </div>
  );
};

export default ChapterCommentMessage;
