import { User, Bell } from "lucide-react";
import { formatDateTimeString } from "../utils/formatDate";
import MessageContent from "./MessageContent";
import { t } from "i18next";

const MessageCard = ({ message }) => {
  const isSystemMessage = message.senderId === -1;
  const isUnread = !message.read;

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
                <div className="w-10 rounded-full">
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
              <div className="font-semibold">
                {isSystemMessage
                  ? t("system_message")
                  : (message.sender?.username ?? "Unknown User")}
              </div>
              {isUnread && (
                <span className="badge badge-primary badge-sm"> Unread </span>
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
