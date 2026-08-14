import { t } from "i18next";

const DeletionMessage = ({ message }) => {
  let content;

  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">{t("unable_display_message")}</p>;
  }

  switch (content.type) {
    case "CHAPTER":
      return (
        <>
          <p>
            {t("content_deleted_by_admin", {
              type: t(content.type),
              name: content.name,
            })}
          </p>
          <p>
            {content.reason && (
              <>
                {" "}
                {t("deletion_reason")}
                {content.reason}
              </>
            )}
          </p>
        </>
      );
    case "NOVEL":
      return (
        <>
          <p>
            {t("content_deleted_by_admin", {
              type: t(content.type),
              name: content.name,
            })}
          </p>
          <p>
            {content.reason && (
              <>
                {" "}
                {t("deletion_reason")}
                {content.reason}
              </>
            )}
          </p>
        </>
      );
    case "COMMENT":
      return (
        <>
          <p>
            {t("content_deleted_by_admin", {
              type: t(content.type),
              name: content.name,
            })}
          </p>
          <p>
            {content.reason && (
              <>
                {" "}
                {t("deletion_reason")}
                {content.reason}
              </>
            )}
          </p>
        </>
      );
    case "REPLY":
      return (
        <>
          <p>
            {t("content_deleted_by_admin", {
              type: t(content.type),
              name: content.name,
            })}
          </p>
          <p>
            {content.reason && (
              <>
                {" "}
                {t("deletion_reason")}
                {content.reason}
              </>
            )}
          </p>
        </>
      );
    default:
      return <p>Content was deleted.</p>;
  }
};

export default DeletionMessage;
