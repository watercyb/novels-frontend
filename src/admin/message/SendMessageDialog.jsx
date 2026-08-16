import { t } from "i18next";
import { useState } from "react";
import showToast from "../../utils/Toast";
import useAdminStore from "../UseAdminStore";

const SendMessageDialog = ({ recipient, setRecipient }) => {
  const { isSendingMessage, sendMessage } = useAdminStore();
  const [content, setContent] = useState("");

  if (!recipient) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="text-lg font-bold"> {t("send_message")} </h3>
        <div className="mt-4">
          <label className="label mb-1">
            <span className="label-text">{t("recipient")}</span>
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2">
            <span className="font-medium"> {recipient.username} </span>
          </div>
        </div>
        <div className="mt-3">
          <label className="label text-sm mb-1">
            <span className="label-text">{t("message")}</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={5}
            maxLength={150}
            placeholder={t("message_placeholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSendingMessage}
          />
          <div className="flex justify-end">
            <label className="label text-sm">
              <span
                className={`label-text-alt ${
                  content.length >= 500
                    ? "text-error"
                    : content.length >= 450
                      ? "text-warning"
                      : ""
                }`}
              >
                {content.length} / 500
              </span>
            </label>
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setRecipient(null);
              setContent("");
            }}
            disabled={isSendingMessage}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary min-w-16"
            onClick={async () => {
              if (await sendMessage(recipient.id, content)) {
                showToast(t("message_sent"), "success");
                setRecipient(null);
                setContent("");
              }
            }}
            disabled={isSendingMessage || !content.trim()}
          >
            {isSendingMessage ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              t("send")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageDialog;
