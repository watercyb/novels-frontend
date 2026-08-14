import DeletionMessage from "./renders/DeletionMessage";
import UpdateRoleRequestMessage from "./renders/UpdateRoleRequestMessage";

const messageRenderers = {
  SYSTEM: null,
  USER: null,
  NOTIFICATION: null,
  CHAPTER_COMMENT: null,
  COMMENT_REPLIED: null,
  UPDATE_ROLE_REQUEST: UpdateRoleRequestMessage,
  DELETION: DeletionMessage,
};

const MessageContent = ({ message }) => {
  const Renderer = messageRenderers[message.type];

  if (!Renderer) {
    return <p>{message.messageContent}</p>;
  }

  return <Renderer message={message} />;
};

export default MessageContent;
