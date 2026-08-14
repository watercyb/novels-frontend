import { User, Bell } from "lucide-react";
import { formatDateTimeString } from "../utils/formatDate";
import { t } from "i18next";
import useMessageStore from "./UseMessageStore";
import { useState } from "react";
import MessageContent from "./MessageContent";
import { useNavigate } from "react-router-dom";

const MessageCard = ({ message }) => {
  const isSystemMessage = message.senderId === -1;
  const isUnread = !message.read;
  const { readMessage } = useMessageStore();
  const [isReading, setIsReading] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`card border shadow-sm transition-colors ${isUnread ? "bg-base-200 border-primary/30" : "bg-base-100 border-base-300"}`}
    >
      <div className="card-body py-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            {isSystemMessage ? (
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content w-10 rounded-full">
                  <Bell size={20} />
                </div>
              </div>
            ) : message.sender?.avatarUrl ? (
              <div className="avatar">
                <div
                  className="w-10 rounded-full cursor-pointer"
                  onClick={() => navigate(`/author/${message.sender?.id}`)}
                >
                  <img
                    src={message.sender.avatarUrl}
                    alt={message.sender.username}
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="bg-base-300 w-10 rounded-full">
                  <User size={20} />
                </div>
              </div>
            )}
          </div>
          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              {isSystemMessage ? (
                <div className="font-semibold">{t("system_message")}</div>
              ) : (
                <div
                  className="font-semibold cursor-pointer"
                  onClick={() => navigate(`/author/${message.sender?.id}`)}
                >
                  {message.sender?.username ?? t("unknown_user")}
                </div>
              )}
              {isUnread && !isReading && (
                <span
                  className="badge badge-primary badge-sm cursor-pointer"
                  onClick={async () => {
                    if (!isReading) {
                      setIsReading(true);
                      await readMessage(message.id);
                      setIsReading(false);
                    }
                  }}
                >
                  {t("unread")}
                </span>
              )}
            </div>
            <MessageContent message={message} />
            <div className="mt-2 text-xs text-base-content/50">
              {formatDateTimeString(message.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageCard;
