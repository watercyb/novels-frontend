import { t } from "i18next";

const UserMessage = ({ message }) => {
  const messageContent = message.messageContent;
  if (!messageContent)
    return <p className="text-error">{t("unable_display_message")}</p>;

  return <p>{messageContent}</p>;
};

export default UserMessage;
