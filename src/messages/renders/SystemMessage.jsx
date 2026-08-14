import { t } from "i18next";

const SystemMessage = ({ message }) => {
  const messageContent = message.messageContent;
  if (!messageContent)
    return <p className="text-error">{t("unable_display_message")}</p>;

  return <p>{t(messageContent)}</p>;
};

export default SystemMessage;
