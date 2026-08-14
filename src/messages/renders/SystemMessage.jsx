import { t } from "i18next";

const SystemMessage = ({ message }) => {
  const messageContent = message.sender?.messageContent;
  if (!messageContent)
    return <p className="text-error">{t("unable_display_message")}</p>;

  return <p>messageContent</p>;
};

export default SystemMessage;
