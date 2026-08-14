import { useEffect } from "react";
import useMessageStore from "./UseMessageStore";
import MessageCard from "./MessageCard";
import { t } from "i18next";

const MessagePage = () => {
  const { messages, totalItems, isLoadingMessages, getMessages } =
    useMessageStore();

  useEffect(() => {
    getMessages(true);
  }, [getMessages]);

  return (
    <>
      {/* Loading */}
      {isLoadingMessages && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg mr-4"></span>
          {t("loading")}
        </div>
      )}
      {!isLoadingMessages && (
        <div className="container mx-auto max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">{t("messages")}</h1>

          <div className="space-y-3">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>

          {messages.length === 0 && !isLoadingMessages && (
            <div className="text-center text-base-content/60 py-10">
              {t("no_message")}
            </div>
          )}

          {messages.length < totalItems && (
            <div className="flex justify-center mt-6">
              <button
                className="btn btn-outline"
                onClick={() => getMessages(false)}
                disabled={isLoadingMessages}
              >
                {isLoadingMessages ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MessagePage;
