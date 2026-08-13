import { useEffect } from "react";
import { t } from "i18next";
import useAdminStore from "../UseAdminStore";
import MessageCard from "../../messages/MessageCard";

const AdminMessagePage = () => {
  const { messages, messageTotalItems, isloadingMessages, getMessages } =
    useAdminStore();

  useEffect(() => {
    getMessages(true);
  }, [getMessages]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("messages")}</h1>

      <div className="space-y-3">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>

      {messages.length === 0 && !isloadingMessages && (
        <div className="text-center text-base-content/60 py-10">
          {t("no_message")}
        </div>
      )}

      {messages.length < messageTotalItems && (
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-outline"
            onClick={() => getMessages(false)}
            disabled={isloadingMessages}
          >
            {isloadingMessages ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMessagePage;
