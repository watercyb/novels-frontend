import DeletionMessage from "./renders/DeletionMessage";

const messageRenderers = {
  SYSTEM: null,
  USER: null,
  NOTIFICATION: null,
  CHAPTER_COMMENT: null,
  COMMENT_REPLIED: null,
  UPDATE_ROLE_REQUEST: null,
  DELETION: DeletionMessage,
};

const MessageContent = ({ message }) => {
  let content;

  try {
    content = JSON.parse(message.messageContent);
  } catch {
    return <p className="text-error">Unable to display this message.</p>;
  }

  const Renderer = messageRenderers[message.type];

  if (!Renderer) {
    return <p>{message.messageContent}</p>;
  }

  return <Renderer content={content} />;
};

export default MessageContent;
